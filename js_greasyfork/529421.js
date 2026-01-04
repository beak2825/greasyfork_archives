// ==UserScript==
// @name         Asana Inbox with GIF
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show GIF overlay if there's an unread notification
// @match        https://app.asana.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529421/Asana%20Inbox%20with%20GIF.user.js
// @updateURL https://update.greasyfork.org/scripts/529421/Asana%20Inbox%20with%20GIF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // *** Replace this base64 string with your GIF's base64 data. ***
    const gifDataUrl = 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3M0YncxMDd4djhkZHhwYzJmOXlpcW00dm13djd6dTUycmJwZHpoYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ote5cBDPAM9qJLkxzS/giphy.gif';

    // 1) Create the overlay container (absolute positioned)
    const gifOverlay = document.createElement('img');
    gifOverlay.src = gifDataUrl;
    gifOverlay.style.position = 'fixed';
    // Move it 10% from the top edge, 2% from the left edge
    gifOverlay.style.top = '50px';
    gifOverlay.style.left = '20px';
    gifOverlay.style.zIndex = '999999'; // put it on top
    gifOverlay.style.width = 'auto';
    gifOverlay.style.height = '150px';
    gifOverlay.style.pointerEvents = 'none';
    gifOverlay.style.opacity = "0.7";
    gifOverlay.style.display = 'none';  // hidden by default
    document.body.appendChild(gifOverlay);

    // 2) Our detection function. Example:
    function updateGifVisibility() {
        const redBell = document.querySelector('svg.SidebarTopNavLinks-bellNotificationCompoundIcon--red');
        // Show/hide the GIF
        gifOverlay.style.display = redBell ? 'block' : 'none';
    }


    // 3) Set up the observer to watch for DOM changes.
    const observer = new MutationObserver(updateGifVisibility);
    observer.observe(document.body, { childList: true, subtree: true });

    // 4) Run once at the beginning.
    updateGifVisibility();
})();
