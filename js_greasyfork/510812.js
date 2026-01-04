// ==UserScript==
// @name         Enchanted Agar.io
// @icon         https://i.imgur.com/sjYtMDN.png
// @namespace    https://greasyfork.org/users/1372128
// @version      1.1
// @description  Optimize Agar.io performance and blocking ads.
// @author       Dragon9135
// @match        *://agar.io/*
// @grant        none
// @license      Custom License
// @downloadURL https://update.greasyfork.org/scripts/510812/Enchanted%20Agario.user.js
// @updateURL https://update.greasyfork.org/scripts/510812/Enchanted%20Agario.meta.js
// ==/UserScript==

// Copyright (C) 2024 Dragon9135
// This software cannot be modified, copied, or redistributed in any form. Users are permitted to use the software for personal use only. Any alteration or republishing of this software is strictly prohibited.

(function() {
    'use strict';

    // First script variables and functions
    let isChecking = false;
    let fpsDisplay;

    function createFPSDisplay() {
        // Create the FPS counter
        fpsDisplay = document.createElement('div');
        fpsDisplay.style.position = 'fixed';
        fpsDisplay.style.bottom = '42px';
        fpsDisplay.style.left = '13px';
        fpsDisplay.style.color = '#ffffff';
        fpsDisplay.style.fontSize = '16px';
        fpsDisplay.style.fontFamily = 'Ubuntu, sans-serif';
        fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        fpsDisplay.style.padding = '4px';
        fpsDisplay.style.borderRadius = '5px';
        fpsDisplay.style.zIndex = '1000';
        fpsDisplay.style.width = 'auto';
        fpsDisplay.style.height = 'auto';
        document.body.appendChild(fpsDisplay);
    }

    function updateFPSDisplay(fps) {
        if (fpsDisplay) {
            fpsDisplay.textContent = `FPS: ${Math.round(fps)}`;
        }
    }

    function calculateFPS() {
        let frameCount = 0;
        let lastTime = performance.now();

        function loop() {
            frameCount++;
            let currentTime = performance.now();
            let delta = currentTime - lastTime;

            if (delta >= 1000) {
                updateFPSDisplay(frameCount);
                frameCount = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(loop);
        }

        loop();
    }

    function enableMinimap() {
        if (typeof core !== 'undefined') {
            core.setMinimap(1);
            core.playersMinimap(1);
        }
    }

    function removeAds() {
        let adIframes = document.querySelectorAll('iframe');
        adIframes.forEach(function(iframe) {
            let src = iframe.src.toLowerCase();
            if (src.includes('ads') || src.includes('adserver') || src.includes('doubleclick') || src.includes('googlesyndication')) {
                iframe.remove();
            }
        });

        let adElements = document.querySelectorAll('[id*="adBanner"], [id*="adContainer"], [id*="ad-container"], [class*="adBox"], ' +
            '[class*="ad-container"], [id*="google_ads"], [class*="google_ads"], ' +
            '[id*="agar-io_300x250"], [class*="agar-io_300x250"], ' +
            '[id*="agar-io_160x600"], [class*="agar-io_160x600"], ' +
            '[id*="google_ads_iframe"], [class*="google_ads_iframe"], ' +
            '[id*="agar-io_160x600_2"], [class*="agar-io_160x600_2"], ' +
            '[id*="agar-io_970x90"], [class*="agar-io_970x90"], ' +
            '#preroll, .preroll, #adsBottom, .adsBottom, [id^="google_ads"], ' +
            '[id*="divFullscreenLoading"], [class*="divFullscreenLoading"]');
        adElements.forEach(function(ad) {
            ad.remove();
        });
    }

    function adjustBannerHeight() {
        document.documentElement.style.setProperty('--bottom-banner-height', '0px');
    }

    function clearUnused() {
        let oldAds = document.querySelectorAll('.old-ad');
        oldAds.forEach(ad => {
            ad.remove();
            ad = null;
        });
    }

    function update() {
        clearUnused();
        requestAnimationFrame(update);
    }

    function checkAds() {
        if (!isChecking) {
            isChecking = true;
            removeAds();
            adjustBannerHeight();
            isChecking = false;
        }
    }

    function toggleFPSDisplay() {
        const overlay = document.getElementById('overlays');
        if (overlay) {
            fpsDisplay.style.display = 'none';
        } else {
            fpsDisplay.style.display = 'block';
        }
    }

    // Second script variables and functions
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    let Feed = false;
    let splitDelay = 25;

    function addInstructions() {
        const instructions = document.getElementById("instructions");
        if (instructions) {
            instructions.innerHTML += `
                <center><span class='text-muted'>
                    <span>Press <b>D</b> or <b>2</b> to doublesplit</span><br>
                    <span>Press <b>3</b> to triplesplit</span><br>
                    <span>Press <b>T</b> or <b>4</b> to tricksplit</span><br>
                    <span>Press <b>E</b> to eject macro mass</span>
                </span></center>
            `;
        }
    }

    function customizeUI() {
        const mainUI = document.getElementById('mainui-play');
        if (mainUI) {
            mainUI.style.height = '385px';
        }

        const nickInput = document.getElementById('nick');
        if (nickInput) {
            nickInput.maxLength = 99;
        }
    }

    function keydown(event) {
        switch (event.keyCode) {
            case 69: // E key for feeding
                Feed = true;
                macroFeed();
                break;
            case 84: // T or 4 for tricksplit
            case 52:
                splitMultiple(4);
                break;
            case 51: // 3 for triplesplit
                splitMultiple(3);
                break;
            case 68: // D or 2 for doublesplit
            case 50:
                splitMultiple(2);
                break;
            case 49: // 1 for single split
                triggerSplit();
                break;
        }
    }

    function keyup(event) {
        if (event.keyCode === 69) {
            Feed = false; // Stop feeding when E is released
        }
    }

    function macroFeed() {
        if (Feed) {
            triggerFeed();
            setTimeout(macroFeed, splitDelay);
        }
    }

    function triggerFeed() {
        const feedKey = new KeyboardEvent("keydown", { keyCode: 87 });
        window.dispatchEvent(feedKey);
        const feedKeyUp = new KeyboardEvent("keyup", { keyCode: 87 });
        window.dispatchEvent(feedKeyUp);
    }

    function triggerSplit() {
        const splitKey = new KeyboardEvent("keydown", { keyCode: 32 });
        window.dispatchEvent(splitKey);
        const splitKeyUp = new KeyboardEvent("keyup", { keyCode: 32 });
        window.dispatchEvent(splitKeyUp);
    }

    function splitMultiple(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(triggerSplit, splitDelay * i);
        }
    }

    // Initialize the combined script
    addInstructions();
    customizeUI();
    createFPSDisplay();
    calculateFPS();

    // Enable minimap settings when the page loads
    setTimeout(enableMinimap, 100);

    // Check and remove ads when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        checkAds();
        requestAnimationFrame(update);
    });

    // Remove ads and adjust banner height on initial load
    removeAds();
    adjustBannerHeight();

    // Use MutationObserver to watch for changes in the page
    const observer = new MutationObserver(() => {
        checkAds();
        toggleFPSDisplay();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
