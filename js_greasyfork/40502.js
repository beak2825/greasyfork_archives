// ==UserScript==
// @name         markdown生成带网页标题的链接
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Cooper
// @match        *://*/*
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/40502/markdown%E7%94%9F%E6%88%90%E5%B8%A6%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E7%9A%84%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/40502/markdown%E7%94%9F%E6%88%90%E5%B8%A6%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E7%9A%84%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function getMdToUrl(title, url) {
        return `[${title}](${url})`;
    }
    function copyText(text) {
        let copyInput = document.createElement('input');
        copyInput.type = 'text';
        document.body.appendChild(copyInput);
        copyInput.value = text;
        copyInput.select();
        const result = document.execCommand('Copy');
        document.body.removeChild(copyInput);
        return result;
    }
    copyText(getMdToUrl(document.title, document.URL));
})();