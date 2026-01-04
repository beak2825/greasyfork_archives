// ==UserScript==
// @name         English Only Search
// @description  Appends all searches to include only english results.
// @author       HIDDEN-lo
// @version      1.0
// @match        *://akuma.moe/*
// @license MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/1206627
// @downloadURL https://update.greasyfork.org/scripts/478528/English%20Only%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/478528/English%20Only%20Search.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function updateURLIfNeeded() {
        var currentURL = window.location.href;

        if (currentURL.includes('?q=') && !currentURL.includes('english')) {
            var updatedURL = currentURL.replace('?q=', '?q=language%3Aenglish+');

            window.location.href = updatedURL;
        }
    }

    updateURLIfNeeded();
})();
