// ==UserScript==
// @name         Blur YouTube menu bar for ambient mode helper script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A helper script for my usercss
// @author       You
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456429/Blur%20YouTube%20menu%20bar%20for%20ambient%20mode%20helper%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/456429/Blur%20YouTube%20menu%20bar%20for%20ambient%20mode%20helper%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('scroll', () => {
        document.documentElement.dataset.scroll = window.scrollY;
    });
})();