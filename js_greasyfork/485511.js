// ==UserScript==
// @name         Delete youtube short category
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Retirer la catégorie youtube short désagréable
// @author       Mc-Guru
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485511/Delete%20youtube%20short%20category.user.js
// @updateURL https://update.greasyfork.org/scripts/485511/Delete%20youtube%20short%20category.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var shortElements = document.querySelectorAll('ytd-rich-shelf-renderer.style-scope');

        shortElements.forEach(function(element) {
            element.style.display = 'none';
        });
    });
})();
