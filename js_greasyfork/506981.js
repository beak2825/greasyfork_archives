// ==UserScript==
// @name         Tweakers negatief comments automatisch uitklappen
// @namespace    https://tweakers.net/
// @version      2024-09-05
// @description  Automatically expand negative comments and append URL params on Tweakers.net articles.
// @author       Markisoke
// @match        https://tweakers.net/nieuws/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tweakers.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506981/Tweakers%20negatief%20comments%20automatisch%20uitklappen.user.js
// @updateURL https://update.greasyfork.org/scripts/506981/Tweakers%20negatief%20comments%20automatisch%20uitklappen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current URL starts with 'https://tweakers.net/nieuws/'
    if (window.location.href.startsWith('https://tweakers.net/nieuws/')) {

        // Define the string to append
        const params = "?sort=rating-desc&niv=-1&mode=nested&page=1#reacties";

        // Check if the URL already contains the parameters to avoid duplicate appending
        if (!window.location.href.includes(params)) {
            // Redirect to the URL with the parameters appended
            window.location.href += params;
        }
    }
})();
