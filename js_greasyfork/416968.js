// ==UserScript==
// @license MIT
// @name         b站聊天弹幕（自己发出去的弹幕）翻译成日语或其他
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  个人的备份版。当前有很大瑕疵，但是能用。学完vue再来搞回车发送的问题。
// @author       kittyguy
// @connect      cdn.jsdelivr.net
// @require      https://greasyfork.org/scripts/416533-%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91api%E7%9A%84md5/code/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91api%E7%9A%84md5.js?version=872196
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match        https://www.douyu.com/*
// @match        https://www.twitch.tv/*
// @match        https://www.youtube.com/*
// @match        https://live.bilibili.com/*
// @grant        none
// @grant        unsafewindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/416968/b%E7%AB%99%E8%81%8A%E5%A4%A9%E5%BC%B9%E5%B9%95%EF%BC%88%E8%87%AA%E5%B7%B1%E5%8F%91%E5%87%BA%E5%8E%BB%E7%9A%84%E5%BC%B9%E5%B9%95%EF%BC%89%E7%BF%BB%E8%AF%91%E6%88%90%E6%97%A5%E8%AF%AD%E6%88%96%E5%85%B6%E4%BB%96.user.js
// @updateURL https://update.greasyfork.org/scripts/416968/b%E7%AB%99%E8%81%8A%E5%A4%A9%E5%BC%B9%E5%B9%95%EF%BC%88%E8%87%AA%E5%B7%B1%E5%8F%91%E5%87%BA%E5%8E%BB%E7%9A%84%E5%BC%B9%E5%B9%95%EF%BC%89%E7%BF%BB%E8%AF%91%E6%88%90%E6%97%A5%E8%AF%AD%E6%88%96%E5%85%B6%E4%BB%96.meta.js
// ==/UserScript==
(function(){
    'use strict';
    let $ = window.jQuery;
    let appid = '20201121000622236';
    let key = 'znFjX9HjUUgsUtfmDayw';
    let flag=false;
    //斗鱼开始
    /*setTimeout(function(){
        $(document).keydown(function (e) {
            if (e.which==13){
                $('.ChatSend-button').click();
            }
        });
        $('.ChatSend-button ').on('click',function(){
            // alert(1)
            let query;
            if(flag=!flag){
                query = $('.ChatSend-txt').val();
                $('.ChatSend-txt').val('');
                translation(query,'zh','jp').then(value => {$('.ChatSend-txt').val(value);console.log(value);}).then(()=>{if(flag){$('.ChatSend-button').click();}});
            }
        });
    },3000);*/
    //bilibli开始
setTimeout(function(){
    $(window).on('keydown',function (e) {
        if (e.which==13){
            $('.chat-input.border-box').click();
            //alert(1)
        }
    });
    $('.chat-input.border-box').click(function(){
        // alert(1)
        let query;
        //if(flag=!flag){
            let event = document.createEvent('Event')
            event.initEvent('input', true, true);
            // 选择器填写弹幕内容
            //console.log($('.chat-input.border-box').val());
            query = $('.chat-input[data-v-0b7ba303]').val();
            console.log(query);
            $('.chat-input[data-v-0b7ba303]').val('');
            translation(query,'zh','jp').then(value =>
                                              {let event = document.createEvent('Event')
                                              event.initEvent('input', true, true);
                                               $('.chat-input[data-v-0b7ba303]').val(value);
                                               $('.chat-input[data-v-0b7ba303]')[0].dispatchEvent(event);
                                               console.log(value);}).then(()=>
                                                                          {$('.bl-button.live-skin-highlight-button-bg.bl-button--primary.bl-button--small').click();});
        }
    );
},5000);
setTimeout(addjQ(),9000);
//twitch开始
/*setTimeout(function(){
        flag=false;
        let a=$("textarea[data-a-target='chat-input']");
        let b=$("button[data-a-target='chat-send-button']");
        $(document).keydown(function (e) {
            if (e.which==13){
                $("button[data-a-target='chat-send-button']").click();
            }
        })
        $("button[data-a-target='chat-send-button']").on('click',function(){
             //alert(1)
            let query;
            if(flag=!flag){
                $("textarea[data-a-target='chat-input']")[0].focus();
                query = $("textarea[data-a-target='chat-input']").text();
                alert(query+'1');
                $("textarea[data-a-target='chat-input']").text('');
                translation(query,'zh','en');
                setTimeout(function () {
                    $("textarea[data-a-target='chat-input']")[0].focus();
                    $("textarea[data-a-target='chat-input']").text(s);
                    alert(s+'2');
                    if(flag){
                      $("button[data-a-target='chat-send-button']").click();
                    }
                },3000)
            }
        });
    },9000)*/
function addjQ(){//如果网站不支持jQuery可以运行这个方法
    var jq = document.createElement('script');
    jq.src = "https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(jq);
}
function translation(uquery,ufrom,uto) {//返回的是Promise对象
    return new Promise((resolve, reject) => {
        let salt = (new Date).getTime();
        let query = uquery;
        // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
        let from = ufrom;
        let to = uto;
        let str1 = appid + query + salt + key;
        let sign = window.MD5(str1);//签名
        $.ajax({
            url: '//api.fanyi.baidu.com/api/trans/vip/translate/non-https',
            type: 'get',
            dataType: 'jsonp',
            async: false,
            data: {
                q: query,
                appid: appid,
                salt: salt,
                from: from,
                to: to,
                sign: sign
            },
            success: function (data) {
                if (data != null) {
                    resolve(data.trans_result[0].dst);//百度翻译返回的结果
                    // console.table(query);
                    //$('#val').val(s)
                    //console.log(2)
                    //alert(s)
                }
            }

        });
    })
}
})();
/*
在检测到回车的时候会提交弹幕内容并且清空textarea，等他的keydown事件执行完了再执行你的keydown事件，自然就读不到东西了。
如果你单纯就是想知道发送了什么，可以去读网站的vue变量，b站在聊天框上绑定了一个vue变量，用.lastdanmajku属性可以看到上一次发送了什么。----manakanemu*/