// ==UserScript==
// @name         Add Chinese and Japanese result only links to Google
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds language filter links (CN, JP, EN) to Google search results.
// @author       Jie Lu (with modifications)
// @license      MIT
// @match        https://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444006/Add%20Chinese%20and%20Japanese%20result%20only%20links%20to%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/444006/Add%20Chinese%20and%20Japanese%20result%20only%20links%20to%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Updates a URL query parameter using the modern URL API.
     * @param {string} url - The original URL.
     * @param {string} key - The query parameter key to set.
     * @param {string} value - The query parameter value to set.
     * @returns {string} The new URL.
     */
    function updateParam(url, key, value) {
        // Use the built-in URL object for robust URL parsing
        let urlObj = new URL(url);
        // Set the 'lr' (language restrict) parameter
        urlObj.searchParams.set(key, value);
        // Return the full, updated URL string
        return urlObj.href;
    }

    /**
     * Creates and appends a language filter link to the container.
     * @param {string} name - The display text for the link (e.g., 'CN').
     * @param {string} code - The language code (e.g., 'zh-CN').
     */
    function AddLink(name, code, container) {
        // Use the standard 'location.href' instead of 'unsafeWindow'
        var currentUrl = location.href;
        var newUrl = updateParam(currentUrl, 'lr', 'lang_' + code);

        var link = document.createElement('a');
        link.style = 'margin-right: 10px; font-size: 13px; color: #1a0dab; text-decoration: none;';
        link.href = newUrl;
        link.innerHTML = name;
        
        // Add hover effect for better UI
        link.onmouseover = () => { link.style.textDecoration = 'underline'; };
        link.onmouseout = () => { link.style.textDecoration = 'none'; };
        
        container.appendChild(link);
    }

    // Create a container for the links
    var container = document.createElement('div');
    container.style = "position: fixed; left: 10px; top: 120px; z-index: 9999; background: white; padding: 5px; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);";

    // Add the links
    AddLink('CN', 'zh-CN', container);
    AddLink('JP', 'ja', container);
    AddLink('EN', 'en', container);

    // Append the container to the page
    document.body.appendChild(container);
})();