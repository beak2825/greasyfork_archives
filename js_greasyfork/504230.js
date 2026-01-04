// ==UserScript==
// @name         Change teads log colours
// @description  Let's not confuse websites and create a mess!
// @namespace    http://tampermonkey.net/
// @version      2024-08-08
// @author       You
// @match        *://*.teads.net/*
// @icon         https://ads.teads.tv/assets/images/TAM_logo.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504230/Change%20teads%20log%20colours.user.js
// @updateURL https://update.greasyfork.org/scripts/504230/Change%20teads%20log%20colours.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // ---------- CONF ----------


    // Define hue rotation degrees for each site
    const qa3HueRotation = 240; // For *.sandbox.teads.net
    const dashboardHueRotation = 170; // For dashboard.teads.net

    const initialDelay = 1000;


    // ---------- MAIN ----------


    // Check the URL to determine which site we're on and apply the correct transformations
    const url = window.location.href;

    // Function to convert image to canvas and apply hue rotation
    function applyHueRotationToImage(imageElement, hueDegrees) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;

        ctx.filter = `hue-rotate(${hueDegrees}deg)`;
        ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL();
    }

    function applyChanges() {

        // Apply transformations for *.sandbox.teads.net (qa3 and other instances)
        if (url.includes("sandbox.teads.net")) {
            setTimeout(() => {
                const logo = document.querySelector("body > app-root > app-header > header > div.td-header__logo > a > img");
                if (logo) {
                    logo.style.filter = `hue-rotate(${qa3HueRotation}deg)`;
                }

                // Apply hue rotation to favicon
                const favicon = document.querySelector("link[rel~='icon']");
                if (favicon) {
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.src = favicon.href;
                    img.onload = () => {
                        const newFaviconUrl = applyHueRotationToImage(img, qa3HueRotation);

                        // Create a new favicon link element
                        const newFavicon = document.createElement('link');
                        newFavicon.rel = 'icon';
                        newFavicon.href = newFaviconUrl;

                        // Remove the old favicon and append the new one
                        document.head.removeChild(favicon);
                        document.head.appendChild(newFavicon);
                    };
                }
            }, 500);
        }

        // Apply transformations for dashboard.teads.net:3200
        if (url.includes("dashboard.teads.net")) {
            setTimeout(() => {
                const logo = document.querySelector("body > app-root > app-header > header > div.td-header__logo > a > img");
                if (logo) {
                    logo.style.filter = `hue-rotate(${dashboardHueRotation}deg)`;
                }

                // Apply hue rotation to favicon
                const favicon = document.querySelector("link[rel~='icon']");
                if (favicon) {
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.src = favicon.href;
                    img.onload = () => {
                        const newFaviconUrl = applyHueRotationToImage(img, dashboardHueRotation);

                        // Create a new favicon link element
                        const newFavicon = document.createElement('link');
                        newFavicon.rel = 'icon';
                        newFavicon.href = newFaviconUrl;

                        // Remove the old favicon and append the new one
                        document.head.removeChild(favicon);
                        document.head.appendChild(newFavicon);
                    };
                }
            }, 500);
        }
    }

    setTimeout(applyChanges, initialDelay);
})();