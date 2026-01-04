// ==UserScript==
// @name         YouTube Auto 1080p60
// @namespace    https://violentmonkey.github.io/
// @version      1.8
// @description  Automatically set YouTube video and livestream quality to 1080p60 or fallback to the highest available resolution, avoiding Enhanced Bitrate options.
// @author       Indrath
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525319/YouTube%20Auto%201080p60.user.js
// @updateURL https://update.greasyfork.org/scripts/525319/YouTube%20Auto%201080p60.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let qualitySet = false;

    function waitForElement(selector, callback, interval = 500, maxAttempts = 10) {
        let attempts = 0;
        const checkExist = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkExist);
                callback(element);
            } else if (++attempts >= maxAttempts) {
                clearInterval(checkExist);
                console.log(`Element ${selector} not found.`);
            }
        }, interval);
    }

    function setQuality() {
        if (qualitySet) return; // Prevent continuous execution
        qualitySet = true;
        
        waitForElement('.ytp-settings-button', (settingsButton) => {
            settingsButton.click();
            waitForElement('.ytp-panel-menu .ytp-menuitem:last-child', (qualityMenu) => {
                qualityMenu.click();
                waitForElement('.ytp-quality-menu .ytp-menuitem', () => {
                    const qualityOptions = [...document.querySelectorAll('.ytp-quality-menu .ytp-menuitem')];
                    let targetOption = qualityOptions.find(option => option.innerText.includes('1080p') && !option.innerText.toLowerCase().includes('enhanced'));
                    if (!targetOption) {
                        targetOption = qualityOptions.find(option => !option.innerText.toLowerCase().includes('enhanced')) || qualityOptions[0]; // Fallback to highest non-enhanced resolution
                    }
                    if (targetOption) {
                        targetOption.click();
                        console.log(`Quality set to ${targetOption.innerText}.`);
                    } else {
                        console.log(`No suitable quality options found, using default.`);
                    }
                });
            });
        });
    }

    const observer = new MutationObserver(() => {
        const player = document.querySelector('video');
        if (player && player.readyState > 0) {
            setQuality();
            observer.disconnect(); // Stop observing after setting quality
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
