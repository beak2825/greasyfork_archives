// ==UserScript==
// @name         Auto HDR Enhanced
// @namespace    http://taeparlaytampermonkey.net/
// @version      15.2
// @description  Apply an HDR-like effect to images and videos on a webpage with adjustable settings.
// @author       tae
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/497504/Auto%20HDR%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/497504/Auto%20HDR%20Enhanced.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Default settings
    const settings = {
        hdrEnabled: true,
        brightness: 1.0,
        contrast: 1.1,
        saturation: 0.8,
        excludedSites: [],
    };

    // Load settings from local storage
    function loadSettings() {
        const savedSettings = localStorage.getItem('autoHDRSettings');
        if (savedSettings) {
            Object.assign(settings, JSON.parse(savedSettings));
        }
    }

    // Save settings to local storage
    function saveSettings() {
        localStorage.setItem('autoHDRSettings', JSON.stringify(settings));
    }

    // Apply HDR-like effect using canvas
    function applyHDREffect(img) {
        if (!img.complete || img.dataset.hdrApplied) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Adjust brightness, contrast, and saturation
        for (let i = 0; i < data.length; i += 4) {
            let [r, g, b] = [data[i], data[i + 1], data[i + 2]];

            // Apply brightness and contrast
            r = clamp(r * settings.brightness * settings.contrast);
            g = clamp(g * settings.brightness * settings.contrast);
            b = clamp(b * settings.brightness * settings.contrast);

            // Apply saturation
            [r, g, b] = applySaturation(r, g, b, settings.saturation);

            [data[i], data[i + 1], data[i + 2]] = [r, g, b];
        }

        ctx.putImageData(imageData, 0, 0);
        img.src = canvas.toDataURL();
        img.dataset.hdrApplied = true; // Mark as processed
    }

    // Saturation adjustment function
    function applySaturation(r, g, b, factor) {
        const grayscale = 0.3 * r + 0.59 * g + 0.11 * b;
        r += (r - grayscale) * (factor - 1);
        g += (g - grayscale) * (factor - 1);
        b += (b - grayscale) * (factor - 1);
        return [clamp(r), clamp(g), clamp(b)];
    }

    // Clamp values to 0-255
    function clamp(value) {
        return Math.max(0, Math.min(255, value));
    }

    // Apply CSS filters to videos
    function applyHDRToVideos() {
        document.querySelectorAll('video:not([data-hdrApplied])').forEach(video => {
            video.style.filter = `brightness(${settings.brightness}) contrast(${settings.contrast}) saturate(${settings.saturation})`;
            video.dataset.hdrApplied = true;
        });
    }

    // Check if the current site is excluded
    function isSiteExcluded() {
        return settings.excludedSites.some(site => window.location.href.includes(site));
    }

    // Toggle HDR effect on or off
    function toggleHDREffect() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (settings.hdrEnabled) {
                applyHDREffect(img);
            } else {
                if (img.dataset.hdrApplied) {
                    img.removeAttribute('data-hdrApplied');
                    img.src = img.src; // Reset image source
                }
            }
        });

        if (settings.hdrEnabled) {
            applyHDRToVideos();
        } else {
            document.querySelectorAll('video').forEach(video => {
                video.style.filter = '';
                video.removeAttribute('data-hdrApplied');
            });
        }
    }

    // Initialize the script
    function init() {
        loadSettings();

        if (!isSiteExcluded()) {
            const observer = new MutationObserver(() => {
                if (settings.hdrEnabled) {
                    document.querySelectorAll('img:not([data-hdrApplied])').forEach(applyHDREffect);
                    applyHDRToVideos();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            window.addEventListener('load', toggleHDREffect);
        }
    }

    init();
})();