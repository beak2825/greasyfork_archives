// ==UserScript==
// @name         verpeliculasonline.org subtituladas.com link shortener auto-bypass
// @version      1.2
// @description  Redirects to URL the destination URL bypassing the link shorteners
// @author       Rust1667
// @match        https://subtituladas.com/enlace/*
// @match        https://verpeliculasonline.org/enlace/*
// @grant        none
// @namespace    https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/485729/verpeliculasonlineorg%20subtituladascom%20link%20shortener%20auto-bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/485729/verpeliculasonlineorg%20subtituladascom%20link%20shortener%20auto-bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the URL within the <a> element
    var linkElement = document.getElementById('link');
    if (linkElement) {
        var linkUrl = linkElement.href;

        // Check if '?s=' exists in the URL
        if (linkUrl.includes('?s=')) {
            var sIndex = linkUrl.indexOf('?s=') + 3; // 3 is the length of '?s='
            var extractedUrl = linkUrl.substring(sIndex);

            // Redirect to the extracted URL
            window.location.href = extractedUrl;

            //Stop the now useless timer
            window.setTimeout = function() {};
            window.setInterval = function() {};
            document.addEventListener = function() {};

        } else {
            // Redirect to the full URL
            window.location.href = linkUrl;
        }
    } else {
        console.log("Link element not found.");
    }
})();
