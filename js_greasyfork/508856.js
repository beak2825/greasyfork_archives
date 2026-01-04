// ==UserScript==
// @name         YouTube Music Bulk Remove
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bulk remove songs from YouTube Music playlists and library
// @author       oldhunterr
// @match        https://music.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508856/YouTube%20Music%20Bulk%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/508856/YouTube%20Music%20Bulk%20Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        addBulkRemoveButton();
    }

    const rightClickEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 2,
        buttons: 2
    });


    function addBulkRemoveButton() {
        if (!document.querySelector('#bulkRemoveBtn')) {
            const bulkRemoveBtn = document.createElement('button');
            bulkRemoveBtn.innerText = 'Bulk Remove Selected';
            bulkRemoveBtn.id = 'bulkRemoveBtn';
            bulkRemoveBtn.style.position = 'fixed';
            bulkRemoveBtn.style.right = '20px';
            bulkRemoveBtn.style.bottom = '20px';
            bulkRemoveBtn.style.zIndex = '9999';
            bulkRemoveBtn.style.padding = '10px 20px';
            bulkRemoveBtn.style.backgroundColor = '#FF0000';
            bulkRemoveBtn.style.color = '#FFF';
            bulkRemoveBtn.style.border = 'none';
            bulkRemoveBtn.style.borderRadius = '5px';
            bulkRemoveBtn.style.cursor = 'pointer';
            bulkRemoveBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            bulkRemoveBtn.addEventListener('click', handleBulkRemove);
            document.body.appendChild(bulkRemoveBtn);
        }
    }

    function getSelectedItems() {
        const checkedItemLabels = document.querySelectorAll('.ytmusic-responsive-list-item-renderer yt-checkbox-renderer[aria-checked="true"] label');
        return Array.from(checkedItemLabels);
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'progressOverlay';
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        font-family: Arial, sans-serif;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        display: none;
    `;

        const contentWrapper = document.createElement('div');
        contentWrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    `;

        const loadingGif = document.createElement('img');
        loadingGif.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ad/YouTube_loading_symbol_3_%28transparent%29.gif';
        loadingGif.style.cssText = `
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
    `;
        contentWrapper.appendChild(loadingGif);

        const progressText = document.createElement('div');
        progressText.id = 'progressText';
        progressText.style.cssText = `
        font-size: 18px;
    `;
        contentWrapper.appendChild(progressText);

        overlay.appendChild(contentWrapper);
        document.body.appendChild(overlay);

        return {
            overlay,
            progressText
        };
    }

    async function processItems(selectedItems) {
        const {
            overlay,
            progressText
        } = createOverlay();
        overlay.style.display = 'block';

        for (let index = 0; index < selectedItems.length; index++) {
            const item = selectedItems[index];
            let origText = `Processing item ${index + 1} of ${selectedItems.length}`;
            progressText.textContent = origText;

            // Update the progress text to indicate the current step
            progressText.textContent = origText + `\nRight-clicking on item ${index + 1}`;

            // Dispatch right-click event
            item.dispatchEvent(new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                view: window
            }));

            // Update the progress text to indicate waiting for the remove option

            progressText.textContent = origText + `\nWaiting for 'Remove from playlist' option for item ${index + 1}`;

            // Wait for the "Remove from playlist" option to appear
            let removeOption;
            while (!removeOption) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100ms
                removeOption = Array.from(document.querySelectorAll('ytmusic-menu-service-item-renderer, ytmusic-toggle-menu-service-item-renderer'))
                    .find(item => item.textContent.includes('Remove from playlist') || item.textContent.includes('Remove from library'));
            }

            // Update the progress text to indicate the option was found
            if (removeOption.textContent.includes('Remove from playlist')) {
                removeOption.click();
                progressText.textContent = origText + ' | Selected "Remove from playlist"';
            } else if (removeOption.textContent.includes('Remove from library')) {
                removeOption.click();
                progressText.textContent += ' | Selected "Remove from library"';
            }

            // Update the progress text to indicate the waiting time
            progressText.textContent = origText + `\nWaiting 1 second before processing the next item`;

            // Wait for 1 second before processing the next item
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        progressText.textContent = "All items processed";
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 3000);
    }


    // Usage


    function handleBulkRemove() {
        const selectedItems = getSelectedItems();
        processItems(selectedItems);
        //console.log(selectedItems)
    }
    // Call the init function
    init();
})();