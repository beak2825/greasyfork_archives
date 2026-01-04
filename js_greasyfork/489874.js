// ==UserScript==
// @name         【万能视频自动刷课时】各类专业技术人员需要刷专业课·····
// @version      1.0
// @description  【https://www.zaixian100f.com/】【Q21293152】。
// @author       万能脚本
// @match        http://www.zaixian100f.com
// @license      MIT
// @namespace http://www.zaixian100f.com
// @downloadURL https://update.greasyfork.org/scripts/489874/%E3%80%90%E4%B8%87%E8%83%BD%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E6%97%B6%E3%80%91%E5%90%84%E7%B1%BB%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E9%9C%80%E8%A6%81%E5%88%B7%E4%B8%93%E4%B8%9A%E8%AF%BE%C2%B7%C2%B7%C2%B7%C2%B7%C2%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/489874/%E3%80%90%E4%B8%87%E8%83%BD%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E6%97%B6%E3%80%91%E5%90%84%E7%B1%BB%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E9%9C%80%E8%A6%81%E5%88%B7%E4%B8%93%E4%B8%9A%E8%AF%BE%C2%B7%C2%B7%C2%B7%C2%B7%C2%B7.meta.js
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
    window.onhashchange=mainFunc;
    mainFunc();
    // Your code here...
})();