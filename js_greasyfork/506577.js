// ==UserScript==
// @name         Replace VK Logo SVG
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace VK logo SVG on vk.com/feed with a new SVG
// @author       Your Name
// @match        https://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506577/Replace%20VK%20Logo%20SVG.user.js
// @updateURL https://update.greasyfork.org/scripts/506577/Replace%20VK%20Logo%20SVG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the new SVG content
    const newSVG = `
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 14.4C0 7.61 0 4.22 2.1 2.1 4.23 0 7.62 0 14.4 0h1.2c6.79 0 10.18 0 12.3 2.1C30 4.23 30 7.62 30 14.4v1.2c0 6.79 0 10.18-2.1 12.3C25.77 30 22.38 30 15.6 30h-1.2c-6.79 0-10.18 0-12.3-2.1C0 25.77 0 22.38 0 15.6v-1.2Z" fill="#FFC0CB"/>
            <path d="M15.96 21.61c-6.84 0-10.74-4.68-10.9-12.48H8.5c.11 5.72 2.63 8.14 4.63 8.64V9.13h3.23v4.93c1.97-.21 4.05-2.46 4.75-4.94h3.22a9.53 9.53 0 0 1-4.38 6.23 9.87 9.87 0 0 1 5.13 6.26h-3.55c-.76-2.37-2.66-4.21-5.17-4.46v4.46h-.39Z" fill="#fff"/>
        </svg>
    `;

    // Function to replace the VK logo SVG
    function replaceLogo() {
        // Find the VK logo SVG element
        const logo = document.querySelector('a.TopHomeLink svg');

        if (logo) {
            logo.innerHTML = newSVG;
        }
    }

    // Initial call to replace the logo
    replaceLogo();

    // Re-run the function if content is dynamically loaded
    const observer = new MutationObserver(replaceLogo);
    observer.observe(document.body, { childList: true, subtree: true });
})();