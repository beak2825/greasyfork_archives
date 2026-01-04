// ==UserScript==
// @name         Comick MangaUpdates Import (DEPRECATED)
// @namespace    https://github.com/GooglyBlox
// @version      1.5
// @description  Import comics from MangaUpdates JSON export. 
// @author       GooglyBlox
// @match        https://comick.dev/import
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544792/Comick%20MangaUpdates%20Import%20%28DEPRECATED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544792/Comick%20MangaUpdates%20Import%20%28DEPRECATED%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_ENDPOINTS = {
        search: 'https://api.comick.dev/v1.0/search/',
        follow: 'https://api.comick.dev/follow'
    };

    const READING_LISTS = {
        1: 'Reading',
        2: 'Completed',
        3: 'On Hold',
        4: 'Dropped',
        5: 'Plan to Read'
    };

    const state = {
        observer: null,
        buttonAdded: false,
        iconsAdded: false,
        headingUpdated: false,
        isProcessing: false
    };

    function addMangaUpdatesIcon() {
        if (state.iconsAdded && document.querySelector('img[alt="MangaUpdates"]')) {
            return;
        }

        const anilistIcon = document.querySelector('.bg-auto.bg-al');
        if (!anilistIcon) return;

        const existingMangaUpdatesIcon = anilistIcon.parentNode.querySelector('img[alt="MangaUpdates"]');
        if (existingMangaUpdatesIcon) {
            state.iconsAdded = true;
            return;
        }

        const mangaUpdatesIcon = document.createElement('div');
        mangaUpdatesIcon.className = 'h-6 w-6 ml-2 rounded overflow-hidden';
        mangaUpdatesIcon.innerHTML = '<img src="https://www.mangaupdates.com/images/manga-updates.svg" class="h-full w-full object-cover" alt="MangaUpdates">';

        anilistIcon.insertAdjacentElement('afterend', mangaUpdatesIcon);
        state.iconsAdded = true;
    }

    function updateHeading() {
        const heading = document.querySelector('h2');
        if (!heading || !heading.textContent.includes('Import your list from Myanimelist, Anilist')) return;

        if (heading.textContent.includes('MangaUpdates')) {
            state.headingUpdated = true;
            return;
        }

        heading.textContent = 'Import your list from Myanimelist, Anilist, MangaUpdates';
        state.headingUpdated = true;
    }

    function createMangaUpdatesButton() {
        const container = document.createElement('div');
        container.className = 'flex items-center mt-3';

        container.innerHTML = `
            <button id="mangaupdates-import-btn" class="btn flex w-44 justify-start">
                <img src="https://www.mangaupdates.com/images/manga-updates.svg" class="h-6 w-6 mx-2 rounded" alt="MangaUpdates">
                <div>MangaUpdates</div>
            </button>
            <input type="file" id="mangaupdates-file-input" accept=".json" style="display: none;">
        `;

        const selector = createReadingListSelector();
        container.appendChild(selector);

        return container;
    }

    function createReadingListSelector() {
        const selector = document.createElement('div');
        selector.className = 'flex items-center ml-4';

        const options = Object.entries(READING_LISTS)
            .map(([value, text]) => `<option value="${value}">${text}</option>`)
            .join('');

        selector.innerHTML = `
            <label for="reading-list-select" class="text-sm text-gray-300 mr-2">Add to:</label>
            <select id="reading-list-select" class="bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-1 focus:outline-none focus:border-blue-500">
                ${options}
            </select>
        `;

        return selector;
    }

    function createProgressSection() {
        const section = document.createElement('div');
        section.id = 'mangaupdates-progress-section';
        section.className = 'mt-4 hidden';

        section.innerHTML = `
            <div class="p-4 bg-gray-800 rounded-lg border border-gray-600">
                <div class="flex justify-between text-sm text-gray-300 mb-2">
                    <span id="mangaupdates-progress-text">Processing MangaUpdates import...</span>
                    <span id="mangaupdates-progress-count">0/0</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                    <div id="mangaupdates-progress-bar" class="bg-blue-600 h-2 rounded-full" style="width: 0%"></div>
                </div>
                <div id="mangaupdates-results" class="mt-4 max-h-64 overflow-y-auto"></div>
            </div>
        `;

        return section;
    }

    function addMangaUpdatesButton() {
        if (state.buttonAdded || document.getElementById('mangaupdates-import-btn')) {
            return;
        }

        const importContainer = document.querySelector('.xl\\:container');
        if (!importContainer) return;

        const buttonContainers = importContainer.querySelectorAll('.flex.items-center.mt-3');
        if (buttonContainers.length === 0) return;

        const lastButtonContainer = buttonContainers[buttonContainers.length - 1];

        const mangaUpdatesButton = createMangaUpdatesButton();
        const progressSection = createProgressSection();

        lastButtonContainer.insertAdjacentElement('afterend', mangaUpdatesButton);
        mangaUpdatesButton.insertAdjacentElement('afterend', progressSection);

        state.buttonAdded = true;
        setupEventListeners();
    }

    function setupEventListeners() {
        const importBtn = document.getElementById('mangaupdates-import-btn');
        const fileInput = document.getElementById('mangaupdates-file-input');

        if (!importBtn || !fileInput) return;

        importBtn.addEventListener('click', () => {
            if (!state.isProcessing) {
                fileInput.click();
            }
        });

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file && !state.isProcessing) {
                await processMangaUpdatesFile(file);
                e.target.value = '';
            }
        });
    }

    async function processMangaUpdatesFile(file) {
        state.isProcessing = true;
        const importBtn = document.getElementById('mangaupdates-import-btn');
        const progressSection = document.getElementById('mangaupdates-progress-section');
        const originalBtnContent = importBtn.innerHTML;

        importBtn.textContent = 'Processing...';
        importBtn.disabled = true;
        progressSection.classList.remove('hidden');

        try {
            const fileContent = await readFileAsText(file);
            const mangaUpdatesData = JSON.parse(fileContent);

            if (!Array.isArray(mangaUpdatesData)) {
                throw new Error('Invalid MangaUpdates file format. Expected JSON array.');
            }

            await importFromMangaUpdates(mangaUpdatesData);

        } catch (error) {
            console.error('MangaUpdates import error:', error);
            showError(`Error processing MangaUpdates file: ${error.message}`);
        } finally {
            state.isProcessing = false;
            importBtn.disabled = false;
            importBtn.innerHTML = originalBtnContent;
        }
    }

    async function importFromMangaUpdates(mangaData) {
        const elements = {
            progressText: document.getElementById('mangaupdates-progress-text'),
            progressCount: document.getElementById('mangaupdates-progress-count'),
            progressBar: document.getElementById('mangaupdates-progress-bar'),
            resultsDiv: document.getElementById('mangaupdates-results'),
            readingListSelect: document.getElementById('reading-list-select')
        };

        const selectedListType = parseInt(elements.readingListSelect.value);
        const listName = READING_LISTS[selectedListType];

        const stats = {
            total: mangaData.length,
            processed: 0,
            successful: 0,
            failed: 0
        };

        elements.resultsDiv.innerHTML = `<div class="text-sm text-gray-300 mb-2 font-semibold">MangaUpdates Import Results (Adding to: ${listName}):</div>`;

        for (const manga of mangaData) {
            updateProgress(elements, manga.title, stats);

            const result = await processSingleManga(manga, selectedListType, listName);

            if (result.success) {
                stats.successful++;
                addResultItem(manga.title, 'success', result.message);
            } else {
                stats.failed++;
                addResultItem(manga.title, 'error', result.message);
            }

            stats.processed++;
            await delay(200);
        }

        finalizeImport(elements, stats);
    }

    async function processSingleManga(manga, listType, listName) {
        try {
            const searchResults = await searchComic(manga.title);

            if (!searchResults || searchResults.length === 0) {
                return { success: false, message: 'No matches found on Comick' };
            }

            const bestMatch = searchResults[0];
            const followResult = await followComic(bestMatch.id, listType);

            if (followResult.success) {
                return {
                    success: true,
                    message: `Added to ${listName}: ${bestMatch.title}`
                };
            }

            return {
                success: false,
                message: `Failed to follow (Status: ${followResult.status})`
            };

        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async function searchComic(title) {
        const params = new URLSearchParams({
            page: 1,
            limit: 15,
            showall: false,
            q: title,
            t: false
        });

        const response = await fetch(`${API_ENDPOINTS.search}?${params}`);

        if (!response.ok) {
            throw new Error(`Comick search failed: HTTP ${response.status}`);
        }

        return response.json();
    }

    async function followComic(comicId, listType = 1) {
        try {
            const response = await fetch(API_ENDPOINTS.follow, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: comicId,
                    t: listType
                }),
                credentials: 'include'
            });

            return {
                success: response.ok,
                status: response.status,
                data: response.ok ? await response.json() : null
            };
        } catch (error) {
            console.error('Follow API error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    function updateProgress(elements, title, stats) {
        elements.progressText.textContent = `Processing: ${title}`;
        elements.progressCount.textContent = `${stats.processed}/${stats.total}`;
        elements.progressBar.style.width = `${(stats.processed / stats.total) * 100}%`;
    }

    function finalizeImport(elements, stats) {
        elements.progressText.textContent = `MangaUpdates import complete: ${stats.successful} successful, ${stats.failed} failed`;
        elements.progressCount.textContent = `${stats.processed}/${stats.total}`;
        elements.progressBar.style.width = '100%';
    }

    function addResultItem(title, type, message) {
        const resultsDiv = document.getElementById('mangaupdates-results');
        const resultItem = document.createElement('div');

        const colorClass = type === 'success'
            ? 'text-green-400 bg-green-900/20'
            : 'text-red-400 bg-red-900/20';

        resultItem.className = `flex justify-between items-center py-1 px-2 text-sm rounded mb-1 ${colorClass}`;
        resultItem.innerHTML = `
            <span class="truncate flex-1 mr-2">${escapeHtml(title)}</span>
            <span class="text-xs">${escapeHtml(message)}</span>
        `;

        resultsDiv.appendChild(resultItem);
        resultsDiv.scrollTop = resultsDiv.scrollHeight;
    }

    function showError(message) {
        const resultsDiv = document.getElementById('mangaupdates-results');
        resultsDiv.innerHTML = `<div class="text-red-400 text-sm p-2 bg-red-900/20 rounded">${escapeHtml(message)}</div>`;
    }

    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function checkElementsExist() {
        const iconExists = document.querySelector('img[alt="MangaUpdates"]');
        const headingExists = document.querySelector('h2')?.textContent.includes('MangaUpdates');

        if (!iconExists) {
            state.iconsAdded = false;
        }
        if (!headingExists) {
            state.headingUpdated = false;
        }
    }

    function checkAndAddButton() {
        const isImportPage = window.location.pathname === '/import';

        if (!isImportPage) {
            cleanupElements();
            return;
        }

        const hasRequiredElements =
            document.querySelector('.xl\\:container') &&
            document.querySelector('h1')?.textContent.includes('Import');

        if (hasRequiredElements) {
            checkElementsExist();
            addMangaUpdatesIcon();
            updateHeading();

            if (!state.buttonAdded) {
                setTimeout(addMangaUpdatesButton, 100);
            }
        }
    }

    function cleanupElements() {
        state.buttonAdded = false;
        state.iconsAdded = false;
        state.headingUpdated = false;

        const elements = [
            document.getElementById('mangaupdates-import-btn')?.closest('.flex'),
            document.getElementById('mangaupdates-progress-section')
        ];

        elements.forEach(el => el?.remove());
    }

    function startObserver() {
        if (state.observer) {
            state.observer.disconnect();
        }

        state.observer = new MutationObserver(() => {
            checkAndAddButton();
        });

        state.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        checkAndAddButton();
        startObserver();

        window.addEventListener('popstate', () => {
            state.buttonAdded = false;
            state.iconsAdded = false;
            state.headingUpdated = false;
            setTimeout(checkAndAddButton, 200);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();