// ==UserScript==
// @name         Filmweb without forum
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license MIT
// @description  Blur the forum div on Filmweb, remove blur on click.
// @author       suchencjusz
// @match        https://www.filmweb.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507030/Filmweb%20without%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/507030/Filmweb%20without%20forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Select the div with class 'page__group' and data-group='g12'
        const forumDiv = document.querySelector('div.page__group[data-group="g12"]');
        if (forumDiv) {
            // Apply initial styles
            forumDiv.style.filter = 'blur(10px)';
            forumDiv.style.transition = 'filter 0.3s ease, max-height 0.5s ease';
            forumDiv.style.maxHeight = '100px';
            forumDiv.style.overflow = 'hidden';

            // Remove blur and expand height on click
            forumDiv.addEventListener('click', function() {
                forumDiv.style.filter = 'none';
                forumDiv.style.maxHeight = forumDiv.scrollHeight + 'px';
            });
        }
    }, false);
})();