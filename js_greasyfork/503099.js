// ==UserScript==
// @name         Network Activity Blinker
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Pins a small blinking circle to the mouse pointer and adds a colored vertical bar under the favicon during network activity
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503099/Network%20Activity%20Blinker.user.js
// @updateURL https://update.greasyfork.org/scripts/503099/Network%20Activity%20Blinker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings
    const settings = {
        enablePointerDot: true,
        enableFaviconModification: true
    };

    // Create the blinking circle element
    const blinker = document.createElement('div');
    blinker.style.position = 'fixed';
    blinker.style.width = '15px';
    blinker.style.height = '15px';
    blinker.style.borderRadius = '50%';
    blinker.style.backgroundColor = 'green'; // Start as green
    blinker.style.zIndex = '9999';
    blinker.style.transition = 'background-color 0.2s, opacity 0.2s';
    blinker.style.opacity = '0'; // Initially hidden
    if (settings.enablePointerDot) {
        document.body.appendChild(blinker);
    }

    let blinkTimeout;
    let intensity = 0;
    const originalTitle = document.title;
    let originalFavicon = null;

    // Function to trigger the blink effect
    function blink() {
        // Increase intensity
        intensity = Math.min(intensity + 10, 255);
        const color = `rgb(${intensity}, ${255 - intensity}, 0)`; // Shifts from green to red

        if (settings.enablePointerDot) {
            blinker.style.backgroundColor = color;
            blinker.style.opacity = '1'; // Make visible
        }

        if (settings.enableFaviconModification) {
        document.title = '● ' + originalTitle;
            //updateFavicon(color);
        }

        clearTimeout(blinkTimeout);
        blinkTimeout = setTimeout(() => {
            // Fade out and reset intensity
            if (settings.enablePointerDot) {
                blinker.style.opacity = '0'; // Hide again
            }
            if (settings.enableFaviconModification) {
                document.title = originalTitle;
                resetFavicon();
            }
            intensity = 0;
            blinker.style.backgroundColor = 'green'; // Return to green
        }, 500);
    }

    function updateFavicon(color) {
        const faviconLink = document.querySelector("link[rel~='icon']");
        if (!faviconLink) return;

        if (!originalFavicon) {
            originalFavicon = faviconLink.href;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            const barWidth = 4; // Width of the vertical bar
            const barHeight = 6; // Height of the vertical bar
            canvas.width = img.width;
            canvas.height = img.height + barHeight;

            // Draw original favicon at the top
            ctx.drawImage(img, 0, 0);

            // Draw colored vertical bar underneath
            ctx.fillStyle = color;
            ctx.fillRect((canvas.width - barWidth) / 2, img.height, barWidth, barHeight);

            // Update favicon
            faviconLink.href = canvas.toDataURL();
        };

        img.src = originalFavicon;
    }

    function resetFavicon() {
        const faviconLink = document.querySelector("link[rel~='icon']");
        if (faviconLink && originalFavicon) {
            faviconLink.href = originalFavicon;
        }
    }

    // Monitor XMLHttpRequest activity
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('loadstart', function() {
            blink();
        });
        return originalXHROpen.apply(this, arguments);
    };

    // Monitor fetch activity
    const originalFetch = window.fetch;
    window.fetch = function() {
        blink();
        return originalFetch.apply(this, arguments);
    };

    // Update the position of the blinker to follow the mouse
    if (settings.enablePointerDot) {
        document.addEventListener('mousemove', function(event) {
            blinker.style.left = `${event.clientX + 15}px`;  // +15 to offset from cursor
            blinker.style.top = `${event.clientY + 15}px`;   // +15 to offset from cursor
        });
    }
})();