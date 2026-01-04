// ==UserScript==
// @name         LOLZ_Fix Nav Buttons
// @namespace    LOLZ_Fix Nav Buttons
// @description  LOLZ Fix Navigation Buttons in Threads
// @version      0.3
// @author       el9in
// @license      el9in
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @downloadURL https://update.greasyfork.org/scripts/479671/LOLZ_Fix%20Nav%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/479671/LOLZ_Fix%20Nav%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function initFixNav() {
        const elements = document.querySelectorAll('[href^="threads/"][href*="/page-"]');
        elements.forEach(function(element) {
            element.addEventListener('click', function(event) {
                var hrefValue = element.getAttribute('href');
                event.stopPropagation();
                window.location.href = hrefValue;
            });
        });
    }
    initFixNav();
    let _currentHref = window.location.href;
    function hrefChecker() {
        if(_currentHref != window.location.href) {
            initFixNav();
            _currentHref = window.location.href;
        }
    }
    setInterval(hrefChecker, 500);
})();