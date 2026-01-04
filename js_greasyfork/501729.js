// ==UserScript==
// @name         Sketchfab Auto PreferredFormat Downloader and Attribution Saver Script
// @namespace    https://greasyfork.org/users/instancer-kirik
// @version      2.2.2
// @description  Automatically downloads preferred format and saves attribution from Sketchfab for one tab at a time. If you can automate this further; give it a try
// @author       instancer-kirik

// @match        https://sketchfab.com/3d-models/*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @license      Creative Commons Zero v1.0 Universal
// @downloadURL https://update.greasyfork.org/scripts/501729/Sketchfab%20Auto%20PreferredFormat%20Downloader%20and%20Attribution%20Saver%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/501729/Sketchfab%20Auto%20PreferredFormat%20Downloader%20and%20Attribution%20Saver%20Script.meta.js
// ==/UserScript==
// Built and tested with Violentmonkey on Arc browser for Windows.

(function() {
    'use strict';

    const DEBUG = true;

    function logDebug(message) {
        if (DEBUG) {
            console.log(`[Sketchfab Script] ${message}`);
        }
    }

    function getAttributionText() {
    logDebug('Getting attribution text...');
    const attributionElement = document.querySelector('.c-download__licence-box .NTUZeMcY');
    if (attributionElement) {
        return Promise.resolve(attributionElement.textContent.trim());
    } else {
        const copyCreditsButton = document.querySelector('.c-download__licence-box button.btn-primary-inverted-border');
        if (copyCreditsButton) {
            logDebug('Found "Copy credits" button. Clicking it...');
            copyCreditsButton.click();
            // Wait a bit for the clipboard to be populated
            return new Promise(resolve => {
                setTimeout(() => {
                    navigator.clipboard.readText().then(text => {
                        resolve(text.trim());
                    }).catch(err => {
                        logDebug('Failed to read clipboard: ', err);
                        resolve(fallbackAttributionGather());
                    });
                }, 100);
            });
        } else {
            return Promise.resolve(fallbackAttributionGather());
        }
    }
}

function handleDownloadModal() {
    logDebug('Handling download modal...');
    const preferredFormats = ['.blend', '.usdz', '.gltf', '.glb', '.obj','.fbx'];
    let selectedButton = null;

    for (let format of preferredFormats) {
        const buttons = document.querySelectorAll('.c-download__links button.button-source, .c-download__links button.button-extra');
        for (let button of buttons) {
            const formatElement = button.closest('.AUfL6oST')?.querySelector('.H6stunQl div');
            if (formatElement && formatElement.textContent.includes(format)) {
                selectedButton = button;
                break;
            }
        }
        if (selectedButton) break;
    }

    if (selectedButton) {
        const fileNameElement = document.querySelector('.c-download__title-text span');
        const fileName = fileNameElement ? fileNameElement.textContent.trim() : 'sketchfab_model';
        const formatElement = selectedButton.closest('.AUfL6oST')?.querySelector('.H6stunQl div');
        const format = formatElement ? formatElement.textContent.trim() : '';

        logDebug(`Selected format: ${format}`);

        // Trigger the download
        selectedButton.click();

        // Get attribution
        getAttributionText().then(attributionText => {
            if (attributionText) {
                saveAttribution(attributionText, `${fileName}${format}`);
            }
        }).catch(error => {
            logDebug('Error getting attribution: ', error);
        });
    } else {
        logDebug('No suitable download button found.');
    }
}

function fallbackAttributionGather() {
    const licenseBox = document.querySelector('.c-download__licence-box');
    if (licenseBox) {
        const titleElement = licenseBox.querySelector('a.skfb-link');
        const creatorElement = licenseBox.querySelector('a.skfb-link[href^="/"]');
        const licenseElement = licenseBox.querySelector('a.skfb-link[href^="http://creativecommons.org"]');

        if (titleElement && creatorElement && licenseElement) {
            return `${titleElement.textContent.trim()} by ${creatorElement.textContent.trim()} is licensed under ${licenseElement.textContent.trim()}`;
        }
    }
    return 'No attribution found.';
}
    function saveAttribution(attributionText, fileName) {
    logDebug('Saving attribution...');
    const attributionEntry = `\n${fileName}:\n${attributionText}\n`;

    // Read existing attributions
    let existingAttributions = '';
    try {
        existingAttributions = GM_getValue('attributions', '');
    } catch (error) {
        logDebug('Error reading existing attributions: ' + error);
    }

    // Append new attribution
    const newAttributions = existingAttributions + attributionEntry;

    // Save updated attributions
    try {
        GM_setValue('attributions', newAttributions);
    } catch (error) {
        logDebug('Error saving attributions: ' + error);
    }

    // Create or update attributions.txt file
    const blob = new Blob([newAttributions], { type: 'text/plain' });
    GM_download({
        url: URL.createObjectURL(blob),
        name: 'attributions.txt',
        saveAs: false
    });
    }

    function downloadModel(url, fileName) {
        logDebug(`Downloading: ${fileName}`);
        GM_download({
            url: url,
            name: fileName,
            saveAs: false
        });
    }




    function clickDownloadButton() {
        const downloadButton = document.querySelector('button[data-selenium="open-download-popup"]');
        if (downloadButton) {
            logDebug('Clicking download button...');
            downloadButton.click();
        } else {
            logDebug('Download button not found.');
        }
    }

    function waitForModal() {
        logDebug('Waiting for modal...');
        const observer = new MutationObserver((mutations, obs) => {
            const modal = document.querySelector('article[data-element="popup"]');
            if (modal) {
                logDebug('Modal found. Handling download...');
                obs.disconnect();
                setTimeout(handleDownloadModal, 1000); // Wait for modal content to load
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Main execution
    function main() {
        logDebug('Script started.');
        clickDownloadButton();
        waitForModal();
    }

    // Run the script after a short delay to ensure the page is fully loaded
    setTimeout(main, 2000);
})();