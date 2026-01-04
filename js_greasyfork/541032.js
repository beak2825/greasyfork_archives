// ==UserScript==
// @name         Claude Artifact Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Download Claude artifacts in mass, by range, or individually
// @author       anassk
// @license      MIT
// @match        https://claude.ai/*
// @noframes
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/541032/Claude%20Artifact%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/541032/Claude%20Artifact%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Only run in the main window, not in frames/iframes
    if (window !== window.top) {
        console.log('Claude Artifact Downloader: Skipping execution in frame/iframe');
        return;
    }

    // State tracking
    let artifactPanelOpen = false;

    // Utility function for clicking elements as specified in documentation
    function click(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        element.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, clientX: x, clientY: y, pointerId: 1, button: 0, buttons: 1}));
        element.dispatchEvent(new PointerEvent('pointerup', {bubbles: true, clientX: x, clientY: y, pointerId: 1, button: 0, buttons: 0}));
        element.dispatchEvent(new MouseEvent('click', {bubbles: true, clientX: x, clientY: y, button: 0, buttons: 0}));
    }

    // Utility function to wait for element
    async function waitForElement(selector, timeout = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await sleep(100);
        }
        throw new Error(`Element ${selector} not found after ${timeout}ms`);
    }

    // Sleep utility
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Show notification
    function notify(message, type = 'info') {
        GM_notification({
            text: message,
            title: 'Claude Artifact Downloader',
            timeout: 3000
        });
        console.log(`[Claude Artifact Downloader] ${message}`);
    }

    // Check if artifact panel is already open
    function isArtifactPanelOpen() {
        const indicators = [
            'div.border.border-border-300.font-medium.rounded-lg.overflow-hidden', // Download area
            'button[aria-haspopup="menu"].h-8.w-8.rounded-md.-mx-1:has(svg)', // Artifact menu button
        ];

        return indicators.some(selector => document.querySelector(selector));
    }

    // Step 1: Click first artifact (only if not already open)
    async function ensureArtifactPanelOpen() {
        try {
            if (isArtifactPanelOpen()) {
                console.log('Artifact panel already open');
                artifactPanelOpen = true;
                return true;
            }

            const artifact = await waitForElement('button:has(.artifact-block-cell)', 3000);
            click(artifact);
            console.log('Clicked first artifact');
            await sleep(500); // Wait for artifact to load
            artifactPanelOpen = true;
            return true;
        } catch (error) {
            // Try alternative selectors for artifacts
            try {
                const altSelectors = [
                    '[data-testid*="artifact"]',
                    '.artifact',
                    '[class*="artifact"]'
                ];

                for (const selector of altSelectors) {
                    try {
                        const altArtifact = await waitForElement(selector, 1000);
                        click(altArtifact);
                        console.log(`Clicked artifact using selector: ${selector}`);
                        await sleep(500);
                        artifactPanelOpen = true;
                        return true;
                    } catch (e) {
                        continue;
                    }
                }

                throw new Error('No artifact elements found');
            } catch (altError) {
                notify('No artifacts found', 'error');
                throw new Error('No artifacts found in conversation');
            }
        }
    }

    // Step 2: Open artifact menu (only for multiple artifacts)
    async function openArtifactMenu() {
        try {
            // First check if menu is already open
            const openMenu = document.querySelector('[role="menu"][data-state="open"]');
            if (openMenu && openMenu.querySelectorAll('li[role="none"]').length > 0) {
                console.log('Artifact menu already open');
                return true;
            }

            const parentDiv = document.querySelector('div.pr-2:nth-child(1)');
            if (parentDiv) {
                const menuButton = parentDiv.querySelector('button');
                if (menuButton) {
                    const firstChild = menuButton.querySelector('*');
                    click(firstChild);
                    console.log('Opened artifact menu');
                    await sleep(300);
                    return true;
                }
            }
            return false; // Menu not found (single artifact)
        } catch (error) {
            console.log('Artifact menu not available (likely single artifact)');
            return false;
        }
    }

    // Step 3: Switch to specific artifact
    async function switchToArtifact(index) {
        try {
            const menuButton = document.querySelector('button[aria-haspopup="menu"].h-8.w-8.rounded-md.-mx-1:has(svg)');
            if (!menuButton) return false;

            const menuId = menuButton.getAttribute('aria-controls');
            const menu = document.getElementById(menuId);
            if (!menu) return false;

            const items = menu.querySelectorAll('li[role="none"]');
            if (index >= items.length) {
                throw new Error(`Artifact index ${index} out of range (max: ${items.length - 1})`);
            }

            const menuItem = items[index].querySelector('[role="menuitem"]');
            if (menuItem) {
                click(menuItem);
                console.log(`Switched to artifact ${index}`);
                await sleep(500);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error switching artifact:', error);
            throw error;
        }
    }

    // Step 4: Open download menu
    async function openDownloadMenu() {
        try {
            // Check if download menu is already open
            const openDownloadMenu = document.querySelector('[role="menu"][data-state="open"]');
            if (openDownloadMenu && openDownloadMenu.querySelectorAll('a[download], a[href^="blob:"]').length > 0) {
                console.log('Download menu already open');
                return true;
            }

            const parentDiv = await waitForElement('div.border.border-border-300.font-medium.rounded-lg.overflow-hidden');
            const buttons = parentDiv.querySelectorAll('button');
            const targetButton = buttons[1]; // Second button

            if (targetButton) {
                const firstChild = targetButton.querySelector('*');
                click(firstChild);
                console.log('Opened download menu');
                await sleep(300);
                return true;
            }
            throw new Error('Download button not found');
        } catch (error) {
            console.error('Error opening download menu:', error);
            throw error;
        }
    }

    // Step 5: Download files
    async function downloadFiles() {
        try {
            const dropdown = await waitForElement('[role="menu"][data-state="open"]', 2000);
            const downloadLinks = dropdown.querySelectorAll('a[download], a[href^="blob:"]');

            console.log(`Found ${downloadLinks.length} download links`);
            if (downloadLinks.length === 0) {
                throw new Error('No download links found');
            }

            downloadLinks.forEach(link => link.click());
            console.log('Downloaded files');
            await sleep(100);

            // Close the download menu by clicking elsewhere or pressing escape
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            await sleep(200);

            return downloadLinks.length;
        } catch (error) {
            console.error('Error downloading files:', error);
            throw error;
        }
    }

    // Get artifact information
    async function getArtifactInfo() {
        try {
            await ensureArtifactPanelOpen();
            const hasMenu = await openArtifactMenu();

            if (!hasMenu) {
                notify('Single artifact detected');
                return { count: 1, hasMultiple: false };
            }

            // Count artifacts in menu
            const menuButton = document.querySelector('button[aria-haspopup="menu"].h-8.w-8.rounded-md.-mx-1:has(svg)');
            if (!menuButton) {
                return { count: 1, hasMultiple: false };
            }

            const menuId = menuButton.getAttribute('aria-controls');
            const menu = document.getElementById(menuId);
            if (!menu) {
                return { count: 1, hasMultiple: false };
            }

            const items = menu.querySelectorAll('li[role="none"]');

            notify(`Found ${items.length} artifacts`);
            return { count: items.length, hasMultiple: true };
        } catch (error) {
            console.error('Error getting artifact info:', error);
            throw error;
        }
    }

    // Download single artifact
    async function downloadSingleArtifact(index, artifactInfo) {
        try {
            if (artifactInfo.hasMultiple) {
                await openArtifactMenu();
                await switchToArtifact(index);
            }

            await openDownloadMenu();
            const fileCount = await downloadFiles();

            notify(`Downloaded ${fileCount} file(s) from artifact ${index + 1}`);
            return true;
        } catch (error) {
            console.error(`Error downloading artifact ${index}:`, error);
            notify(`Failed to download artifact ${index + 1}`, 'error');
            return false;
        }
    }

    // Reset state when page changes
    function resetState() {
        artifactPanelOpen = false;
        console.log('State reset');
    }

    // Main operations
    async function downloadAll() {
        try {
            resetState();
            notify('Starting download all artifacts...');
            const artifactInfo = await getArtifactInfo();

            let successCount = 0;
            for (let i = 0; i < artifactInfo.count; i++) {
                const success = await downloadSingleArtifact(i, artifactInfo);
                if (success) successCount++;

                // Add delay between downloads
                if (i < artifactInfo.count - 1) {
                    await sleep(1000);
                }
            }

            notify(`Downloaded ${successCount}/${artifactInfo.count} artifacts successfully`,
                   successCount === artifactInfo.count ? 'success' : 'warning');
        } catch (error) {
            console.error('Error in downloadAll:', error);
            notify('Failed to download all artifacts', 'error');
        }
    }

    async function downloadRange() {
        try {
            resetState();
            const artifactInfo = await getArtifactInfo();

            const startStr = prompt(`Enter start artifact number (1-${artifactInfo.count}):`);
            if (!startStr) return;

            const endStr = prompt(`Enter end artifact number (${startStr}-${artifactInfo.count}):`);
            if (!endStr) return;

            const start = parseInt(startStr) - 1; // Convert to 0-based index
            const end = parseInt(endStr) - 1;

            if (isNaN(start) || isNaN(end) || start < 0 || end >= artifactInfo.count || start > end) {
                notify('Invalid range', 'error');
                return;
            }

            notify(`Downloading artifacts ${start + 1} to ${end + 1}...`);

            let successCount = 0;
            for (let i = start; i <= end; i++) {
                const success = await downloadSingleArtifact(i, artifactInfo);
                if (success) successCount++;

                // Add delay between downloads
                if (i < end) {
                    await sleep(1000);
                }
            }

            notify(`Downloaded ${successCount}/${end - start + 1} artifacts successfully`,
                   successCount === (end - start + 1) ? 'success' : 'warning');
        } catch (error) {
            console.error('Error in downloadRange:', error);
            notify('Failed to download range', 'error');
        }
    }

    async function downloadSingle() {
        try {
            resetState();
            const artifactInfo = await getArtifactInfo();

            if (artifactInfo.count === 1) {
                notify('Only one artifact available, downloading...');
                await downloadSingleArtifact(0, artifactInfo);
                return;
            }

            // Show list of artifacts with their actual names if possible
            let artifactList = 'Available artifacts:\n';

            // Try to get artifact names from the menu
            if (artifactInfo.hasMultiple) {
                await openArtifactMenu();
                const menuButton = document.querySelector('button[aria-haspopup="menu"].h-8.w-8.rounded-md.-mx-1:has(svg)');
                if (menuButton) {
                    const menuId = menuButton.getAttribute('aria-controls');
                    const menu = document.getElementById(menuId);
                    if (menu) {
                        const items = menu.querySelectorAll('li[role="none"]');
                        items.forEach((item, index) => {
                            const titleDiv = item.querySelector('.line-clamp-2');
                            const typeSpan = item.querySelector('.text-text-300');
                            const title = titleDiv ? titleDiv.textContent.trim() : `Artifact ${index + 1}`;
                            const type = typeSpan ? typeSpan.textContent.trim() : '';
                            artifactList += `${index + 1}. ${title} ${type ? `(${type})` : ''}\n`;
                        });
                    }
                }
            } else {
                artifactList += '1. Artifact 1\n';
            }

            const choice = prompt(artifactList + '\nEnter artifact number to download:');
            if (!choice) return;

            const index = parseInt(choice) - 1;
            if (isNaN(index) || index < 0 || index >= artifactInfo.count) {
                notify('Invalid artifact number', 'error');
                return;
            }

            await downloadSingleArtifact(index, artifactInfo);
        } catch (error) {
            console.error('Error in downloadSingle:', error);
            notify('Failed to download single artifact', 'error');
        }
    }

    async function listArtifacts() {
        try {
            resetState();
            const artifactInfo = await getArtifactInfo();

            let message = `Total artifacts: ${artifactInfo.count}\n\n`;

            if (artifactInfo.hasMultiple) {
                message += 'Available artifacts:\n';

                // Get artifact details from menu
                await openArtifactMenu();
                const menuButton = document.querySelector('button[aria-haspopup="menu"].h-8.w-8.rounded-md.-mx-1:has(svg)');
                if (menuButton) {
                    const menuId = menuButton.getAttribute('aria-controls');
                    const menu = document.getElementById(menuId);
                    if (menu) {
                        const items = menu.querySelectorAll('li[role="none"]');
                        items.forEach((item, index) => {
                            const titleDiv = item.querySelector('.line-clamp-2');
                            const typeSpan = item.querySelector('.text-text-300');
                            const title = titleDiv ? titleDiv.textContent.trim() : `Artifact ${index + 1}`;
                            const type = typeSpan ? typeSpan.textContent.trim() : '';
                            message += `${index + 1}. ${title}\n   ${type}\n\n`;
                        });
                    }
                }
            } else {
                message += 'Single artifact available for download';
            }

            alert(message);
            notify('Artifact list displayed');
        } catch (error) {
            console.error('Error in listArtifacts:', error);
            notify('Failed to list artifacts', 'error');
        }
    }

    // Listen for page navigation to reset state
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            resetState();
        }
    }, 1000);

    // Register menu commands
    GM_registerMenuCommand('Download All', downloadAll);
    GM_registerMenuCommand('Download Range', downloadRange);
    GM_registerMenuCommand('Download Single', downloadSingle);
    GM_registerMenuCommand('List All', listArtifacts);

    // Initial notification
    console.log('Claude Artifact Downloader v1.0.3 loaded. Fixed multiple execution issue. Use Tampermonkey menu to access commands.');
})();
