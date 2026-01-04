// ==UserScript==
// @name         Auto Link Collector and Downloader
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Collect links from fitgirl fuckingfast paste page which contains all the link and automatically start the download
// @author       OrekiKun
// @match        https://paste.fitgirl-repacks.site/*
// @match        https://fuckingfast.co/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546178/Auto%20Link%20Collector%20and%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/546178/Auto%20Link%20Collector%20and%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script loaded successfully!');

    // Add CSS styles using GM_addStyle (bypasses CSP)
    GM_addStyle(`
        #download-control-panel {
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            background: white !important;
            border: 2px solid #333 !important;
            border-radius: 8px !important;
            padding: 15px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            z-index: 999999 !important;
            max-width: 300px !important;
            font-family: Arial, sans-serif !important;
            font-size: 14px !important;
        }

        .dl-panel-title {
            margin: 0 0 10px 0 !important;
            color: #333 !important;
            font-size: 16px !important;
            font-weight: bold !important;
        }

        .dl-panel-info {
            margin: 5px 0 !important;
            color: #666 !important;
        }

        .dl-btn {
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            margin-right: 5px !important;
            font-size: 12px !important;
        }

        .dl-btn-start {
            background: #4CAF50 !important;
            color: white !important;
        }

        .dl-btn-close {
            background: #f44336 !important;
            color: white !important;
        }

        .dl-status {
            margin-top: 10px !important;
            font-size: 12px !important;
            color: #666 !important;
        }

        .dl-indicator {
            position: fixed !important;
            top: 10px !important;
            left: 10px !important;
            background: #4CAF50 !important;
            color: white !important;
            padding: 10px !important;
            border-radius: 4px !important;
            z-index: 999999 !important;
            font-family: Arial, sans-serif !important;
        }
    `);

    // Configuration
    const CONFIG = {
        sourceSelector: '#plaintext ul li a',
        downloadButtonSelector: 'button.link-button.text-5xl.gay-button',
        downloadDelay: 3000,
        tabCloseDelay: 5000
    };

    // Check if we're on the source page
    function isSourcePage() {
        const hasElement = document.querySelector('#plaintext ul') !== null;
        console.log('Checking for #plaintext ul:', hasElement);
        return hasElement;
    }

    // Check if we're on a download page
    function isDownloadPage() {
        const hasButton = document.querySelector(CONFIG.downloadButtonSelector) !== null;
        console.log('Checking for download button:', hasButton);
        return hasButton;
    }

    // Collect all links from the source page
    function collectLinks() {
        const links = [];
        const linkElements = document.querySelectorAll(CONFIG.sourceSelector);

        console.log('Found link elements:', linkElements.length);

        linkElements.forEach(function(link, index) {
            if (link.href) {
                links.push({
                    url: link.href,
                    text: link.textContent.trim()
                });
                console.log('Link ' + (index + 1) + ':', link.href);
            }
        });

        return links;
    }

    // Create control panel
    function createControlPanel(links) {
        console.log('Creating control panel...');

        // Remove existing panel if any
        const existingPanel = document.getElementById('download-control-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'download-control-panel';

        const title = document.createElement('h3');
        title.className = 'dl-panel-title';
        title.textContent = '🚀 Link Downloader';

        const info = document.createElement('p');
        info.className = 'dl-panel-info';
        info.textContent = 'Found ' + links.length + ' links';

        const startBtn = document.createElement('button');
        startBtn.id = 'start-download';
        startBtn.className = 'dl-btn dl-btn-start';
        startBtn.textContent = 'Start Downloads';

        const closeBtn = document.createElement('button');
        closeBtn.id = 'close-panel';
        closeBtn.className = 'dl-btn dl-btn-close';
        closeBtn.textContent = 'Close';

        const status = document.createElement('div');
        status.id = 'download-status';
        status.className = 'dl-status';

        panel.appendChild(title);
        panel.appendChild(info);
        panel.appendChild(startBtn);
        panel.appendChild(closeBtn);
        panel.appendChild(status);

        document.body.appendChild(panel);
        console.log('Panel added to body');

        // Add event listeners
        startBtn.addEventListener('click', function() {
            console.log('Start button clicked');
            startDownloadProcess(links);
        });

        closeBtn.addEventListener('click', function() {
            console.log('Close button clicked');
            panel.remove();
        });
    }

    // Start download process
    function startDownloadProcess(links) {
        const statusDiv = document.getElementById('download-status');
        let currentIndex = 0;

        function processNextLink() {
            if (currentIndex >= links.length) {
                statusDiv.textContent = '✓ All downloads completed!';
                statusDiv.style.color = 'green';
                return;
            }

            const link = links[currentIndex];
            statusDiv.textContent = 'Processing ' + (currentIndex + 1) + '/' + links.length + ': ' + link.text;

            GM_setValue('currentDownload', JSON.stringify({
                url: link.url,
                index: currentIndex,
                total: links.length
            }));

            GM_openInTab(link.url, {
                active: false,
                insert: true
            });

            currentIndex++;
            setTimeout(processNextLink, 2000);
        }

        processNextLink();
    }

    // Handle download page
    function handleDownloadPage() {
        const downloadInfo = GM_getValue('currentDownload');
        if (!downloadInfo) return;

        const info = JSON.parse(downloadInfo);

        setTimeout(function() {
            const downloadButton = document.querySelector(CONFIG.downloadButtonSelector);

            if (downloadButton) {
                console.log('Download button found, clicking...');

                const indicator = document.createElement('div');
                indicator.className = 'dl-indicator';
                indicator.textContent = 'Auto-downloading... (' + (info.index + 1) + '/' + info.total + ')';
                document.body.appendChild(indicator);

                downloadButton.click();

                setTimeout(function() {
                    window.close();
                }, CONFIG.tabCloseDelay);
            } else {
                console.log('Download button not found');
                setTimeout(function() {
                    window.close();
                }, 2000);
            }
        }, CONFIG.downloadDelay);
    }

    // Debug function to check page structure
    function debugPage() {
        console.log('=== PAGE DEBUG ===');
        console.log('URL:', window.location.href);

        // Check for plaintext div
        const plaintextDiv = document.querySelector('#plaintext');
        console.log('Has #plaintext div:', !!plaintextDiv);

        if (plaintextDiv) {
            const ul = plaintextDiv.querySelector('ul');
            console.log('Has ul inside #plaintext:', !!ul);

            if (ul) {
                const lis = ul.querySelectorAll('li');
                const links = ul.querySelectorAll('li a');
                console.log('Li elements:', lis.length);
                console.log('Links in li elements:', links.length);
            }
        }

        // Alternative selectors to try
        console.log('All divs with plaintext-related ids:');
        document.querySelectorAll('[id*="plaintext"], [id*="plain"], [class*="plaintext"]').forEach(function(el) {
            console.log('Found element:', el.tagName, el.id, el.className);
        });

        console.log('=== END DEBUG ===');
    }

    // Initialize script
    function init() {
        console.log('Initializing script...');
        debugPage();

        if (isSourcePage()) {
            console.log('Source page detected');
            const links = collectLinks();
            if (links.length > 0) {
                createControlPanel(links);
                console.log('Created panel with ' + links.length + ' links');
            } else {
                console.log('No links found in #plaintext ul li a');
                // Try alternative approach - show panel anyway for testing
                createControlPanel([]);
            }
        } else if (isDownloadPage()) {
            console.log('Download page detected');
            handleDownloadPage();
        } else {
            console.log('Neither source nor download page detected');
            // For debugging - show what we can find
            debugPage();
        }
    }

    // Multiple initialization attempts
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

    // Also try when window loads
    window.addEventListener('load', function() {
        setTimeout(init, 2000);
    });

})();
