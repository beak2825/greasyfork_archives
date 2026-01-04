// ==UserScript==
// @name         DisneyRedirectUrlBlocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Do not redirect the original URL to new URL format
// @match        https://www.disneyplus.com/*
// @grant        none
// @run-at       document-start
// @author       zackmark29
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489466/DisneyRedirectUrlBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/489466/DisneyRedirectUrlBlocker.meta.js
// ==/UserScript==

(function() {
    const URL_TO_BLOCK = "https://disney.api.edge.bamgrid.com/explore/v1.3/deeplink";
    const xhr = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url) {
        if (!url.includes(URL_TO_BLOCK)) {
            xhr.call(this, method, url);
        }
    };
})();
