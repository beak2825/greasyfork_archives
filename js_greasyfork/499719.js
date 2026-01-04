// ==UserScript==
// @name         4khd-ad-remover
// @namespace    http://tampermonkey.net/
// @version      2024-07-05
// @description  4khd dot com ad remover
// @author       You
// @include      https://www.4khd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4khd.com
// @grant        none
// @license      nolicense
// @downloadURL https://update.greasyfork.org/scripts/499719/4khd-ad-remover.user.js
// @updateURL https://update.greasyfork.org/scripts/499719/4khd-ad-remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', () => {
        new MutationObserver(() => {
            document.querySelector('div.popup')?.remove();
        }).observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
})();