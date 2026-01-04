// ==UserScript==
// @name         Copy URL Button
// @namespace    http://yourwebsite.com
// @version      1.1
// @description  Adds a button to copy the URL of the current page
// @author       FunkyJustin
// @match        https://gelbooru.com/*
// @match        https://danbooru.donmai.us/*
// @match        https://www.pixiv.net/en/*
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494255/Copy%20URL%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/494255/Copy%20URL%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button element
    var copyButton = document.createElement('button');
    copyButton.textContent = 'Copy URL';
    copyButton.style.position = 'fixed';
    copyButton.style.top = '10px'; // Adjust top position as needed
    copyButton.style.left = '60%'; // Adjust left position as needed
    copyButton.style.padding = '10px';
    copyButton.style.border = 'none';
    copyButton.style.background = 'rgba(0, 0, 0, 0.5)';
    copyButton.style.color = '#fff';
    copyButton.style.cursor = 'pointer';
    copyButton.style.opacity = '0.3'; // Initial opacity

    // Append the button to the body
    document.body.appendChild(copyButton);

    // Function to copy the current page URL to the clipboard
    function copyURL() {
        var url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(function() {
                console.log('URL copied to clipboard: ' + url);
            })
            .catch(function(error) {
                console.error('Failed to copy URL: ', error);
            });
    }

    // Event listeners for mouse hover
    copyButton.addEventListener('mouseover', function() {
        copyButton.style.opacity = '1'; // Make the button opaque on hover
    });

    copyButton.addEventListener('mouseout', function() {
        copyButton.style.opacity = '0.3'; // Make the button semi-transparent when not hovering
    });

    // Event listener for click to copy URL
    copyButton.addEventListener('click', function() {
        copyURL();
    });
})();
