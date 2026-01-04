// ==UserScript==
// @name         (av01.tv, pornhub)日語謎片,實時翻譯, 彈屏
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  日語謎片實時翻譯學習(本腳本要註冊訊飛開放平台賬號(https://www.xfyun.cn/) , 並需接入相關功能, 參考詳閱油猴頁面)
// @author       pulamu
// @match        https://www.youtube.com/watch?v=*
// @match        https://www.av01.tv/video/*
// @match        https://*.pornhub.com/view_video.php*
// @match        https://*.pornhubpremium.com/view_video.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/crypto-js.js

// @require      https://cdn.jsdelivr.net/gh/hou000123/VoiceDictation@b000cd6b61bb1b5087e2f26efe9a2d9c6e581be2/js/transcode.worker.js
// @require      https://cdn.jsdelivr.net/gh/hou000123/VoiceDictation@b000cd6b61bb1b5087e2f26efe9a2d9c6e581be2/js/voice.js
// @require      https://cdn.jsdelivr.net/gh/webpop/jquery.pin@7aae4cd7fa5b9467ea7efc75909aff8e60446bfc/jquery.pin.js
// @require      https://cdn.jsdelivr.net/gh/yaseng/jquery.barrager.js@4d9d865ccec1591ae7f23e8684b878df02cbea2e/dist/js/jquery.barrager.min.js
// @downloadURL https://update.greasyfork.org/scripts/397959/%28av01tv%2C%20pornhub%29%E6%97%A5%E8%AA%9E%E8%AC%8E%E7%89%87%2C%E5%AF%A6%E6%99%82%E7%BF%BB%E8%AD%AF%2C%20%E5%BD%88%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/397959/%28av01tv%2C%20pornhub%29%E6%97%A5%E8%AA%9E%E8%AC%8E%E7%89%87%2C%E5%AF%A6%E6%99%82%E7%BF%BB%E8%AD%AF%2C%20%E5%BD%88%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
     let addStyle = function (aCss) {
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    }
     addStyle(`
*.barrage{position: fixed;bottom:70px;right:-500px;display: inline-block;width: 500px;z-index: 99999;}
*.barrage_box{background-color: rgba(0,0,0,.5);padding-right: 8px; height: 40px;display: inline-block;border-radius: 25px;transition: all .3s;}
*.barrage_box .portrait{ display: inline-block;margin-top: 4px; margin-left: 4px; width: 32px;height: 32px;border-radius: 50%;overflow: hidden;}
*.barrage_box .portrait img{width: 100%;height: 100%;}
*.barrage_box div.p a{ margin-right: 2px; font-size: 14px;color: #fff;line-height: 40px;margin-left: 18px; }
*.barrage_box div.p a:hover{text-decoration: underline;}
*.barrage_box .close{visibility: hidden;opacity: 0; text-align: center; width:25px;height: 25px;margin-left: 20px;border-radius: 50%;background:rgba(255,255,255,.1);margin-top:8px; background-image: url(close.png);}
*.barrage_box:hover .close{visibility:visible;opacity: 1;}
*.barrage_box .close a{display:block;}
*.barrage_box .close .icon-close{font-size: 14px;color:rgba(255,255,255,.5);display: inline-block;margin-top: 5px; }
*.barrage .z {float: left !important;}
*.barrage  a{text-decoration:none;}
`)
    'use strict';



    $("html").prepend('<div class="container2" id="pinBoxContainer" style="font-size: 16px;z-index: 9999;position: relative;  color:#666666;background-color: #f9f9f9;height: 120px;width: 300px;border: 1px solid #D0D0D0; !important;"><button id = "close" style = "float:right; !important;" >X</button><div >油猴:識別語言</div><select id = "source"  style = " !important;"><option value="ja_jp">日本語</option><option value="en_us">英语</option></select><br><div id="text_info" style=" style = " !important;">商務合作(VX:1909684853)</div><br><div id="text_info2" style=" style = " !important;"><a target="_blank"  href="https://greasyfork.org/zh-CN/scripts/397959-av01-tv-pornhub-%E6%97%A5%E8%AA%9E%E8%AC%8E%E7%89%87-%E5%AF%A6%E6%99%82%E7%BF%BB%E8%AD%AF-%E5%BD%88%E5%B1%8F">已改用訊飛API(電擊復活)</a></div></div>');

     $('#close').click( function(){
           $('#pinBoxContainer').hide();

     });

     $('html,body').animate({
            scrollTop: 0
        }, 100);



    let fiveTell = null;
    let fiveTell2 = null;
    let voiceStatus = 1;
    let trans = "";
    $( "#source" ).change( function (){
         voice.language = $( "#source" ).val();
    });
    let voice = new Voice({

                // 服务接口认证信息 注：apiKey 和 apiSecret 的长度都差不多，请要填错哦，！

                appId: 'XXX',
                apiSecret: 'YYY',
                apiKey: 'ZZZ',
               language:'ja_jp',
                // 注：要获取以上3个参数，请到迅飞开放平台：https://www.xfyun.cn/services/voicedictation 【注：这是我的迅飞语音听写（流式版）每天服务量500（也就是调500次），如果你需求里大请购买服务量：https://www.xfyun.cn/services/voicedictation?target=price】

                onWillStatusChange: function (oldStatus, newStatus) {
                    //可以在这里进行页面中一些交互逻辑处理：注：倒计时（语音听写只有60s）,录音的动画，按钮交互等！
                    //console.log(oldStatus,newStatus)
                },
                onTextChange: function (text) {
                    //监听识别结果的变化
                    //console.log(text)

                    // 3秒钟内没有说话，就自动关闭
                    if (text) {
                        console.log(text);
                        trans = text;
                        clearTimeout(fiveTell);
                        fiveTell = setTimeout(() => {
                            this.stop();
                            voiceStatus = 1;
                        }, 3000);

                    } else {
                        clearTimeout(fiveTell2);
                        fiveTell2 = setTimeout(() => {
                            this.stop();
                            voiceStatus = 1;
                        }, 6000);
                    }

                }
            });
    setInterval(() => {
        if (voiceStatus == 1){
            voiceStatus = 0;
            voice.start();
        }
    },1000);

    setInterval(() => {
        if (trans != ""){
            var url2 = 'https://api.66mz8.com/api/translation.php?info=' + trans;
            trans = ""
           $.get( url2 , function( res ) {
               console.log(res)
               var word = res.info + "(" + res.fanyi + ")"
               var item={
                   img:'', //图片
                   info:  res.info + "(" + res.fanyi + ")" , //文字
                   href:'javascript:void(0)', //链接
                   close:true, //显示关闭按钮
                   speed:16, //延迟,单位秒,默认6
                   color:'#fff', //颜色,默认白色
                   old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色
               }
               $('body').barrager(item);
                $('.z a').removeAttr('target');
               if (word.length >=40){
                   $('.barrage_box').css("height","100px");
               }

           });
        }
    },1000);

    // Your code here...
})();