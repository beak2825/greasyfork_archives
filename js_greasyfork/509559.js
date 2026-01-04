// ==UserScript==
// @name         最近访问的标签
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  标签页失去焦点后，显示30s的倒计时，方便快速定位。
// @author       Lucas
// @match        https://**/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509559/%E6%9C%80%E8%BF%91%E8%AE%BF%E9%97%AE%E7%9A%84%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/509559/%E6%9C%80%E8%BF%91%E8%AE%BF%E9%97%AE%E7%9A%84%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let title;
    let intervalId;

    // 当窗口失去焦点时触发
    window.onblur = function() {

        let count = 30;
        title = document.title;
        document.title = `${count}-${title}`;

        intervalId = setInterval(() => {

            count--;
            document.title = `${count}-${title}`;

            // 当计数减到0时，清除定时器并恢复原始标题
            if (count <= 0) {
                clearInterval(intervalId);
                document.title = title;
            }
        }, 1000);
    };

    // 当窗口获得焦点时恢复原始标题
    window.onfocus = function() {
        clearInterval(intervalId);
        document.title = title ? title : document.title;
    };

})();