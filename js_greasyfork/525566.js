// ==UserScript==
// @name         Mac Torrects Download fix/auto redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  get the b64 from the url and redirect to it
// @author       You
// @match        https://www.torrentmac.net/downloads/?link=*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/525566/Mac%20Torrects%20Download%20fixauto%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/525566/Mac%20Torrects%20Download%20fixauto%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Function to decode Base64
    function decodeBase64(str) {
        try {
            return atob(str);
        } catch (e) {
            console.error('Invalid Base64 string');
            return null;
        }
    }

    // Main function
    function processUrl() {
        const linkParam = getUrlParameter('link');

        if (linkParam) {
            const decodedUrl = decodeBase64(linkParam);

            if (decodedUrl) {
                // Validate URL before redirecting
                try {
                    const url = new URL(decodedUrl);
                    // Only redirect to known safe domains
                    if (url.hostname.includes('mediafire.com')) {
                        window.location.href = decodedUrl;
                    }
                } catch (e) {
                    console.error('Invalid URL format');
                }
            }
        }
    }

    // Run the script
    processUrl();
})();