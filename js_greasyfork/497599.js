// ==UserScript==
// @name         Consistent Youtube logo
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Replace the YouTube logo with a custom image, set a constant width of 94px, update the logo link to youtube.com, and change the mouse-over text to "YouTube".
// @author       jflo
// @match        https://www.youtube.com/*
// @grant        none
// @licensec     MIT
// @downloadURL https://update.greasyfork.org/scripts/497599/Consistent%20Youtube%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/497599/Consistent%20Youtube%20logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL of the custom logo you want to use
    const customLogoUrl = 'https://i.imgur.com/maYoqkV.png'; // Replace with your custom logo URL
    const customLogoWidth = '94px'; // Set the desired width for the custom logo

    // Function to replace the logo, update the link, and change the mouse-over text
    function replaceLogo() {
        // Select all possible logo image elements
        const logoImages = document.querySelectorAll('img[src*="youtube/img/promos/growth/"]');
        const logoLinks = document.querySelectorAll('a[href*="/?bp=wgUCEAE%3D"]'); // Selector for the logo link

        logoImages.forEach(logoImage => {
            // Replace the logo's src and srcset with the custom logo URL
            logoImage.src = customLogoUrl;
            logoImage.srcset = customLogoUrl;
            // Set the custom width and height
            logoImage.style.width = customLogoWidth;
            logoImage.style.height = 'auto'; // Maintain aspect ratio
            logoImage.width = '94'; // Set width attribute
            logoImage.height = ''; // Clear any height attribute to maintain aspect ratio
            // Set the mouse-over text
            logoImage.alt = 'YouTube';
            logoImage.title = 'YouTube';
        });

        // Update the link associated with the logo
        logoLinks.forEach(logoLink => {
            logoLink.href = 'https://www.youtube.com/';
            logoLink.title = 'YouTube';
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', replaceLogo);

    // Optionally, run the function when the DOM changes (e.g., when navigating within YouTube)
    const observer = new MutationObserver(replaceLogo);
    observer.observe(document.body, { childList: true, subtree: true });
})();