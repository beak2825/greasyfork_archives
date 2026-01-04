// ==UserScript==
// @name        Force German on TUDa Websites
// @name:de     Erzwinge deutsche TUDa Website
// @namespace   Violentmonkey Scripts
// @match       *://*.tu-darmstadt.de/*
// @grant       none
// @version     1.0
// @author      EinEtw4s
// @license     GPL-3.0
// @description Automatically redirects from the English TU-Darmstadt website to the German one.
// @description:de Leitet automatisch von der englischen TU-Darmstadt Website auf die deutsche weiter.
// @downloadURL https://update.greasyfork.org/scripts/499371/Force%20German%20on%20TUDa%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/499371/Force%20German%20on%20TUDa%20Websites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current URL ends with '.en.jsp'
    if (window.location.href.endsWith('.en.jsp')) {
        // Redirect to the corresponding '.de.jsp' URL
        var newUrl = window.location.href.replace('.en.jsp', '.de.jsp');
        window.location.replace(newUrl);
    }
})();
