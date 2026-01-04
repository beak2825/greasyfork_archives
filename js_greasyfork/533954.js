// ==UserScript==
// @name         启用yj-select
// @namespace    http://tampermonkey.net/
// @version      2025-04-33
// @description  启用yj-select22
// @author       You
// @run-at       document-idle
// @match        file:///D:/datas/other/*
// @match        https://ilearning.zte.com.cn/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533954/%E5%90%AF%E7%94%A8yj-select.user.js
// @updateURL https://update.greasyfork.org/scripts/533954/%E5%90%AF%E7%94%A8yj-select.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    $(document).ready(function() {
        // 定义 setTimeout 的回调函数
        var enableRightClickAndSelection = function() {
            document.oncontextmenu = function() { // 启用右键
                return true;
            };
            document.body.onselectstart = function() {
                return true;
            };
        };

        // 延迟 10 秒执行
        setTimeout(enableRightClickAndSelection, 3000);
    });

})(jQuery);