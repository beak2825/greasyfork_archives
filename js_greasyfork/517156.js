// ==UserScript==
// @name         Freedium Redirect
// @namespace    freedium:redirect
// @version      0.1
// @description  Redirects Medium Links to Freedium
// @author       nekeal
// @match        https://*/*
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/517156/Freedium%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/517156/Freedium%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        // Check if the page is a Medium article
        const isMediumArticle = (
            document.querySelector('meta[property="og:site_name"]')?.content === 'Medium' &&
            document.querySelector('meta[property="og:type"]')?.content === 'article'
        );

        // Redirect to Freedium if conditions are met
        if (isMediumArticle) {
            document.location = "https://freedium.cfd/" + document.location.href;
        }
    };
})();