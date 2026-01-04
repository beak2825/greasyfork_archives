// ==UserScript==
// @name         继续教育视频加速刷课挂课|2023丽水公需课
// @namespace    http://tampermonkey.net/
// @version      1.0.26
// @description  任意浏览器视频倍速播放，按键调速|此脚本智能加速|如需代刷请联系V:daixuegongxu欢迎个人或代理前来咨询|
// @author       mengshu
// @include      *
// @icon         data:image/png;base64,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
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463808/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E5%88%B7%E8%AF%BE%E6%8C%82%E8%AF%BE%7C2023%E4%B8%BD%E6%B0%B4%E5%85%AC%E9%9C%80%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/463808/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%E5%88%B7%E8%AF%BE%E6%8C%82%E8%AF%BE%7C2023%E4%B8%BD%E6%B0%B4%E5%85%AC%E9%9C%80%E8%AF%BE.meta.js
// ==/UserScript==
 
 
//轻提醒
function Toast(msg, duration) {
    let p1 = new Promise((resolve,reject)=>{
        duration = isNaN(duration) ? 3000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(m)
            }, d * 1000);
        }, duration);
    });
}
 
async function mainFunc(){
    document.body.onkeydown = function(ev) {
        var e = ev || event;
        let video = document.getElementsByTagName('video')[0]
        console.log('test');
        if(video){
            switch(e.keyCode){
                case 87: //w键
                    video.playbackRate += 0.25;
                    Toast(video.playbackRate,100);
                    break;
                case 83: //s键
                    video.playbackRate -= 0.25
                    Toast(video.playbackRate,100);
                    break;
                case 39: //→
                    video.currentTime += 5;
                    break;
                case 37: //←
                    video.currentTime -= 5;
                    break;
                case 38: //↑
                    video.volume += 0.1;
                    Toast(video.volume,100);
                    break;
                case 40: //↓
                    video.volume -= 0.1;
                    Toast(video.volume,100);
                    break;
                case 49: //1
                    video.playbackRate = 1;
                    Toast(video.playbackRate,100);
                    break;
                case 50: //2
                    video.playbackRate = 2;
                    Toast(video.playbackRate,100);
                    break;
                case 51: //3
                    video.playbackRate = 3;
                    Toast(video.playbackRate,100);
                    break;
                case 52: //4
                    video.playbackRate = 4;
                    Toast(video.playbackRate,100);
                    break;
                default:
                    return e;
            }
        }
    }
}
 
(function() {
    'use strict';
    function isAlert(){
        return false
    }
    
    function changeClock()
    {
        var d = new Date((++time) * 1000);
        var d2 = new Date((++totalTime) * 1000);
        $("#nowTime").html(d.getUTCHours() + ":" + d.getMinutes() + ":" + d.getSeconds()) ;
        $("#totalTime").html(d2.getUTCHours() + ":" + d2.getMinutes() + ":" + d2.getSeconds()) ;
    }
    
    clockTimer = window.setInterval(changeClock, 10);
    saveTimer = window.setInterval(learningSave, 1200);
})();
 
 
(function() {
    'use strict';
    window.onhashchange=mainFunc;
    mainFunc();
    // Your code here...
})();