// ==UserScript==
// @name         arXiv html toggle
// @namespace    http://tampermonkey.net/
// @version      2024-06-18
// @description  Set arxiv.org/html to light default.
// @author       evanlin
// @match        https://arxiv.org/html/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498291/arXiv%20html%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/498291/arXiv%20html%20toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        setTimeout(function() {
            document.querySelector('html').setAttribute('data-theme', 'light');

            let arrowIcon = document.getElementById('arrowIcon');
            console.log(arrowIcon);
            if (arrowIcon) {
                arrowIcon.click();
            }
        }, 500);
    };
})();