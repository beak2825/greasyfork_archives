// ==UserScript==
// @name         SurferSEO Image Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to open the image upload dialog on SurferSEO page
// @author       mhshan
// @match        https://app.surferseo.com/drafts/s/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517821/SurferSEO%20Image%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/517821/SurferSEO%20Image%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle Image button click
    function handleImageClick() {
        const targetDiv = document.querySelector('div[data-testid="ribbon-image-button"]');
        if (targetDiv) {
            targetDiv.click();
        } else {
            alert('Target element not found.');
        }
    }

    // Check if the URL matches the pattern
    if (window.location.href.startsWith('https://app.surferseo.com/drafts/s/')) {
        const button = document.createElement('button');
        button.innerText = 'Image';
        button.style.position = 'fixed';
        button.style.top = '500px';
        button.style.left = '60px';
        button.style.height = '40px';
        button.style.width = '150px';
        button.style.background = 'Black';
        button.style.color = 'white';
        button.style.fontWeight = '600';
        button.style.zIndex = 1000;
        button.style.borderRadius = '8px';
        button.style.padding = '5px 10px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.transition = 'background 0.3s ease, transform 0.3s ease';

        button.addEventListener('mouseover', function() {
            button.style.background = '#3CCF4E';
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseout', function() {
            button.style.background = 'Black';
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', handleImageClick);

        document.body.appendChild(button);
    }
})();
