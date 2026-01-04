// ==UserScript==
// @name         Rating Blur Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blur user and critics ratings by default and unblur on hover for filmweb.pl, imdb.com, and letterboxd.com.
// @author       Balbi
// @match        *://*.filmweb.pl/*
// @match        *://*.imdb.com/*
// @match        *://*.letterboxd.com/*
// @icon         https://github.com/Balbiii/Movie-Rating-Blur-Extension/blob/main/icons/icon48.png?raw=true
// @license      GNUv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499767/Rating%20Blur%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/499767/Rating%20Blur%20Script.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function applyInitialBlur(element) {
        element.style.filter = 'blur(8px)';
        element.style.visibility = 'hidden';
    }

    function applyBlurWithTransition(element) {
        element.style.transition = 'filter 0.3s ease';
        element.style.filter = 'blur(8px)';
        element.style.visibility = 'visible';
        element.addEventListener('mouseover', function() {
            element.style.filter = 'blur(0)';
        });
        element.addEventListener('mouseout', function() {
            element.style.filter = 'blur(8px)';
        });
    }

    function observeAndApplyBlur(selector) {
        const observer = new MutationObserver((mutations, obs) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length) {
                elements.forEach(element => {
                    applyInitialBlur(element);
                    void element.offsetWidth;
                    applyBlurWithTransition(element);
                });
                obs.disconnect();
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    // Blur ratings on filmweb.pl
    observeAndApplyBlur('.filmCoverSection__ratings');

    // Blur ratings on imdb.com
    observeAndApplyBlur('.sc-3a4309f8-1.dggvUg');

    // Blur ratings on letterboxd.com
    observeAndApplyBlur('.section.ratings-histogram-chart');
})();