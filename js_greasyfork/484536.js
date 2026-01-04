// ==UserScript==
// @name         Youtube Description External Links
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Shortens YouTube redirection URLs and updates link text
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT 

// @downloadURL https://update.greasyfork.org/scripts/484536/Youtube%20Description%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/484536/Youtube%20Description%20External%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function shortenUrl(longUrl) {
        const urlParams = new URLSearchParams(longUrl);
        return urlParams.get('q') || longUrl;
    }

    function processLinks() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('youtube.com/redirect')) {
                const shortenedUrl = shortenUrl(href);
                link.setAttribute('href', shortenedUrl);
                link.textContent = shortenedUrl; // Update link text
                link.style.color = "rgb(147, 199, 244)"; // Set the color to rgb(147, 199, 244)
            }
        });
    }

    // Run the script initially
    processLinks();

    // Watch for changes in the page (e.g., AJAX-loaded content)
    const observer = new MutationObserver(processLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
