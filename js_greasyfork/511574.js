// ==UserScript==
// @name         禁止copilot检测tab键
// @namespace    http://tampermonkey.net/
// @version      2024-10-05
// @description  这个自动填充烦死了
// @author       兰屿绿蠵龟
// @match        https://copilot.microsoft.com/?dpwa=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511574/%E7%A6%81%E6%AD%A2copilot%E6%A3%80%E6%B5%8Btab%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/511574/%E7%A6%81%E6%AD%A2copilot%E6%A3%80%E6%B5%8Btab%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            event.stopImmediatePropagation();
        }
    }, true);
})();
