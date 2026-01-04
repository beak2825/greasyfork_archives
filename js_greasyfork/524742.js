// ==UserScript==
// @name         Magnet Link Handler for qBittorrent WebUI
// @namespace    http://tampermonkey.net/
// @version      1.4
// @author       down_to_earth
// @description  Intercept magnet links and open qBittorrent download dialog in a popup.
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524742/Magnet%20Link%20Handler%20for%20qBittorrent%20WebUI.user.js
// @updateURL https://update.greasyfork.org/scripts/524742/Magnet%20Link%20Handler%20for%20qBittorrent%20WebUI.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function setValue(node, value) {
        if (!node || value === undefined) {
            return;
        }

        function triggerChangeEvent(node) {
            const event = new Event('change', { bubbles: true });
            node.dispatchEvent(event);
        }

        if (node.type === 'checkbox' || node.type === 'radio') {
            if (node.checked !== value) {
                node.checked = value;
                triggerChangeEvent(node);
            }
        } else {
            if (node.value !== value) {
                node.value = value;
                triggerChangeEvent(node);
            }
        }
    }

    function saveSettings(sourceHostname) {
        const settings = {};

        // Save all <select> elements
        document.querySelectorAll('select:not([disabled]):not([hidden])').forEach(select => {
            const key = select.name || select.id;
            settings[key] = select.value;
        });

        // Save all <input> elements
        document.querySelectorAll('input:not([disabled]):not([hidden])').forEach(input => {
            const key = input.name ||input.id;
            if (input.type === 'checkbox' || input.type === 'radio') {
                settings[key] = input.checked;
            } else {
                settings[key] = input.value;
            }
        });

        // Save to localStorage
        localStorage.setItem(`settings_${sourceHostname}`, JSON.stringify(settings));
    }

    async function restoreSettings(sourceHostname) {
        const settings = JSON.parse(localStorage.getItem(`settings_${sourceHostname}`) || 'null');
        if (!settings) {
            return;
        }

        const categoryValue = settings.categorySelect;
        const categorySelect = document.querySelector('#categorySelect');
        if (categoryValue && categorySelect) {
            // Wait for categories to load
            while (!Array.from(categorySelect.options).some(option => option.value === categoryValue)) {
                await sleep(10);
            }
            setValue(categorySelect, categoryValue);
        }

        // Restore all <select> elements
        document.querySelectorAll('select:not([disabled]):not([hidden])').forEach(select => {
            const key = select.name || select.id;
            if (key === 'categorySelect') {
                return;
            }
            setValue(select, settings[key]);
        });

        // Restore all <input> elements
        document.querySelectorAll('input:not([disabled]):not([hidden])').forEach(input => {
            const key = input.name || input.id;
            setValue(input, settings[key]);
        });
    }

    // Define the default qBittorrent WebUI URL
    const defaultQbWebUIHost = 'http://localhost:8080';

    // Retrieve the saved qBittorrent WebUI URL or use the default
    let qbWebUIHost = GM_getValue('qbWebUIHost', defaultQbWebUIHost);

    // Add a menu command to set the qBittorrent WebUI URL
    GM_registerMenuCommand('Set qBittorrent WebUI URL', () => {
        const newUrl = prompt('Enter the qBittorrent WebUI URL:', qbWebUIHost);
        if (newUrl) {
            GM_setValue('qbWebUIHost', newUrl); // Save the new URL
            qbWebUIHost = newUrl; // Update the script's URL
            alert(`qBittorrent WebUI URL set to: ${newUrl}`);
        }
    });

    // Check if the current page is the qBittorrent WebUI's
    const isMainPage = window.location.href.startsWith(qbWebUIHost) && window.location.pathname === '/';
    const isDownloadPage = window.location.href.startsWith(qbWebUIHost) && window.location.pathname === '/download.html';

    if (isMainPage) {
        const showDownloadPopup = async () => {
            const urlParams = new URLSearchParams(window.parent.location.search);
            const encodedSource = urlParams.get('source');
            if (!encodedSource) {
                // Do nothing if it's a normal WebUI open
                return;
            }

            const downloadIframe = document.createElement('iframe');
            const downloadUrl = new URL(window.location.href);
            downloadUrl.pathname = '/download.html';

            downloadIframe.src = downloadUrl.toString();
            downloadIframe.style.position = 'fixed';
            downloadIframe.style.top = '0';
            downloadIframe.style.left = '0';
            downloadIframe.style.width = '100%';
            downloadIframe.style.height = '100%';
            downloadIframe.style.border = 'none';
            downloadIframe.style.zIndex = '9999';
            downloadIframe.style.backgroundColor = 'white';

            // Append the iframe to the document body
            document.body.appendChild(downloadIframe);
        };
        if (document.readyState == 'complete') {
            await showDownloadPopup();
        } else {
            window.addEventListener("load", showDownloadPopup);
        }
    } else if (isDownloadPage) {
        // Check if the URL contains the `?source=` parameter
        const urlParams = new URLSearchParams(window.parent.location.search);
        const encodedSource = urlParams.get('source');
        if (!encodedSource) {
            return;
        }

        // Wait for the preferences to load
        const savePath = document.querySelector('#savepath');
        while (!savePath.value) {
            await sleep(10);
        }

        const sourceHostname = decodeURIComponent(encodedSource);

        // Register close handler
        const downloadFrame = document.querySelector('#download_frame');
        downloadFrame.addEventListener("load", function() {
            saveSettings(sourceHostname);
            window.parent.close();
        });

        await restoreSettings(sourceHostname);

        const autoDownload = urlParams.get('autoDownload') === 'true';
        if (autoDownload) {
            document.querySelector('#submitButton')?.click();
        }
    } else {
        // Function to handle magnet link clicks
        function handleMagnetLinkClick(event) {
            if ((event.type === 'click' && event.button !== 0) ||
                (event.type === 'mouseup' && event.button !== 1)) {
                return;
            }

            let target = event.target;
            while (target && target.tagName !== 'A') {
                target = target.parentElement;
            }

            // Check if the clicked element is a magnet link
            if (target?.href.startsWith('magnet:')) {
                event.preventDefault(); // Prevent the default behavior

                // Encode the magnet link for use in a URL
                const encodedMagnetLink = encodeURIComponent(target.href);

                // Get the source website hostname
                const sourceHostname = window.location.hostname;

                // Trigger auto download if clicked with Ctrl or Middle mouse click
                const autoDownload = event.ctrlKey || event.button === 1;

                // Open the qBittorrent WebUI's magnet handler in a popup
                const popupUrl = `${qbWebUIHost}/?urls=${encodedMagnetLink}&source=${sourceHostname}&autoDownload=${autoDownload}`

                // Define the popup dimensions
                const popupWidth = 500;
                const popupHeight = window.screen.height;

                // Calculate the position to center the popup
                const left = (window.screen.width - popupWidth) / 2;
                const top = (window.screen.height - popupHeight) / 2;

                // Open the popup with centered position
                let popupName = 'qBittorrentAddMagnet';
                if (autoDownload) {
                    popupName += crypto.randomUUID()
                }
                window.open(
                    popupUrl,
                    popupName,
                    `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
                );
            }
        }

        // Attach the event listeners to the document
        document.addEventListener('click', handleMagnetLinkClick, true);
        document.addEventListener('mouseup', handleMagnetLinkClick, true);
    }
})();