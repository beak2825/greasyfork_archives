// ==UserScript==
// @name         SSE Helper
// @namespace    https://github.com/xqm32/sse-spider
// @version      1.2
// @description  SSE 助手
// @author       xqm
// @match        *://*/*train/q.aspx*
// @match        *://*/*train/view.aspx*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445612/SSE%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/445612/SSE%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.evaluate("//h1", document).iterateNext().innerHTML += document.evaluate("//div[contains(@class,'q')]", document).iterateNext().id;
})();