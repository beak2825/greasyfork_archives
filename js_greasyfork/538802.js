// ==UserScript==
// @name         解除網頁複製鎖定
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  解除網頁上的複製貼上限制，允許在所有網站上自由複製貼上內容
// @license MIT
// @author       scbmark
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538802/%E8%A7%A3%E9%99%A4%E7%B6%B2%E9%A0%81%E8%A4%87%E8%A3%BD%E9%8E%96%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/538802/%E8%A7%A3%E9%99%A4%E7%B6%B2%E9%A0%81%E8%A4%87%E8%A3%BD%E9%8E%96%E5%AE%9A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const forceEnableCopyPaste = (e) => {
        e.stopImmediatePropagation();
        return true;
    };

    ['paste', 'copy'].forEach(event => {
        document.addEventListener(event, forceEnableCopyPaste, true);
    });
})();