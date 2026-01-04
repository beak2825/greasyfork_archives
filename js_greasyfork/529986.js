// ==UserScript==
// @name         屏蔽B站 W键 投币
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  B站网页版按键盘W键会弹出投币窗口，很容易误投币，因此使用脚本屏蔽W键盘事件。
// @author       roy
// @match        https://www.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529986/%E5%B1%8F%E8%94%BDB%E7%AB%99%20W%E9%94%AE%20%E6%8A%95%E5%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/529986/%E5%B1%8F%E8%94%BDB%E7%AB%99%20W%E9%94%AE%20%E6%8A%95%E5%B8%81.meta.js
// ==/UserScript==
(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.key === 'w' || e.key === 'W') {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    });

})();