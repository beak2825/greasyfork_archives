// ==UserScript==
// @name         Hifini Auto Click VIP Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击VIP按钮
// @author       Jack Ou
// @icon        https://www.hifini.com/view/img/logo.png
// @match        http*://www.hifini.com/*
// @match        http*://*.lanzn.com/*
// @grant        none
// @license MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/510700/Hifini%20Auto%20Click%20VIP%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/510700/Hifini%20Auto%20Click%20VIP%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载
    window.onload = function() {
        // 查找第一个按钮
        var button1 = document.getElementById('dp_code');
        if (button1) {
            // 自动点击第一个按钮
            button1.click();
        }

            // 等待2秒后点击第二个按钮
            setTimeout(function() {
                var button2 = document.getElementById('lp_code');
                if (button2) {
                    // 自动点击第二个按钮
                    button2.click();
                }
            }, 2000); // 1000毫秒 = 1秒
    };
})();