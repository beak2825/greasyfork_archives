// ==UserScript==
// @name        Random Video Overlay
// @namespace   https://www.pornhub.com
// @version     1.0
// @description Displays an overlay with a button to load a random video on Pornhub.
// @match       https://www.pornhub.com/*
// @grant       none
// @author      Zenith
// @license     CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/479133/Random%20Video%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/479133/Random%20Video%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.bottom = '20px';
    overlay.style.right = '20px';
    overlay.style.background = 'rgba(0, 0, 0, 0.8)';
    overlay.style.color = 'white';
    overlay.style.padding = '10px';
    overlay.style.borderRadius = '5px';
    overlay.style.zIndex = '9999';
    overlay.innerHTML = `
        <h3>Can't find anything?</h3>
        <p>Click the button below watch a random video!:</p>
        <button id="randomVideoBtn">Load Random Video</button>
    `;

    // Append the overlay to the body
    document.body.appendChild(overlay);

    // Add event listener to handle button click
    const randomVideoBtn = document.getElementById('randomVideoBtn');
    randomVideoBtn.addEventListener('click', function() {
        loadRandomVideo();
    });

    // Function to load a random video
    function loadRandomVideo() {
        const videoLinks = document.querySelectorAll('.thumbnail-info-wrapper .title a:not([data-ncid])');
        const randomIndex = Math.floor(Math.random() * videoLinks.length);
        const randomVideoLink = videoLinks[randomIndex].getAttribute('href');
        window.location.href = randomVideoLink;
    }
})();