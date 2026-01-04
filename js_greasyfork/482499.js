// ==UserScript==
// @name         Google search result url cleaner
// @namespace    http://tampermonkey.net/
// @version      2023-12-17
// @description  Directly use the destination url instead of google's proxy for more privacy + remove google parameters
// @author       You
// @match        https://www.google.com/search*
// @grant        none
// @run-at       document-end
// @license      GPT
// @downloadURL https://update.greasyfork.org/scripts/482499/Google%20search%20result%20url%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/482499/Google%20search%20result%20url%20cleaner.meta.js
// ==/UserScript==
function cleanUrl(url) {
    const cleanedUrl = url.replace(/(\/url\?q=|&(sa|ved|usg)=)[^&]*/g, function(match, c1, c2) {
        if (match.startsWith("/url?q=")) {
            return match.replace("/url?q=", "");
        }
        return "";
    });
    return cleanedUrl;
}

(function() {
    'use strict';
    
    const links = document.getElementsByTagName("a");
    for (const link of links) {
        var url = link.getAttribute("href");
        url = cleanUrl(url);

        if (url) {
            link.setAttribute("href", url);
        }
    }
})();