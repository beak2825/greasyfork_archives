// ==UserScript==
// @name         Nfu抢课助手
// @namespace    https://blog.csdn.net/m0_74194018?type=blog
// @version      2.1.3
// @description  设置热键开关(w)连续模拟左键点击选课系统
// @author       aj__212
// @match        http://ecampus.nfu.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483667/Nfu%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/483667/Nfu%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clickRunning = false;
    let clickInterval;

    function startClicking() {
        clickRunning = true;
        clickInterval = setInterval(() => {
            // 模拟左键点击
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            document.body.dispatchEvent(event);
        }, 500); // 设置点击间隔，单位为毫秒
    }

    function stopClicking() {
        clickRunning = false;
        clearInterval(clickInterval);
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'w') {
            if (clickRunning) {
                stopClicking();
            } else {
                startClicking();
            }
        }
    });

})();
