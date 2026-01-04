// ==UserScript==
// @name                Google URL Cleaner
// @name:fr             Nettoyeur d'URL Google
// @namespace            http://tampermonkey.net/
// @version             0.1
// @description         Simplifies Google search URLs by removing unnecessary parameters.
// @description:fr      Simplifie les URL de recherche Google en supprimant les paramètres inutiles.
// @author              adriendeval
// @match               https://www.google.com/search*
// @grant               none
// @run-at              document-start
// @icon                https://i.postimg.cc/WpYW6SBb/g.png
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/542184/Google%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/542184/Google%20URL%20Cleaner.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if (window.location.hostname === 'www.google.com' && window.location.pathname === '/search') {
        const url = new URL(window.location.href);
        const queryParam = url.searchParams.get('q');
        if (queryParam) {
            const newUrl = `https://www.google.com/search?q=${encodeURIComponent(queryParam)}`;
            if (window.location.href !== newUrl) {
                window.history.replaceState({}, '', newUrl);
            }
        }
    }
})();