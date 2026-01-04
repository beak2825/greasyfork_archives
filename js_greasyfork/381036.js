// ==UserScript==
// @name         滑鼠滾輪控制撥放速度
// @namespace    http://nicoconi.com/
// @version      1.0
// @description  滑鼠控制<video>播放速度
// @author       Wang Zheng
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/381036/%E6%BB%91%E9%BC%A0%E6%BB%BE%E8%BC%AA%E6%8E%A7%E5%88%B6%E6%92%A5%E6%94%BE%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/381036/%E6%BB%91%E9%BC%A0%E6%BB%BE%E8%BC%AA%E6%8E%A7%E5%88%B6%E6%92%A5%E6%94%BE%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==
 
window.addEventListener("mousewheel", function(e) {
    if (e.shiftKey) {
        var video = e.target;
        if (video && video.nodeName.toLowerCase() == "video") {
            var delta = e.wheelDelta;
            var rate = video.playbackRate;
            if (delta > 0) {
                rate *= 1.1;
            }
            else {
                rate /= 1.1;
            }
            video.playbackRate = rate;
            var speedDisplay = document.createElement('div');
            speedDisplay.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; background-color: rgba(0, 0, 0, 0.5); color: #fff; padding: 4px; border-radius: 4px; font-size: 16px; font-weight: bold;';
            speedDisplay.textContent = '速度：' + rate.toFixed(1) + 'x';
            document.body.appendChild(speedDisplay);
            setTimeout(function() {
                speedDisplay.parentNode.removeChild(speedDisplay);
            }, 2000);
        }
    }
});
