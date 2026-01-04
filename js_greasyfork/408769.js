// ==UserScript==
// @name        熬夜刷知乎
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动开启知乎的原生夜间模式
// @author       琴梨梨
// @match        https://*.zhihu.com/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/408769/%E7%86%AC%E5%A4%9C%E5%88%B7%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/408769/%E7%86%AC%E5%A4%9C%E5%88%B7%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        document.getElementsByTagName("html")[0].setAttribute("data-theme","dark");
    }
})();