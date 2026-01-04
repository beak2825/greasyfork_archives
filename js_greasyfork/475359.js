// ==UserScript==
// @name         Yomichan Press Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Makes it so when you have Yomichan popup open but click somewhere on page, Yomichan gets hidden but nothing on page gets interacted with.
// @author       dimden.dev
// @match        *://*/*
// @grant        none
// @run-at       document_start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475359/Yomichan%20Press%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/475359/Yomichan%20Press%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let yomichanPopup, isVisible = false;
    let int = setInterval(() => {
        if(!yomichanPopup) yomichanPopup = document.getElementsByClassName('yomichan-popup')[0];
        if(yomichanPopup) isVisible = yomichanPopup.style.visibility !== 'hidden';
    }, 300);

    document.addEventListener('click', e => {
        if(isVisible) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);
})();