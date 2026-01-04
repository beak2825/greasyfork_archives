// ==UserScript==
// @name               Scribd bypass
// @description        Script disables blur on text & add full document
// @author             FLXXX
// @version            1.2
// @license            MIT
// @namespace          https://greasyfork.org/ru/users/938036-flxxx
// @match              *://*.scribd.com/*
// @icon               https://s-f.scribdassets.com/favicon.ico
// @require            https://code.jquery.com/jquery-3.6.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/460803/Scribd%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/460803/Scribd%20bypass.meta.js
// ==/UserScript==
/* eslint-env jquery */
$(document).ready(function () {
    'use strict';
    function removePromoDivs() {
        const promoDivs = document.querySelectorAll('.promo_div');
        promoDivs.forEach(div => div.remove());
    }
    function removeUnselectable() {
        const unselectableElements = document.querySelectorAll('[unselectable="on"]');
        unselectableElements.forEach(el => el.removeAttribute('unselectable'));
    }
    function removeBlurredPage() {
        const blurredElements = document.querySelectorAll('.blurred_page');
        blurredElements.forEach(el => el.classList.remove('blurred_page'));
    }
    function cleanStylesAndAttributes() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.style.color === 'transparent') {
                el.style.color = '';
            }
            if (el.style.textShadow) {
                el.style.textShadow = '';
            }
            el.removeAttribute('data-initial-color');
            el.removeAttribute('data-initial-text-shadow');
        });
    }
    window.addEventListener('load', () => {
        removePromoDivs();
        removeUnselectable();
        removeBlurredPage();
        cleanStylesAndAttributes();
        const observer = new MutationObserver(() => {
            removePromoDivs();
            removeUnselectable();
            removeBlurredPage();
            cleanStylesAndAttributes();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
});