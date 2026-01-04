// ==UserScript==
// @name         Tumblr Unredirectr
// @namespace    discurse
// @version      0.1
// @description  Restores the original URL of external links that have been converted into t.umblr.com redirects.
// @match        https://*.tumblr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371090/Tumblr%20Unredirectr.user.js
// @updateURL https://update.greasyfork.org/scripts/371090/Tumblr%20Unredirectr.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    * Given a redirect URL, extracts the original link from the ?z= param and
    * returns a non-URL-encoded version. If no such param, returns URL intact.
    */
    function unredirect(url) {
        var link_start = url.indexOf('z=') + 2;
        var link_end = url.indexOf('&', link_start);
        if(link_start < 2 || link_end < 0) {
            console.warn("Unredirectr: Expected ?z= param in t.umblr.com link. Skipping " + url);
            return url;
        } else {
            return decodeURIComponent(url.substring(link_start, link_end));
        }
    }
    /*
    * Unredirect all 'a' elements whose 'href' has a t.umblr.com domain.
    */
    for(var i=0; i<document.links.length; i++) {
        if(document.links[i].href.indexOf('://t.umblr.com/') > 0) {
            document.links[i].href = unredirect(document.links[i].href);
        }
    }
})();
