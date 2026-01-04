// ==UserScript==
// @name         MyDealz Fullscreen Bild
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fullscreen-Bildfunktion mit Schließen per Klick neben das Bild
// @author       MD928835
// @license      MIT
// @match        https://www.mydealz.de/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537371/MyDealz%20Fullscreen%20Bild.user.js
// @updateURL https://update.greasyfork.org/scripts/537371/MyDealz%20Fullscreen%20Bild.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForImages() {
        const images = document.querySelectorAll('img[data-image]');

        if (images.length === 0) {
            setTimeout(waitForImages, 1000);
            return;
        }

        processImages();
    }

    function processImages() {
        const images = document.querySelectorAll('img[data-image]:not([data-enhanced])');

        images.forEach(function(img) {
            img.setAttribute('data-enhanced', 'true');

            img.onclick = null;
            img.removeAttribute('onclick');

            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                showFullscreen(this.src);
                return false;
            }, true);

            img.addEventListener('mousedown', function(e) {
                if (e.button === 0) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);

            img.style.cursor = 'pointer';
        });

        setTimeout(processImages, 2000);
    }

    function showFullscreen(imageUrl) {
        const existing = document.getElementById('enhanced-overlay');
        if (existing) {
            existing.remove();
        }

        // Overlay mit grauem Hintergrund
        const overlay = document.createElement('div');
        overlay.id = 'enhanced-overlay';
        overlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(128, 128, 128, 0.3) !important;
            z-index: 999999 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            cursor: pointer !important;
        `;

        // Bild erstellen
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.cssText = `
            max-width: 90% !important;
            max-height: 90% !important;
            object-fit: contain !important;
            cursor: default !important;
            border-radius: 8px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        `;

        // Close Button
        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute !important;
            top: 20px !important;
            right: 30px !important;
            color: white !important;
            background: rgba(0, 0, 0, 0.6) !important;
            border-radius: 50% !important;
            width: 40px !important;
            height: 40px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 24px !important;
            cursor: pointer !important;
            z-index: 1000000 !important;
            transition: background 0.2s !important;
        `;

        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(0, 0, 0, 0.8)';
        });

        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(0, 0, 0, 0.6)';
        });

        function closeFullscreen() {
            overlay.remove();
            document.removeEventListener('keydown', handleKeydown);
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') {
                closeFullscreen();
            }
        }

        // Event Listeners
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeFullscreen();
            }
        });

        closeBtn.addEventListener('click', closeFullscreen);
        img.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        document.addEventListener('keydown', handleKeydown);

        // DOM zusammenbauen
        overlay.appendChild(closeBtn);
        overlay.appendChild(img);
        document.body.appendChild(overlay);
    }

    // Start nach vollständigem Laden
    if (document.readyState === 'complete') {
        setTimeout(waitForImages, 500);
    } else {
        window.addEventListener('load', function() {
            setTimeout(waitForImages, 500);
        });
    }
})();
