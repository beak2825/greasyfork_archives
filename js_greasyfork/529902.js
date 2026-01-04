// ==UserScript==
// @name        DuckDuckGo Image Link Extractor (Iterate Tiles)
// @namespace   yournamespace
// @match       https://duckduckgo.com/*images*
// @grant       none
// @version     1.7
// @license     GNU General Public License v3.0
// @description Iterates through div.tile--img, clicks, extracts, closes (fixed)
// @downloadURL https://update.greasyfork.org/scripts/529902/DuckDuckGo%20Image%20Link%20Extractor%20%28Iterate%20Tiles%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529902/DuckDuckGo%20Image%20Link%20Extractor%20%28Iterate%20Tiles%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false;
    let stopProcessing = false;
    let processedCount = 0;
    let totalCount = 0;

    async function processImageTiles() {
        if (isProcessing) return;
        
        isProcessing = true;
        stopProcessing = false;
        processedCount = 0;
        
        const imageTiles = document.querySelectorAll('div.tile--img');
        totalCount = imageTiles.length;
        
        updateProgress(0, totalCount);
        
        for (const tile of imageTiles) {
            if (stopProcessing) break;
            
            const imgElement = tile.querySelector('.tile--img__img');
            const dimensions = tile.querySelector('.tile--img__dimensions');
            
            if (imgElement && dimensions) {
                // Parse dimensions (format: "2560 × 1677")
                const [width, height] = dimensions.textContent.split(' × ').map(Number);
                
                // Calculate total pixels and compare to 1920x1080 (2,073,600 pixels)
                const totalPixels = width * height;
                if (totalPixels < 2073600) {
                    processedCount++; // Count as processed
                    updateProgress(processedCount, totalCount);
                    continue;
                }
                try {
                    imgElement.click();
                    const detailViewSuccess = await waitForDetailView();
                    if (detailViewSuccess) {
                        await extractAndClose();
                        processedCount++;
                        updateProgress(processedCount, totalCount);
                    }
                } catch (error) {
                    console.error('Error processing tile:', error);
                    // Continue with next tile even if one fails
                }
            }
            await new Promise(resolve => setTimeout(resolve, 500)); // Increased delay between tiles
        }

        isProcessing = false;
        showPopup(stopProcessing ? "Extraction stopped" : "Extraction complete");
        
        // Show select all button
        const selectAllBtn = document.querySelector('#extractedLinksList + div button');
        if (selectAllBtn) {
            selectAllBtn.style.display = 'block';
        }
    }

    async function waitForDetailView() {
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                const detailBtn = document.querySelector('a.c-detail__btn, .detail__media, .detail__content');
                if (detailBtn) {
                    clearInterval(checkInterval);
                    resolve(true);
                }
            }, 200);
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve(false);
            }, 3000);
        });
    }

    async function extractAndClose() {
        const linkElement = document.querySelector('a.c-detail__btn');
        if (linkElement) {
            const href = linkElement.getAttribute('href');
            if (href) {
                displaySingleLink(href);
            }
        }
        const closeButton = document.querySelector('a.detail__close');
        if (closeButton) {
            closeButton.click();
            await new Promise(resolve => setTimeout(resolve, 500)); // Increased delay after close
            // await waitForClose(); //removed waitForClose function
        }
    }

    function displaySingleLink(link) {
        let linkList = document.getElementById('extractedLinksList');
        if (!linkList) {
            createLinkLists();
            linkList = document.getElementById('extractedLinksList');
        }

        if (!linkList) {
            linkList = document.createElement('div');
            linkList.id = 'extractedLinksList';
            linkList.style.position = 'fixed';
            linkList.style.top = '10px';
            linkList.style.left = '10px';
            linkList.style.backgroundColor = '#f5f5f5';
            linkList.style.border = '1px solid #ddd';
            linkList.style.padding = '10px';
            linkList.style.zIndex = '1000';
            linkList.style.maxHeight = '33vh';
            linkList.style.overflowY = 'auto';
            linkList.style.width = '300px';
            linkList.style.borderRadius = '4px';
            linkList.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            document.body.appendChild(linkList);
        }

        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.margin = '0';
        ul.style.padding = '0';
        
        const li = document.createElement('li');
        li.style.margin = '5px 0';
        li.style.padding = '8px';
        li.style.backgroundColor = 'white';
        li.style.border = '1px solid #eee';
        li.style.borderRadius = '3px';
        
        const a = document.createElement('a');
        a.href = link;
        a.textContent = link;
        a.target = "_blank";
        a.style.color = '#0077cc';
        a.style.textDecoration = 'none';
        a.style.wordBreak = 'break-all';
        a.style.display = 'block';
        
        a.addEventListener('mouseover', () => {
            a.style.textDecoration = 'underline';
        });
        a.addEventListener('mouseout', () => {
            a.style.textDecoration = 'none';
        });

        li.appendChild(a);
        ul.appendChild(li);
        linkList.appendChild(ul);
        
        // Update link counter
        const linkCounter = document.getElementById('linkCounter');
        if (linkCounter) {
            const linkCount = linkList.querySelectorAll('ul').length;
            linkCounter.textContent = `${linkCount} link${linkCount !== 1 ? 's' : ''}`;
        }
    }

    function showPopup(message) {
        const popup = document.createElement('div');
        popup.textContent = message;
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid black';
        popup.style.padding = '10px';
        popup.style.zIndex = '1001';

        document.body.appendChild(popup);

        setTimeout(() => {
            document.body.removeChild(popup);
        }, 2000);
    }

    function createLinkLists() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '10px';
        container.style.zIndex = '1000';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';

        // Create select all button
        const selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = 'Select All';
        selectAllBtn.style.position = 'absolute';
        selectAllBtn.style.left = '320px'; // Position to the right of the link boxes
        selectAllBtn.style.top = '10px'; // Align with top of first box
        selectAllBtn.style.zIndex = '1001';
        selectAllBtn.style.padding = '4px 8px';
        selectAllBtn.style.borderRadius = '3px';
        selectAllBtn.style.border = '1px solid #ccc';
        selectAllBtn.style.backgroundColor = '#f5f5f5';
        selectAllBtn.style.cursor = 'pointer';
        
        selectAllBtn.addEventListener('click', () => {
            const linkList = document.getElementById('extractedLinksList');
            if (linkList) {
                const range = document.createRange();
                range.selectNodeContents(linkList);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        // Create good links list
        const goodList = document.createElement('div');
        goodList.id = 'extractedLinksList';
        goodList.style.backgroundColor = '#f5f5f5';
        goodList.style.border = '1px solid #ddd';
        goodList.style.padding = '10px';
        goodList.style.maxHeight = '33vh';
        goodList.style.overflowY = 'auto';
        goodList.style.width = '300px';
        goodList.style.borderRadius = '4px';
        goodList.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        goodList.style.position = 'relative'; // Needed for absolute positioning of counter

        // Create link counter
        const linkCounter = document.createElement('div');
        linkCounter.id = 'linkCounter';
        linkCounter.style.position = 'absolute';
        linkCounter.style.bottom = '5px';
        linkCounter.style.right = '10px';
        linkCounter.style.backgroundColor = 'rgba(255,255,255,0.8)';
        linkCounter.style.padding = '2px 6px';
        linkCounter.style.borderRadius = '3px';
        linkCounter.style.fontSize = '0.8em';
        linkCounter.style.color = '#666';
        linkCounter.textContent = '0 links';
        goodList.appendChild(linkCounter);

        container.appendChild(goodList);
        container.appendChild(selectAllBtn);
        document.body.appendChild(container);
    }


    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.zIndex = '1000';
        panel.style.display = 'flex';
        panel.style.gap = '5px';
        panel.style.backgroundColor = 'white';
        panel.style.padding = '5px';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '4px';

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Extraction';
        startButton.addEventListener('click', processImageTiles);

        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop';
        stopButton.style.backgroundColor = '#ff4444';
        stopButton.addEventListener('click', () => {
            stopProcessing = true;
        });

        const progress = document.createElement('div');
        progress.id = 'extractionProgress';
        progress.style.marginLeft = '10px';
        progress.style.padding = '5px 10px';

        panel.appendChild(startButton);
        panel.appendChild(stopButton);
        panel.appendChild(progress);
        document.body.appendChild(panel);
    }

    function updateProgress(current, total) {
        const progress = document.getElementById('extractionProgress');
        if (progress) {
            progress.textContent = `${current}/${total} (${Math.round((current/total)*100)}%)`;
            progress.style.color = current === total ? 'green' : 'black';
        }
    }

    createControlPanel();
})();
