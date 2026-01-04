// ==UserScript==
// @name         Daily Papers 加宽
// @namespace    http://tampermonkey.net/
// @version      2024-06-21
// @description  解决宽屏状态下沉浸式翻译无法正常显示
// @author       You
// @match        https://huggingface.co/papers
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huggingface.co
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498564/Daily%20Papers%20%E5%8A%A0%E5%AE%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/498564/Daily%20Papers%20%E5%8A%A0%E5%AE%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var style = document.createElement('style');
    document.head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode('@media (min-width: 1280px) { .xl\\:grid-cols-3 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; } }'));
})();