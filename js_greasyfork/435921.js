// ==UserScript==
// @name         TX NBA
// @namespace    http://tampermonkey.net/
// @version      0.93
// @description  腾讯nba小助手
// @author       ok!
// @match        https://kbs.sports.qq.com/kbsweb/game*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435921/TX%20NBA.user.js
// @updateURL https://update.greasyfork.org/scripts/435921/TX%20NBA.meta.js
// ==/UserScript==

//调整滚轮前进后退的秒数
var wheel_sec = 8;
//等待广告误伤提示的秒数
var playcheck_time=8000;
var timeadd=1;
var video_elem1;
var video_elem2;
var v_elem;

let a_bug15 = document.createElement("script");
a_bug15.innerHTML = `const _createClass = 0;const _classCallCheck= 0;const _typeof = 0;const beacon= 0;window.Beacon=0;const str=0;`;
document.head.appendChild(a_bug15);
console.log("not-playing4");

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
})

function clean_ads(){

    var clear_mark = setInterval(function(){
        //点击开始播放
        /*
            if(document.querySelector("#tvpLiveMod > txpdiv > txpdiv.txp_video_container > video")){

                document.querySelector("#tvpLiveMod > txpdiv > txpdiv.txp_video_container > video").autoplay=true;
                setTimeout(function(){
                    if(document.querySelector("#tvpLiveMod > txpdiv > txpdiv.txp_video_container > video").playing)
                    {console.log("playing0");}
                    else{
                        document.querySelector("#tvpLiveMod > txpdiv > txpdiv.txp_bottom > txpdiv > txpdiv.txp_left_controls > txpdiv.txp_btn.txp_btn_play").click();
                        console.log("not-playing0");
                     setTimeout(function(){
                        //广告暂替刷新
            if(document.querySelector("#tvpLiveMod > txpdiv > txp")){
            console.log("成功刷新");
            window.location.reload(true);
        }},3000);
                    }},7000);


            }
*/

//广告暂替刷新
        if(document.querySelector("#tvpLiveMod > txpdiv > txp")){
            console.log("成功刷新");
            window.location.reload(true);

        }
        //大大大
        else{

            //watermark

            if(document.querySelector("#tvpLiveMod > txpdiv > txpdiv.txp_video_container > video")||document.querySelector("#tvpVideoPopupMod")){


                if (document.querySelector("txpdiv.txp-watermark")){
                    setTimeout(function(){document.querySelector("txpdiv.txp-watermark").remove();
                                          // document.querySelector("txpdiv.txp_top_btns").remove();
                                          // document.querySelector("txpdiv.txp_bottom > txpdiv > txpdiv.txp_right_controls > txpdiv:nth-child(3) > txpdiv.txp_popup.txp_popup_definition > txpdiv > txpdiv:nth-child(3)").click();
                                         },1000);
                }
                if (document.querySelector("txpdiv.txp-watermark")){
                    setTimeout(function(){document.querySelector("txpdiv.txp-watermark").remove();
                                          // document.querySelector("txpdiv.txp_top_btns").remove();
                                          // document.querySelector("txpdiv.txp_bottom > txpdiv > txpdiv.txp_right_controls > txpdiv:nth-child(3) > txpdiv.txp_popup.txp_popup_definition > txpdiv > txpdiv:nth-child(3)").click();
                                         },1000);
                }
                //document.querySelector("#tvpVideoMod txpdiv.txp-watermark").remove();
                video_elem1 = document.querySelector("#tvpVideoPopupMod > div.txp_videos_container > video:nth-child(1)");
                v_elem = document.querySelector("#tvpVideoPopupMod");

                //
                if(document.querySelector("#tvpVideoPopupMod > txpdiv.txp_player_external")){
                    video_elem2 = document.querySelector("#tvpVideoPopupMod > txpdiv.txp_player_external");
                    video_elem2.onwheel = function(e){e.preventDefault()};
                }

                video_elem1.onwheel = function(e){e.preventDefault()};

                v_elem.onwheel = function(e){e.preventDefault()};
                v_elem.onwheel = wheel_e;

 function wheel_e (event) {
                    event.preventDefault();
                    video_elem1.currentTime += (event.deltaY>0?wheel_sec/1:-wheel_sec) ;
                    v_elem.onwheel="";
                    setTimeout(function(){v_elem.onwheel= wheel_e;},300);

                }
                console.log("第1个live= ");

            }
            /*
         else if(document.querySelector("#tvpLiveMod > txpdiv > txpdiv.txp_watermark")){
               document.querySelector("#tvpLiveMod > txpdiv > txpdiv.txp_watermark").remove();

            }
*/

else if (document.querySelector("#tvpVideoMod")){

                if (document.querySelector("#tvpVideoMod txpdiv.txp-watermark")){
                    setTimeout(function(){document.querySelector("#tvpVideoMod txpdiv.txp-watermark").remove();
                                          // document.querySelector("#tvpVideoMod txpdiv.txp_top_btns").remove();
                                          document.querySelector("#tvpVideoMod txpdiv.txp_bottom > txpdiv > txpdiv.txp_right_controls > txpdiv:nth-child(3) > txpdiv.txp_popup.txp_popup_definition > txpdiv > txpdiv:nth-child(3)").click();
                                         },1000);
                }

                // 滚轮前进后退   

                video_elem1 = document.querySelector("video");

                // video_elem2 = document.querySelector("#tvpVideoMod > div.txp_videos_container > video:nth-child(2)");
                v_elem = document.querySelector("#tvpVideoMod");
                //document.querySelector("#tvpVideoMod > div.txp_videos_container");

                video_elem1.onwheel = function(e){e.preventDefault()};
                //  video_elem2.onwheel = function(e){e.preventDefault()};
                v_elem.onwheel = function(e){e.preventDefault()};
                v_elem.onwheel = wheel_e;

                function wheel_e (event) {
                    event.preventDefault();


                    // event.deltaY = Math.min(Math.max(.125,event.deltaY), 4);
                    //console.log(wheel_sec);
                    video_elem1.currentTime += (event.deltaY>0?wheel_sec/1:-wheel_sec) ;

                    v_elem.onwheel="";
                    setTimeout(function(){v_elem.onwheel= wheel_e;},300);

                }
                console.log("第2个video= ");

            }
            //点击开始播放

            if(document.querySelector("#tvpLiveMod > txpdiv > txpdiv.txp_video_container > video")){

                //  document.querySelector("#tvpLiveMod > txpdiv > txpdiv.txp_video_container > video").autoplay=true;
                setTimeout(function(){
                    if(document.querySelector("#tvpLiveMod > txpdiv > txpdiv.txp_video_container > video").playing)
                    {console.log("playing");}
                    else{
                        document.querySelector("#tvpLiveMod > txpdiv > txpdiv.txp_bottom > txpdiv > txpdiv.txp_left_controls > txpdiv.txp_btn.txp_btn_play").click();
                        console.log("not-playing");

                        setTimeout(function(){
                            //广告暂替刷新
                            if(document.querySelector("#tvpLiveMod > txpdiv > txp")){
                                console.log("成功刷新");
                                window.location.reload(true);
                            }},3000);

                    }
                },playcheck_time);

            }



            // if(document.querySelector("#tvpVideoMod > txpdiv.txp_player.txp_player_desktop")||document.querySelector("#tvpLiveMod > txpdiv")){

            //  console.log("运行完次数"+timeadd++);

            clearInterval(clear_mark);

            //  }

        }

    },6000);
}

/*
        if(document.querySelector("#tvpLiveMod txp.txp_overlay_error")){document.querySelector("#tvpLiveMod txp.txp_overlay_error").remove();}
    }
*/

clean_ads();


//以下代码有参考"天天の記事簿"的博客
(function() {
    function ajaxEventTrigger(event) {
        var ajaxEvent = new CustomEvent(event, { detail: this });
        window.dispatchEvent(ajaxEvent);
    }

    var oldXHR = window.XMLHttpRequest;

    function newXHR() {
        var realXHR = new oldXHR();
        // this指向window
        realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);

        realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);

        realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);

        realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);

        realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);

        realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);
realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);

        realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);

        return realXHR;
    }

    window.XMLHttpRequest = newXHR;
})();
//调用
var xhr = new XMLHttpRequest();

window.addEventListener('ajaxReadyStateChange', function (e) {
    //console.log(e.detail.responseText); // XMLHttpRequest Object
    let jsonto_array=JSON.parse(e.detail.responseText);
    console.log(jsonto_array.data.isPay);
    if(jsonto_array.data.isPay){
        clean_ads();
    }
});
window.addEventListener('ajaxAbort', function (e) {
    //console.log(e.detail.responseText); // XHR 返回的内容
});
/*
xhr.open('GET', 'info.json');
xhr.send();
*/