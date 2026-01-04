// ==UserScript==
// @name         Crates.io Translate Enable
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  移除 Crates.io 的网页翻译限制 | Remove translation restrictions on Crates.io
// @author       Binwalker
// @match        https://crates.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crates.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486016/Cratesio%20Translate%20Enable.user.js
// @updateURL https://update.greasyfork.org/scripts/486016/Cratesio%20Translate%20Enable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        const htmlElement = document.children.item("html");
        htmlElement.classList.remove('notranslate');
        htmlElement.removeAttribute('translate');
    };
})();