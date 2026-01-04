// ==UserScript==
// @name         改字体
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  更改网页上的字体
// @author       share121
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457685/%E6%94%B9%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/457685/%E6%94%B9%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let font = ["DingTalk JinBuTi"]
    document.head.append(document.createRange().createContextualFragment(`<style>*{font-family:${font.map(e=>`"${e}"`).join(",")}!important;}</style>`))
})();