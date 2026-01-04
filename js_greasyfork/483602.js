// ==UserScript==
// @name         1337x - Combined Enhancements 2025 (v16) - Configurable
// @namespace    http://tampermonkey.net/
// @version      2025.16
// @description  Adds a column with torrent and magnet links, extends titles, adds images, full width site with configurable settings. Uses native fetch for Cloudflare compatibility.
// @author       sharmanhall
// @contributor  darkred, NotNeo, barn852, French Bond

// @match        *://1337x.to/*
// @match        *://1337x.st/*
// @match        *://x1337x.cc/*
// @match        *://x1337x.ws/*
// @match        *://x1337x.eu/*
// @match        *://x1337x.se/*
// @include      http://l337xdarkkaqfwzntnfk5bmoaroivtl6xsbatabvlb52umg6v3ch44yd.onion/*

// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1337x.to
// @downloadURL https://update.greasyfork.org/scripts/483602/1337x%20-%20Combined%20Enhancements%202025%20%28v16%29%20-%20Configurable.user.js
// @updateURL https://update.greasyfork.org/scripts/483602/1337x%20-%20Combined%20Enhancements%202025%20%28v16%29%20-%20Configurable.meta.js
// ==/UserScript==

//    v16 Changes:
//    - FIXED: Cloudflare 403 errors by using native fetch() instead of GM_xmlhttpRequest
//    - Native fetch properly sends HttpOnly cookies (like cf_clearance) that GM_xmlhttpRequest cannot access
//    - Removed GM_xmlhttpRequest dependency entirely for fetching torrent pages
//
//    Thanks to:
//    - French Bond, darkred, NotNeo, barn852 for original scripts

(function() {
    'use strict';

    // Configuration object
    let config = {
        showThumbnails: GM_getValue('showThumbnails', true),
        showExtraColumn: GM_getValue('showExtraColumn', true),
        showButtonsInNameColumn: GM_getValue('showButtonsInNameColumn', false),
        fullWidthSite: GM_getValue('fullWidthSite', true),
        visibleImages: GM_getValue('visibleImages', 4),
        queueFetchDelay: GM_getValue('queueFetchDelay', 100),
        maxRetries: GM_getValue('maxRetries', 3)
    };

    let extraColumnAdded = false;

    // CSS for the settings menu and buttons
    const settingsCSS = `
        .list-button-magnet > i.flaticon-magnet {
            font-size: 13px;
            color: #da3a04
        }
        .list-button-dl > i.flaticon-torrent-download {
            font-size: 13px;
            color: #89ad19;
        }
        table.table-list td.dl-buttons {
            border-left: 1px solid #f6f6f6;
            border-right: 1px solid #c0c0c0;
            padding-left: 2.5px;
            padding-right: 2.5px;
            text-align: center !important;
            position: relative;
            display: table-cell !important;
            width: 6%;
        }
        td.dl-buttons > a,
        td.dl-buttons > a:hover,
        td.dl-buttons > a:visited,
        td.dl-buttons > a:link,
        td.dl-buttons > a:active {
            color: inherit;
            text-decoration: none;
            cursor: pointer;
            display: inline-block !important;
            margin: 0 2px;
        }
        table.table-list td.coll-1b {
            border-right: 1px solid silver;
        }
        .table-list > thead > tr > th:nth-child(2),
        .table-list > thead > tr > td:nth-child(2) {
            text-align: center;
        }
        #x1337-settings-wrapper {
            font-family: 'Open Sans', sans-serif;
            background-color: #1d1d1d;
            color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(241, 78, 19, 0.5);
            position: fixed;
            top: 20px;
            right: -300px;
            width: 300px;
            transition: right 0.3s ease;
            z-index: 9999;
        }
        #x1337-settings-toggle {
            position: absolute;
            left: -30px;
            top: 0;
            width: 30px;
            height: 30px;
            background-color: #F14E13;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            box-shadow: -2px 0 5px rgba(0,0,0,0.2);
            cursor: pointer;
            text-align: center;
            line-height: 30px;
        }
        #x1337-settings-content {
            padding: 15px;
        }
        #x1337-settings-content h3 {
            color: #F14E13;
            border-bottom: 1px solid #F14E13;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .x1337-option {
            margin-bottom: 15px;
            color: #fff;
        }
        .x1337-option label {
            display: flex;
            align-items: center;
            cursor: pointer;
            color: #fff;
        }
        .x1337-option input[type="checkbox"] {
            margin-right: 10px;
        }
        .x1337-option input[type="number"],
        .x1337-option input[type="text"] {
            background-color: #2d2d2d;
            border: 1px solid #F14E13;
            color: #fff;
            padding: 5px;
            border-radius: 3px;
            width: 80px;
        }
        #x1337-save-settings {
            background-color: #F14E13;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.3s;
            box-shadow: 0 0 10px rgba(241, 78, 19, 0.5);
        }
        #x1337-save-settings:hover {
            background-color: #ff6a3c;
        }
        #x1337-settings-wrapper,
        #x1337-settings-wrapper * {
            color: #fff;
        }
        #x1337-popup {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #F14E13;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        .x1337-sub-option {
            margin-left: 25px;
            margin-top: 10px;
        }
        .x1337-sub-option label {
            display: block;
            margin-bottom: 8px;
            font-size: 12px;
        }
    `;

    const settingsHTML = `
        <div id="x1337-settings-wrapper">
            <div id="x1337-settings-toggle">⚙️</div>
            <div id="x1337-settings-content">
                <h3>1337x Enhancements Settings</h3>

                <div class="x1337-option">
                    <label>
                        <input type="checkbox" id="x1337-show-thumbnails" ${config.showThumbnails ? 'checked' : ''}>
                        Show Thumbnails
                    </label>
                    <div class="x1337-sub-option" ${config.showThumbnails ? '' : 'style="display:none;"'}>
                        <label>
                            Visible Images:
                            <input type="number" id="x1337-visible-images" value="${config.visibleImages}" min="1" max="10">
                        </label>
                        <label>
                            Queue Fetch Delay (ms):
                            <input type="number" id="x1337-queue-fetch-delay" value="${config.queueFetchDelay}" min="0" max="5000">
                        </label>
                        <label>
                            Max Fetch Retries:
                            <input type="number" id="x1337-max-retries" value="${config.maxRetries}" min="0" max="10">
                        </label>
                    </div>
                </div>
                <div class="x1337-option">
                    <label>
                        <input type="checkbox" id="x1337-show-magnet-column" ${config.showExtraColumn ? 'checked' : ''}>
                        Show Magnet URL Column
                    </label>
                </div>
                <div class="x1337-option">
                    <label>
                        <input type="checkbox" id="x1337-show-buttons-in-name" ${config.showButtonsInNameColumn ? 'checked' : ''}>
                        Show Buttons in Name Column
                    </label>
                </div>
                <div class="x1337-option">
                    <label>
                        <input type="checkbox" id="x1337-full-width-site" ${config.fullWidthSite ? 'checked' : ''}>
                        Full Width Site
                    </label>
                </div>
                <button id="x1337-save-settings">Save Settings</button><br>
                <small>v2025.16 | by sharmanhall</small>
            </div>
        </div>
    `;

    // ==================== FETCH QUEUE SYSTEM ====================
    const fetchQueue = [];
    let isProcessingQueue = false;

    function queueFetchRequest(url, onSuccess) {
        fetchQueue.push({ url, onSuccess, retries: 0 });
        if (!isProcessingQueue) {
            processQueue();
        }
    }

    function processQueue() {
        if (fetchQueue.length === 0) {
            isProcessingQueue = false;
            return;
        }

        isProcessingQueue = true;
        const { url, onSuccess, retries } = fetchQueue.shift();
        fetchContent(url, onSuccess, retries);
    }

    // Main fetch function using native fetch() - this properly sends HttpOnly cookies!
    function fetchContent(url, onSuccess, retries = 0) {
        fetch(url, {
            method: 'GET',
            credentials: 'same-origin', // This sends cookies including HttpOnly cf_clearance
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            // Check if we got a Cloudflare challenge page
            const isCloudflare = text.includes('Just a moment') ||
                                text.includes('cf_chl') ||
                                text.includes('challenge-platform');

            if (isCloudflare) {
                if (retries < config.maxRetries) {
                    // Retry with exponential backoff
                    const delay = config.queueFetchDelay * Math.pow(2, retries + 1);
                    console.warn(`[1337x] Cloudflare challenge for ${url}, retrying in ${delay}ms`);
                    fetchQueue.push({ url, onSuccess, retries: retries + 1 });
                    setTimeout(processQueue, delay);
                } else {
                    console.error(`[1337x] Max retries reached for ${url}`);
                    setTimeout(processQueue, config.queueFetchDelay);
                }
                return;
            }

            // Success! Parse the HTML and call the callback
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            onSuccess(doc);
            setTimeout(processQueue, config.queueFetchDelay);
        })
        .catch(error => {
            console.error(`[1337x] Fetch error for ${url}:`, error);

            if (retries < config.maxRetries) {
                const delay = config.queueFetchDelay * Math.pow(2, retries + 1);
                fetchQueue.push({ url, onSuccess, retries: retries + 1 });
                setTimeout(processQueue, delay);
            } else {
                setTimeout(processQueue, config.queueFetchDelay);
            }
        });
    }

    // ==================== COLUMN AND BUTTON FUNCTIONS ====================

    function appendColumn() {
        if (!config.showExtraColumn || extraColumnAdded) return;

        const allTables = document.querySelectorAll('.table-list-wrap');
        const isSeries = window.location.href.includes('/series/');
        const title = 'ml&nbsp;dl';

        allTables.forEach((table) => {
            const headersCellsInitial = table.querySelectorAll(`.table-list > thead > tr:not(.blank) > th:nth-child(1),
                                                                .table-list > tbody > tr:not(.blank) > td:nth-child(1)`);
            headersCellsInitial.forEach((cell, index) => {
                if (index === 0 && !isSeries) {
                    cell.insertAdjacentHTML('afterend', `<th class="coll-1b">${title}</th>`);
                } else {
                    let titleLink = cell.querySelectorAll('a')[1];
                    let href = titleLink ? titleLink.href : '';

                    cell.insertAdjacentHTML('afterend', `
                        <td class="coll-1b dl-buttons">
                            <a class="list-button-magnet" href="javascript:void(0)" data-href="${href}" title="Magnet link">
                                <i class="flaticon-magnet"></i>
                            </a>
                            <a class="list-button-dl" href="javascript:void(0)" data-href="${href}" title="Torrent download">
                                <i class="flaticon-torrent-download"></i>
                            </a>
                        </td>
                    `);
                }
            });
            extraColumnAdded = true;
        });

        addClickListeners(document.querySelectorAll('.list-button-magnet'), 'ml');
        addClickListeners(document.querySelectorAll('.list-button-dl'), 'dl');
    }

    // Click handler for magnet/download buttons - uses native fetch
    function addClickListeners(links, type) {
        links.forEach((link) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                let href = this.getAttribute('href');

                if (href === 'javascript:void(0)') {
                    let tLink = this.getAttribute('data-href');
                    const button = this;

                    // Use native fetch to get the torrent page
                    fetch(tLink, { credentials: 'same-origin' })
                    .then(response => response.text())
                    .then(text => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(text, 'text/html');

                        let retrievedLink = (type === 'ml')
                            ? doc.querySelector('a[href^="magnet:"]')
                            : doc.querySelector('.dropdown-menu > li > a');

                        if (retrievedLink) {
                            button.setAttribute('href', retrievedLink.href.replace('http:', 'https:'));
                            // Trigger the navigation
                            window.location.href = button.getAttribute('href');
                        } else {
                            showPopup('Link not found', 3000);
                        }
                    })
                    .catch(error => {
                        console.error('[1337x] Error fetching link:', error);
                        showPopup('Error fetching link', 3000);
                    });
                }
            }, false);
        });
    }

    // ==================== IMAGE/THUMBNAIL FUNCTIONS ====================

    function optimizeImageUrl(imgSrc) {
        const optimizations = [
            { from: 'https://imgtraffic.com/1s/', to: 'https://imgtraffic.com/1/' },
            { from: /https?:\/\/.*\/images\/.*\.th\.jpg$/, to: (url) => url.replace(/\.th\.jpg$/, '.jpg') },
            { from: 'https://22pixx.xyz/as/', to: 'https://22pixx.xyz/a/' },
            { from: 'http://imgblaze.net/data_server_', to: 'https://www.imgopaleno.site/data_server_' },
            { from: '/small/small_', to: '/big/' }
        ];

        return optimizations.reduce((url, opt) => {
            if (typeof opt.from === 'string') {
                return url.replace(opt.from, opt.to);
            } else if (opt.from instanceof RegExp) {
                return opt.from.test(url) ? url.replace(opt.from, opt.to) : url;
            }
            return url;
        }, imgSrc);
    }

    function appendImages(link, doc) {
        if (!config.showThumbnails) return;

        if (link.parentNode.querySelector('.thumbnail-container')) {
            return;
        }

        let images = doc.querySelectorAll('#description img');
        if (images.length > 0) {
            let flexContainer = document.createElement('div');
            flexContainer.classList.add('thumbnail-container');
            flexContainer.style.display = 'flex';
            flexContainer.style.flexWrap = 'wrap';
            flexContainer.style.gap = '10px';
            flexContainer.style.marginTop = '10px';
            let clonedImages = [];

            images.forEach((img, index) => {
                let clonedImg = img.cloneNode(true);
                let imgSrc = img.getAttribute('data-original') || img.src;
                imgSrc = optimizeImageUrl(imgSrc);

                clonedImg.src = imgSrc;
                clonedImg.style.maxHeight = '100px';
                clonedImg.style.setProperty('margin', '0', 'important');
                clonedImg.style.display = index < config.visibleImages ? 'block' : 'none';
                flexContainer.appendChild(clonedImg);
                clonedImages.push(clonedImg);

                clonedImg.addEventListener('mouseover', function(e) {
                    showEnlargedImg(imgSrc, e);
                });
                clonedImg.addEventListener('mousemove', updateEnlargedImgPosition);
                clonedImg.addEventListener('mouseout', removeEnlargedImg);
            });

            if (images.length > config.visibleImages) {
                let showMoreButton = document.createElement('button');
                showMoreButton.textContent = 'Show More';
                showMoreButton.onclick = function () {
                    let isShowingMore = showMoreButton.textContent === 'Show Less';
                    clonedImages.forEach((img, index) => {
                        if (index >= config.visibleImages) {
                            img.style.display = isShowingMore ? 'none' : 'block';
                        }
                    });
                    showMoreButton.textContent = isShowingMore ? 'Show More' : 'Show Less';
                };
                flexContainer.appendChild(showMoreButton);
            }

            link.parentNode.insertBefore(flexContainer, link.nextSibling);
        }
    }

    function showEnlargedImg(imgSrc, event) {
        removeEnlargedImg();
        const enlargedImg = document.createElement('img');
        enlargedImg.src = imgSrc;
        enlargedImg.id = 'x1337-enlarged-img';
        enlargedImg.style.position = 'fixed';
        enlargedImg.style.zIndex = '10000';
        enlargedImg.style.border = '2px solid #F14E13';
        enlargedImg.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        enlargedImg.style.maxWidth = '500px';
        enlargedImg.style.maxHeight = '500px';
        enlargedImg.style.width = 'auto';
        enlargedImg.style.height = 'auto';
        document.body.appendChild(enlargedImg);
        updateEnlargedImgPosition(event);
    }

    function updateEnlargedImgPosition(e) {
        const enlargedImg = document.getElementById('x1337-enlarged-img');
        if (enlargedImg) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const imgWidth = enlargedImg.offsetWidth;
            const imgHeight = enlargedImg.offsetHeight;

            let left = e.clientX + 20;
            let top = e.clientY + 20;

            if (left + imgWidth > viewportWidth) {
                left = e.clientX - imgWidth - 20;
            }
            if (top + imgHeight > viewportHeight) {
                top = e.clientY - imgHeight - 20;
            }

            enlargedImg.style.left = `${left}px`;
            enlargedImg.style.top = `${top}px`;
        }
    }

    function removeEnlargedImg() {
        const enlargedImg = document.getElementById('x1337-enlarged-img');
        if (enlargedImg) {
            document.body.removeChild(enlargedImg);
        }
    }

    // ==================== UTILITY FUNCTIONS ====================

    function injectCustomCSS() {
        let customCSS = settingsCSS;

        if (config.fullWidthSite) {
            customCSS += `
                .container { max-width: none !important; }
                main.container, div.container { max-width: 1450px; }
            `;
        }

        GM_addStyle(customCSS);
    }

    function cleanTitle(title) {
        if (title.startsWith('Download ')) {
            title = title.substring('Download '.length);
        }
        let pipeIndex = title.indexOf(' Torrent |');
        if (pipeIndex !== -1) {
            title = title.substring(0, pipeIndex);
        }
        return title;
    }

    function modifyH1ContentOnTorrentPages() {
        if (window.location.pathname.startsWith('/torrent/')) {
            let h1Element = document.querySelector('.box-info-heading h1');
            if (h1Element) {
                h1Element.textContent = cleanTitle(document.title);
            }
        }
    }

    // ==================== LINK PROCESSING ====================

    function processLink(link) {
        const row = link.closest('tr');
        if (row && row.dataset.processed === 'true') {
            return;
        }

        queueFetchRequest(link.href, (doc) => {
            let torrentLink = doc.querySelector("a[href*='itorrents.org/torrent/']");
            let magnetLink = doc.querySelector("a[href^='magnet:?']");

            updateLinkTitle(link, doc);

            if (config.showThumbnails) {
                appendImages(link, doc);
            }

            if (config.showButtonsInNameColumn) {
                addDownloadButtons(link, torrentLink, magnetLink);
            }

            if (row) {
                row.dataset.processed = 'true';
            }
        });
    }

    function updateLinkTitle(link, doc) {
        const titleEl = doc.querySelector('title');
        if (titleEl) {
            let title = cleanTitle(titleEl.innerText);
            link.innerText = title;
        }
    }

    function addDownloadButtons(link, torrentLink, magnetLink) {
        let existingTorrentButton = link.parentNode.querySelector('#DLT');
        let existingMagnetButton = link.parentNode.querySelector('#DLM');

        let buttonsContainer = link.parentNode.querySelector('.buttons-container');
        if (!buttonsContainer) {
            buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons-container');
            buttonsContainer.style.display = 'flex';
            buttonsContainer.style.alignItems = 'center';
            buttonsContainer.style.gap = '5px';
            buttonsContainer.style.marginTop = '10px';
            link.after(buttonsContainer);
        }

        if (torrentLink && !existingTorrentButton) {
            let torrentButton = document.createElement('a');
            torrentButton.href = torrentLink.href.replace('http:', 'https:');
            torrentButton.title = 'Download torrent file';
            torrentButton.id = 'DLT';
            torrentButton.innerHTML = '<i class="flaticon-torrent-download" style="color: #89ad19; font-size: 16px"></i>';
            buttonsContainer.appendChild(torrentButton);
        }

        if (magnetLink && !existingMagnetButton) {
            let magnetButton = document.createElement('a');
            magnetButton.href = magnetLink.href;
            magnetButton.title = 'Download via magnet';
            magnetButton.id = 'DLM';
            magnetButton.innerHTML = '<i class="flaticon-magnet" style="color: #da3a04; font-size: 16px"></i>';
            buttonsContainer.appendChild(magnetButton);
        }
    }

    function replaceLinkTextWithTitlesAndAppendImages() {
        let unprocessedRows = document.querySelectorAll('.table-list tbody tr:not([data-processed])');
        unprocessedRows.forEach(row => {
            let link = row.querySelector('a[href^="/torrent/"]');
            if (link) {
                processLink(link);
            }
        });
    }

    // ==================== POPUP SYSTEM ====================

    let popupQueue = [];
    let isShowingPopup = false;

    function showPopup(message, duration = 5000) {
        popupQueue.push({ message, duration });
        if (!isShowingPopup) {
            displayNextPopup();
        }
    }

    function displayNextPopup() {
        if (popupQueue.length === 0) {
            isShowingPopup = false;
            return;
        }

        isShowingPopup = true;
        const { message, duration } = popupQueue.shift();

        const popup = document.createElement('div');
        popup.id = 'x1337-popup';
        popup.textContent = message;

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                if (popup.parentNode) {
                    document.body.removeChild(popup);
                }
                displayNextPopup();
            }, 300);
        }, duration);
    }

    // ==================== SETTINGS MENU ====================

    function addSettingsMenu() {
        document.body.insertAdjacentHTML('beforeend', settingsHTML);

        document.getElementById('x1337-settings-toggle').addEventListener('click', function() {
            const wrapper = document.getElementById('x1337-settings-wrapper');
            wrapper.style.right = wrapper.style.right === '0px' ? '-300px' : '0px';
        });

        document.getElementById('x1337-show-thumbnails').addEventListener('change', function() {
            const visibleImagesOption = document.querySelector('.x1337-sub-option');
            visibleImagesOption.style.display = this.checked ? 'block' : 'none';
        });

        document.getElementById('x1337-save-settings').addEventListener('click', function() {
            config.showThumbnails = document.getElementById('x1337-show-thumbnails').checked;
            config.showExtraColumn = document.getElementById('x1337-show-magnet-column').checked;
            config.showButtonsInNameColumn = document.getElementById('x1337-show-buttons-in-name').checked;
            config.fullWidthSite = document.getElementById('x1337-full-width-site').checked;
            config.visibleImages = parseInt(document.getElementById('x1337-visible-images').value);
            config.queueFetchDelay = parseInt(document.getElementById('x1337-queue-fetch-delay').value);
            config.maxRetries = parseInt(document.getElementById('x1337-max-retries').value);

            GM_setValue('showThumbnails', config.showThumbnails);
            GM_setValue('showExtraColumn', config.showExtraColumn);
            GM_setValue('showButtonsInNameColumn', config.showButtonsInNameColumn);
            GM_setValue('fullWidthSite', config.fullWidthSite);
            GM_setValue('visibleImages', config.visibleImages);
            GM_setValue('queueFetchDelay', config.queueFetchDelay);
            GM_setValue('maxRetries', config.maxRetries);

            applySettings();
            showPopup('Settings saved successfully!');
        });
    }

    function applySettings() {
        if (config.showExtraColumn && !extraColumnAdded) {
            appendColumn();
        } else if (!config.showExtraColumn && extraColumnAdded) {
            document.querySelectorAll('.table-list-wrap').forEach(table => {
                const header = table.querySelector('.table-list > thead > tr > th.coll-1b');
                if (header) header.remove();

                table.querySelectorAll('.table-list > tbody > tr > td.coll-1b.dl-buttons').forEach(cell => {
                    cell.remove();
                });
            });
            extraColumnAdded = false;
        }

        if (!config.showButtonsInNameColumn) {
            document.querySelectorAll('.buttons-container').forEach(container => {
                container.remove();
            });
        }

        if (config.fullWidthSite) {
            document.body.classList.add('full-width-site');
        } else {
            document.body.classList.remove('full-width-site');
        }

        replaceLinkTextWithTitlesAndAppendImages();
        injectCustomCSS();
    }

    // ==================== MUTATION OBSERVER ====================

    function addMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.matches && node.matches('.table-list tbody tr')) {
                            let link = node.querySelector('a[href^="/torrent/"]');
                            if (link) {
                                processLink(link);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ==================== INITIALIZATION ====================

    let hasInitialized = false;

    function init() {
        if (hasInitialized) return;
        hasInitialized = true;

        console.log('[1337x] Initializing v16 - Native Fetch Edition');

        injectCustomCSS();
        addSettingsMenu();
        applySettings();
        modifyH1ContentOnTorrentPages();
        replaceLinkTextWithTitlesAndAppendImages();
        addMutationObserver();

        showPopup("1337x Enhancements v16 (by sharmanhall)", 5000);
    }

    // Run the script
    init();

})();