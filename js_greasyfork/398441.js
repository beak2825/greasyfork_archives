// ==UserScript==
// @name         D糟日語謎片,實時翻譯, 彈屏
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  日語謎片實時翻譯學習(本腳本要註冊騰訊ai開放平台賬號(https://ai.qq.com) , 並需接入相關AI功能, 參考詳閱油猴頁面)
// @author       pulamu
// @match        http://localhost/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://unpkg.com/@khs1994/tencent-ai@19.6.0-alpha.5/dist/tencent-ai.min.js
// @require      https://greasyfork.org/scripts/397958-jquery-barrager-js/code/jquerybarragerjs.js?version=780892

// @resource     customCSS https://vjs.zencdn.net/7.6.6/video-js.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/398441/D%E7%B3%9F%E6%97%A5%E8%AA%9E%E8%AC%8E%E7%89%87%2C%E5%AF%A6%E6%99%82%E7%BF%BB%E8%AD%AF%2C%20%E5%BD%88%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/398441/D%E7%B3%9F%E6%97%A5%E8%AA%9E%E8%AC%8E%E7%89%87%2C%E5%AF%A6%E6%99%82%E7%BF%BB%E8%AD%AF%2C%20%E5%BD%88%E5%B1%8F.meta.js
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

     addStyle('ul li{list-style-type:none;}');
    var newCSS = GM_getResourceText ("customCSS");
    GM_addStyle (newCSS);


    'use strict';
    let header = $('<meta http-equiv="Access-Control-Allow-Origin" content="*" />');
    $("head").append(header)

     /*
     本腳本要註冊騰訊ai開放平台賬號(https://ai.qq.com)
     並需接入相關AI功能, 參考詳閱油猴頁面
     */
    let ai = new TencentAI.TencentAI(
        "XXXX",   // app_sercert 自行後修改
        "YYYY",         // app_id 自行註冊後修改
        "https://www.groupies.online/ai"


    );
    $('body').html("");
    $('body').css("background-color","#000000");
    $("title").html("日語謎片,實時翻譯, 彈屏");
    $('body').prepend('<dir width=80% height="auto" style="z-index:1" ><video id="audio_id" class="video-js" style="display: block;margin: 0 auto;" data-setup="{}" controls preload="auto"></video></dir><script src="https://vjs.zencdn.net/7.6.6/video.js"></script>');

    $("body").prepend('<div class="container2" id="pinBoxContainer" style="font-size: 16px;z-index: 9999;position: relative;  color:#666666;background-color: #f9f9f9;height: 100px;width: 300px;border: 1px solid #D0D0D0; !important;"><button id = "close" style = "float:right; !important;" >X</button><div >油猴:識別語言</div><select id = "source"  style = " !important;"><option value="jp">日本語</option><option value="en">英語</option><option value="kr">韓語</option></select><input type="file" id="file"  style="!important;" accept="video/ogg, video/mp4, video/webm" ><div id="text_info" style = "!important;">商務合作(VX:1909684853)</div></div>');

     $('#close').click( function(){
           $('#pinBoxContainer').hide();

     });

     $('html,body').animate({
            scrollTop: 0
        }, 100);

    $("#file").change(function () {

        var file = document.getElementById('file').files[0];
        var url = URL.createObjectURL(file);
        console.log(url);

        var video = videojs("audio_id");
        video.src({ type: file.type, src: url });
        video.play();


            /**
   * 语音翻译
   *
   * 识别出音频中的文字，并进行翻译
   *
   * @see https://ai.qq.com/doc/speechtranslate.shtml
   * @param {int} format 默认MP3-8 AMR  3/SILK  4/PCM  6/MP3  8/AAC  9
   * @param {int} seq 默认0 语音分片所在语音流的偏移量（字节）
   * @param {int} end 默认1  0  中间分片/1  结束分片
   * @param {string} session_id   非空且长度上限64B
   * @param {string} speech_chunk 语音分片数据的Base64编码，非空且长度上限8MB
   * @param {string} source 默认auto 中文  zh / 英文  en/ 日文  jp /韩文  kr / 自动识别（中英互译）  auto
   * @param {string} target 默认auto  en=>  zh / zh=>  en, jp, kr / jp=>zh / kr=> zh
   *
   * @return {Promise} A Promise Object
   */

        var max = 0
        if (navigator.mediaDevices.getDisplayMedia) {
            var chunks = [];
            const constraints = { video: true ,audio: true };
            navigator.mediaDevices.getDisplayMedia(constraints).then(
                stream => {



                    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    var analyser = audioCtx.createAnalyser();
                    source = audioCtx.createMediaStreamSource(stream);
                    source.connect(analyser);

                    analyser.fftSize = 2048;
                    var bufferLength = analyser.frequencyBinCount;
                    var dataArray = new Uint8Array(bufferLength);







                    console.log("授权成功！");
                    stream.getVideoTracks()[0].stop();
                    stream.removeTrack(stream.getVideoTracks()[0]);
                    const mediaRecorder = new MediaRecorder(stream);



                    setTimeout(() => {
                        mediaRecorder.start();


                        console.log("录音中...");

                        console.log("录音器状态：", mediaRecorder.state);
                        $("#text_info").html("運行中...")
                    },6000);

                    setInterval(() => {
                        max = max +  1
                        analyser.getByteTimeDomainData(dataArray);
                        //console.log(dataArray);
                        //analyser.getByteFrequencyData(dataArray);
                        console.log(dataArray);

                        var s = 0
                        for (var i = 0; i < bufferLength; i++) {
                            barHeight = dataArray[i]
                            if (barHeight >= 127 - 127 *5/100 && barHeight <= 128 + 128 *5/100  ){
                                s = s+ 1
                            }


                        }
                        console.log(s / bufferLength);
                        console.log(max)

                        if(s / bufferLength >= 0.8 || max > 3){
                            mediaRecorder.stop();
                            console.log("停止录音...");

                            console.log("录音器状态：", mediaRecorder.state);

                            max = 0;
                        }


                    },5000);


                    chunks = []
                    mediaRecorder.ondataavailable = function(e) {
                        chunks.push(e.data);

                    };



                    mediaRecorder.onstop = e => {
                        var blob = new Blob(chunks,{type : 'audio/mp3'});
                        chunks = [];
                        mediaRecorder.start();
                        var audioURL = URL.createObjectURL(blob);
                        console.log(audioURL);
                        let reader = new FileReader();
                        reader.readAsDataURL(blob); // converts the blob to base64 and calls onload
                        reader.onloadend = function() {

                            var base64data = reader.result;
                            var b64 = reader.result.replace(/^data:.+;base64,/, '');

                            var source = $("#source").val();
                            $("#text_info").html(source + "翻譯中...")

                            ai.translate.speech(b64,audioURL.replace('blob:' + location.protocol + '//' + location.hostname + '/',''),8,0,1,source,'zh').then(res => {
                                console.log("FOO33");
                                console.log(res);
                                //console.log(res.data.source_text);
                                //console.log(res.data.target_text);
                                $("#text_info").html(res.msg)
                                if (res.data.source_text !== "")
                                {
                                    var word = res.data.source_text + "(" + res.data.target_text + ")"
                                    var item={
                                        img:'', //图片
                                        info:  res.data.source_text + "(" + res.data.target_text + ")" , //文字
                                        href:'javascript:void(0)', //链接
                                        close:true, //显示关闭按钮
                                        speed:16, //延迟,单位秒,默认6
                                        color:'#fff', //颜色,默认白色
                                        old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色
                                    }
                                    $('body').barrager(item);
                                    $("#text_info").html(res.data.target_text)
                                    $('.z a').removeAttr('target');
                                    if (word.length >=40){
                                       $('.barrage_box').css("height","100px");
                                    }
                                    $('.barrage_box').setAttribute('class', 'player full-screen');
                                }

                            });
                            //console.log(b64);
                        }


                    };
                },
                () => {
                    console.error("授权失败！");
                    $("#text_info").html("授权失败！")
                }
            );
        } else {
            console.error("浏览器不支持 getUserMedia");
            $("#text_info").html("浏览器不支持 getUserMedia")
        }

    });

    // Your code here...
})();