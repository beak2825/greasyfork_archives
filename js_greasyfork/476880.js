// ==UserScript==
// @name         Wayback Count Display
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Show Wayback count on page
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476880/Wayback%20Count%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/476880/Wayback%20Count%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to format large numbers as k, m, etc.
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num;
    };

    // Function to display count on page
    const displayCount = (count) => {
        const formattedCount = formatNumber(count);
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '0';
        div.style.left = '50%';
        div.style.transform = 'translateX(-50%)';

        div.style.zIndex = '9999';
        div.style.backgroundColor = 'white';
        div.style.padding = '5px';
        div.textContent = `${formattedCount}`;
        document.body.appendChild(div);
    };

    // Get the current URL and encode it
    const currentURL = window.location.href;
    const encodedURL = encodeURIComponent(currentURL);

    // Wayback API URL
    const apiURL = `http://web.archive.org/cdx/search/cdx?url=${encodedURL}&output=json&fl=original`;

    // Make API call
    GM_xmlhttpRequest({
        method: 'GET',
        url: apiURL,
        onload: function(response) {
            if (response.status === 200) {
                try {
                    const results = JSON.parse(response.responseText);
                    const count = results.length ? results.length - 1 : 0; // Exclude header row
                    displayCount(count);
                } catch(e) {
                    displayCount('Parse Error');
                }
            } else {
                displayCount('Error');
            }
        },
        onerror: function() {
            displayCount('Error');
        }
    });

})();
