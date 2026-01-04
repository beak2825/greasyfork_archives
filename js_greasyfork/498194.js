// ==UserScript==
// @name         FPS显示
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  FPS显示是一个用户脚本，旨在为移动端设备提供实时的帧率 (FPS) 显示。该脚本在页面的固定位置创建一个半透明的显示框，实时更新并展示当前页面的帧率信息。
// @license      MIT
// @author       zzzwq
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498194/FPS%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/498194/FPS%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bzyfps = document.createElement("div");
    bzyfps.id = "fps";
    bzyfps.style.cssText =
        "text-align:center !important;font-size:15px;width:70px;height:28px;line-height:28px;text-align:center;float:right;position:fixed;right:10px;top:10px;color:#9370DB;background:transparent;cursor:pointer;z-index:999999999;box-shadow:0px 0px 10px #888;border-radius:10%;user-select:none;pointer-events:none";
    document.body.appendChild(bzyfps);

    var showFPS = (function() {
        var frames = 0;
        var lastTime = performance.now();
        var lastFps = 0;
        var requestId;

        function updateFPS() {
            var currentTime = performance.now();
            var delta = currentTime - lastTime;
            if (delta >= 1000) {
                var fps = Math.round((frames * 1000) / delta);
                if (fps !== lastFps) {
                    bzyfps.textContent = "FPS: " + fps;
                    lastFps = fps;
                }
                lastTime = currentTime;
                frames = 0;
            }
            frames++;
            requestId = requestAnimationFrame(updateFPS);
        }

        function start() {
            requestId = requestAnimationFrame(updateFPS);
        }

        function stop() {
            cancelAnimationFrame(requestId);
        }

        return {
            start: start,
            stop: stop
        };
    })();

    showFPS.start();

    // 监听滚动事件，当用户停止滚动时，可以减少FPS的更新频率
    var isScrolling;
    window.addEventListener('scroll', function(event) {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(function() {
            // 用户停止滚动后的操作
        }, 100);
    }, false);

})();