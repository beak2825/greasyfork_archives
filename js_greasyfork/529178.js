// ==UserScript==
// @name         MangaDex Library Search/Filter
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Adding Advanced Search page ability to search through your library and filter by reading status, tags, and more.
// @author       MrNosferatu
// @match        https://mangadex.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangadex.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529178/MangaDex%20Library%20SearchFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/529178/MangaDex%20Library%20SearchFilter.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let db;
    const DB_NAME = 'MangadexDB';
    const MANGA_STORE = 'manga';
    const DB_VERSION = 2;
    let LibrarySearch = false;
    let filterMode = 'server';
    let isUpdatingDatabase = false;
    let globalFetchInterceptActive = false;

    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(MANGA_STORE)) {
                    db.createObjectStore(MANGA_STORE, { keyPath: 'id' });
                }
            };
        });
    }
    let isInTitlesPage = false;

    function cleanupFetchIntercept() {
        LibrarySearch = false;
        filterMode = 'server';
        if (window.originalFetch) {
            window.fetch = window.originalFetch;
            window.originalFetch = null;
        }
    }

    function setupFetchIntercept() {
        if (!window.originalFetch) {
            window.originalFetch = window.fetch;
            const originalFetch = window.originalFetch;

            window.fetch = async function (input, init) {
                const url = input instanceof Request ? input.url : input;

                if (!window.location.href.startsWith('https://mangadex.org/titles')) {
                    return originalFetch.call(this, input, init);
                }

                if (typeof url === 'string' && url.startsWith('https://api.mangadex.org/manga?')) {
                    const searchParams = parseSearchParams(url);
                    const results = await searchMangaByParams(searchParams);

                    if (results) {
                        return new Response(JSON.stringify(results), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                }

                return originalFetch.call(this, input, init);
            };
        }
    }

    function setupGlobalFetchIntercept() {
        if (!globalFetchInterceptActive) {
            const originalFetch = window.fetch;
            window.fetch = async function(input, init) {
                const url = input instanceof Request ? input.url : input;
                const response = await originalFetch.call(this, input, init);

                try {
                    const clonedResponse = response.clone();
                    
                    // Handle manga status updates globally
                    if (typeof url === 'string' && url === 'https://api.mangadex.org/manga/status') {
                        const data = await clonedResponse.json();
                        if (data.result === 'ok') {
                            updateMangaStatusInDb(data.statuses);
                        }
                    }
                    // Handle manga attributes updates globally
                    else if (typeof url === 'string' && url.startsWith('https://api.mangadex.org/manga?')) {
                        const data = await clonedResponse.json();
                        if (data.result === 'ok') {
                            updateMangaAttributesInDb(data.data);
                        }
                    }
                } catch (e) {
                    console.error('Error in passive update:', e);
                }

                return response;
            };
            globalFetchInterceptActive = true;
        }
    }

    async function updateMangaStatusInDb(statusList) {
        if (!db) {
            await initDB();
        }

        const transaction = db.transaction(MANGA_STORE, 'readwrite');
        const store = transaction.objectStore(MANGA_STORE);

        // Update status for existing manga
        for (const [id, status] of Object.entries(statusList)) {
            try {
                const manga = await new Promise((resolve, reject) => {
                    const request = store.get(id);
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });

                if (manga) {
                    manga.status = status;
                    await storeMangaData(manga);
                }
            } catch (e) {
                console.error('Error updating manga status:', e);
            }
        }
    }

    async function updateMangaAttributesInDb(mangaList) {
        if (!db) {
            await initDB();
        }

        const transaction = db.transaction(MANGA_STORE, 'readwrite');
        const store = transaction.objectStore(MANGA_STORE);

        for (const newManga of mangaList) {
            try {
                const existingManga = await new Promise((resolve, reject) => {
                    const request = store.get(newManga.id);
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });

                if (existingManga) {
                    const existingDate = new Date(existingManga.attributes.updatedAt);
                    const newDate = new Date(newManga.attributes.updatedAt);

                    if (newDate > existingDate) {
                        // Update only attributes while preserving status
                        existingManga.attributes = newManga.attributes;
                        existingManga.relationships = newManga.relationships;
                        await storeMangaData(existingManga);
                    }
                }
            } catch (e) {
                console.error('Error updating manga attributes:', e);
            }
        }
    }

    function addLoadingMessage() {
        const existingMessage = document.querySelector('[data-db-loading-message]');
        if (existingMessage) {
            return existingMessage;
        }

        const messageElement = document.createElement('div');
        messageElement.setAttribute('data-db-loading-message', '');
        messageElement.className = 'overflow-x-auto fill-width mb-4 mt-2';
        messageElement.innerHTML = `
            <div class="md:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-8 my-4">
                <div class="relative space-y-1 grid">
                    <label class="text-midTone truncate xl:text-base text-sm">
                        <div class="flex items-center gap-2">
                            <svg class="animate-spin" width="24" height="24" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4 31.4">
                                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                                </circle>
                            </svg>
                            <span>Preparing Library Database</span>
                        </div>
                    </label>
                </div>
            </div>`;

        let targetElement;
        targetElement = document.querySelector('.hidden.md\\:flex.gap-4.items-center.justify-end.mt-8');
        if (targetElement) {
            targetElement.parentNode.insertBefore(messageElement, targetElement);
        }
        return messageElement;
    }

    function checkUrl() {
        const isTitlesPage = document.title.includes('Advanced Search - MangaDex');

        if (isTitlesPage && !isInTitlesPage) {
            const loadingMessage = addLoadingMessage();
            UpdateDatabase().then(() => {
                loadingMessage.remove();
                addFilterOptions();
            });
        } else if (!isTitlesPage && isInTitlesPage) {
            cleanupFetchIntercept();
        }

        isInTitlesPage = isTitlesPage;
    }

    function delayedCheckUrl() {
        setTimeout(checkUrl, 100);
    }

    const intervalId = setInterval(() => {
        if (checkUrl()) {
            clearInterval(intervalId);
        }
    }, 50);

    window.addEventListener('popstate', delayedCheckUrl);
    window.addEventListener('pushState', delayedCheckUrl);
    window.addEventListener('replaceState', delayedCheckUrl);

    (function (history) {
        const pushState = history.pushState;
        const replaceState = history.replaceState;

        history.pushState = function (state) {
            if (typeof history.onpushstate == "function") {
                history.onpushstate({ state: state });
            }
            const result = pushState.apply(history, arguments);
            window.dispatchEvent(new Event('pushState'));
            return result;
        };

        history.replaceState = function (state) {
            if (typeof history.onreplacestate == "function") {
                history.onreplacestate({ state: state });
            }
            const result = replaceState.apply(history, arguments);
            window.dispatchEvent(new Event('replaceState'));
            return result;
        };
    })(window.history);

    function addFilterOptions() {
        const existingSelector = document.querySelector('[data-db-mode-selector]');
        if (existingSelector) {
            existingSelector.remove();
        }

        const filterModeElement = document.createElement('div');
        filterModeElement.setAttribute('data-v-9c7a6448', '');
        filterModeElement.setAttribute('data-db-mode-selector', '');
        filterModeElement.className = 'overflow-x-auto fill-width mb-4 mt-2';
        filterModeElement.innerHTML = `
        <div class="md:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-8 my-4">
            <div class="relative space-y-1 grid" disablefilter="false" data-headlessui-state=""><!---->
                <label id="headlessui-listbox-label-v-0-1-84" data-headlessui-state="" class="text-midTone truncate xl:text-base text-sm">
                    <div class="flex items-center gap-2">
                        <div data-v-e5d18c36="" class="!pointer-events-auto">
                            <label data-v-e5d18c36="" tabindex="0" class="md-checkbox focus-within:outline-white gap-2 cursor-pointer" role="checkbox" for="chk-0.6629598450604657" aria-disabled="false" aria-checked="false">
                                <span data-v-e5d18c36="" class="md-checkbox__wrap checkbox-icon">
                                    <svg data-v-9ba4cb7e="" data-v-e5d18c36="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-square icon text-icon-contrast text-undefined unchecked-icon" viewBox="0 0 24 24">
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                    </svg>
                                    <svg data-v-9ba4cb7e="" data-v-e5d18c36="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon text-icon-contrast text-undefined checked-icon" style="display: none;">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                        <path stroke="rgb(var(--md-primary))" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 11 3 3L22 4"></path>
                                    </svg>
                                    <input data-v-e5d18c36="" type="checkbox" id="chk-0.6629598450604657" hidden="" modelvalue="false" name="db_mode" id="library">
                                </span>
                                <span data-v-e5d18c36="">Browse My Library</span><!---->
                            </label><!---->
                        </div>
                    </div>
                </label>
                <div data-v-9c7a6448="" class="select__tabs">
                    <input type="radio" id="all" name="library_mode" class="hidden" checked>
                    <label for="all" data-v-9c7a6448="" class="select__tab active"><span data-v-9c7a6448="">All</span></label>
                    <input type="radio" id="reading" name="library_mode" class="hidden">
                    <label for="reading" data-v-9c7a6448="" class="select__tab"><span data-v-9c7a6448="">Reading</span></label>
                    <input type="radio" id="plan_to_read" name="library_mode" class="hidden">
                    <label for="plan_to_read" data-v-9c7a6448="" class="select__tab"><span data-v-9c7a6448="">Plan to Read</span></label>
                    <input type="radio" id="completed" name="library_mode" class="hidden">
                    <label for="completed" data-v-9c7a6448="" class="select__tab"><span data-v-9c7a6448="">Completed</span></label>
                    <input type="radio" id="on_hold" name="library_mode" class="hidden">
                    <label for="on_hold" data-v-9c7a6448="" class="select__tab"><span data-v-9c7a6448="">On Hold</span></label>
                    <input type="radio" id="re_reading" name="library_mode" class="hidden">
                    <label for="re_reading" data-v-9c7a6448="" class="select__tab"><span data-v-9c7a6448="">Re-reading</span></label>
                    <input type="radio" id="dropped" name="library_mode" class="hidden">
                    <label for="dropped" data-v-9c7a6448="" class="select__tab"><span data-v-9c7a6448="">Dropped</span></label>
                </div>
            </div>
        </div>`;

        // Add event listeners for DB mode switching
        const tabs = filterModeElement.querySelectorAll('.select__tab');
        const checkbox = filterModeElement.querySelector('input[name="db_mode"]');
        const checkedIcon = filterModeElement.querySelector('.checked-icon');
        const uncheckedIcon = filterModeElement.querySelector('.unchecked-icon');
        const libraryModes = filterModeElement.querySelectorAll('input[name="library_mode"]');
        const libraryTabs = filterModeElement.querySelector('.select__tabs');

        // Initially disable library modes
        libraryTabs.style.pointerEvents = 'none';
        libraryTabs.style.opacity = '0.5';

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                checkedIcon.style.display = 'block';
                uncheckedIcon.style.display = 'none';
                libraryTabs.style.pointerEvents = 'auto';
                libraryTabs.style.opacity = '1';

                // When enabling checkbox, trigger the currently selected library mode
                const selectedMode = filterModeElement.querySelector('input[name="library_mode"]:checked');
                if (selectedMode) {
                    filterMode = selectedMode.id;
                    LibrarySearch = true;
                    setupFetchIntercept();
                }
            } else {
                checkedIcon.style.display = 'none';
                uncheckedIcon.style.display = 'block';
                libraryTabs.style.pointerEvents = 'none';
                libraryTabs.style.opacity = '0.5';
                LibrarySearch = false;
                filterMode = 'server';
                cleanupFetchIntercept();
            }
        });

        libraryModes.forEach(input => {
            input.addEventListener('change', (e) => {
                if (!window.location.href.startsWith('https://mangadex.org/titles')) {
                    return;
                }

                if (checkbox.checked) {
                    LibrarySearch = true;
                    filterMode = e.target.id;
                    tabs.forEach(t => t.classList.remove('active'));
                    e.target.nextElementSibling.classList.add('active');
                    setupFetchIntercept();
                }
            });
        });

        let targetElement;
        const intervalId = setInterval(() => {
            targetElement = document.querySelector('.hidden.md\\:flex.gap-4.items-center.justify-end.mt-8');
            if (targetElement) {
                clearInterval(intervalId);
                targetElement.parentNode.insertBefore(filterModeElement, targetElement);
            }
        }, 100);
    }

    function getAccessToken() {
        const oidcKey = Object.keys(localStorage).find(key => key.startsWith('oidc.user:'));
        if (!oidcKey) return null;
        try {
            const oidcData = JSON.parse(localStorage.getItem(oidcKey));
            return oidcData.access_token;
        } catch (e) {
            console.error('Error parsing OIDC data:', e);
            return null;
        }
    }

    async function fetchMangaDetails(mangaIds) {
        const queryString = mangaIds.map(id => `ids[]=${id}`).join('&');
        try {
            const response = await fetch(`https://api.mangadex.org/manga?${queryString}&limit=100&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&includes[]=cover_art&includes[]=artist&includes[]=author`);
            const data = await response.json();
            return data;
        } catch (e) {
            console.error('Error fetching manga details:', e);
            return null;
        }
    }

    async function storeMangaData(manga) {
        const transaction = db.transaction(MANGA_STORE, 'readwrite');
        const store = transaction.objectStore(MANGA_STORE);
        return store.put(manga);
    }

    async function deleteUnusedManga(statusList) {
        const transaction = db.transaction(MANGA_STORE, 'readwrite');
        const store = transaction.objectStore(MANGA_STORE);

        return new Promise((resolve, reject) => {
            const request = store.openCursor();

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (!statusList[cursor.value.id]) {
                        cursor.delete();
                    }
                    cursor.continue();
                } else {
                    resolve();
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    async function UpdateDatabase() {
        const token = getAccessToken();
        if (!token) return;

        try {
            isUpdatingDatabase = true;
            const response = await fetch('https://api.mangadex.org/manga/status', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const data = await response.json();

            if (data.result === 'ok') {
                const db = await initDB();

                // Update existing manga statuses first
                for (const [id, status] of Object.entries(data.statuses)) {
                    const transaction = db.transaction(MANGA_STORE, 'readwrite');
                    const store = transaction.objectStore(MANGA_STORE);
                    const existingManga = await new Promise(resolve => {
                        store.get(id).onsuccess = (e) => resolve(e.target.result);
                    });
                    if (existingManga) {
                        existingManga.status = status;
                        await storeMangaData(existingManga);
                    }
                }

                await deleteUnusedManga(data.statuses);

                const missingMangaIds = [];

                for (const [id, status] of Object.entries(data.statuses)) {
                    const transaction = db.transaction(MANGA_STORE, 'readonly');
                    const store = transaction.objectStore(MANGA_STORE);
                    const exists = await new Promise(resolve => {
                        store.count(id).onsuccess = (e) => resolve(e.target.result > 0);
                    });
                    if (!exists) {
                        missingMangaIds.push(id);
                    }
                }
                for (let i = 0; i < missingMangaIds.length; i += 100) {
                    const chunk = missingMangaIds.slice(i, i + 100);
                    const mangaData = await fetchMangaDetails(chunk);

                    if (mangaData && mangaData.result === 'ok') {
                        for (const manga of mangaData.data) {
                            manga.status = data.statuses[manga.id];
                            await storeMangaData(manga);
                        }
                    }

                    if (i + 100 < missingMangaIds.length) {
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                }
            }
        } catch (error) {
            console.error('Error updating database:', error);
        } finally {
            isUpdatingDatabase = false;
        }
    }

    async function searchMangaByParams(params) {
        const allManga = await getAllManga();
        if (!allManga || allManga.length === 0) return null;

        const {
            includedTags = [],
            excludedTags = [],
            includedTagsMode = 'AND',
            excludedTagsMode = 'OR',
            originLang = [],
            onlyAvailableChapters = false,
            author = [],
            statuses = [],
            content = [],
            demos = [],
            artist = [],
            year = null,
            translatedLang = [],
            limit = 32,
            offset = 0,
            title = '',
            order = {}
        } = params;

        const numLimit = parseInt(limit);
        const numOffset = parseInt(offset);

        let filteredData = allManga;
        if (filterMode === 'reading') {
            filteredData = filteredData.filter(manga => manga.status === 'reading');
        } else if (filterMode === 'plan_to_read') {
            filteredData = filteredData.filter(manga => manga.status === 'plan_to_read');
        } else if (filterMode === 'completed') {
            filteredData = filteredData.filter(manga => manga.status === 'completed');
        } else if (filterMode === 'on_hold') {
            filteredData = filteredData.filter(manga => manga.status === 'on_hold');
        } else if (filterMode === 're_reading') {
            filteredData = filteredData.filter(manga => manga.status === 're_reading');
        } else if (filterMode === 'dropped') {
            filteredData = filteredData.filter(manga => manga.status === 'dropped');
        }

        const matchedManga = filteredData.filter(manga => {
            const mangaTags = manga.attributes.tags.map(tag => tag.id);
            const mangaLang = manga.attributes.originalLanguage;
            const mangaAuthors = manga.relationships.filter(rel => rel.type === 'author').map(author => author.id);
            const mangaArtists = manga.relationships.filter(rel => rel.type === 'artist').map(artist => artist.id);
            const mangaStatus = manga.attributes.status;
            const mangaContentRating = manga.attributes.contentRating;
            const mangaDemographics = manga.attributes.publicationDemographic;
            const mangaYear = manga.attributes.year;
            const mangaTranslatedLang = manga.attributes.availableTranslatedLanguages;
            const mangaTitle = Object.values(manga.attributes.title).join(' ');
            const mangaAltTitles = manga.attributes.altTitles.map(altTitle => Object.values(altTitle).join(' ')).join(' ');

            const includedTagsMatch = includedTags.length === 0 || (
                includedTagsMode === 'AND'
                    ? includedTags.every(tag => mangaTags.includes(tag))
                    : includedTags.some(tag => mangaTags.includes(tag))
            );

            const excludedTagsMatch = excludedTags.length === 0 || (
                excludedTagsMode === 'AND'
                    ? excludedTags.every(tag => !mangaTags.includes(tag))
                    : excludedTags.every(tag => !mangaTags.includes(tag))
            );

            return (
                includedTagsMatch &&
                excludedTagsMatch &&
                (originLang.length === 0 || originLang.includes(mangaLang)) &&
                (!onlyAvailableChapters || manga.attributes.availableChapters > 0) &&
                (author.length === 0 || author.some(a => mangaAuthors.includes(a))) &&
                (statuses.length === 0 || statuses.includes(mangaStatus)) &&
                (content.length === 0 || content.includes(mangaContentRating)) &&
                (demos.length === 0 || demos.includes(mangaDemographics)) &&
                (artist.length === 0 || artist.some(a => mangaArtists.includes(a))) &&
                (!year || mangaYear === parseInt(year)) &&
                (translatedLang.length === 0 || translatedLang.some(lang => mangaTranslatedLang.includes(lang))) &&
                (title === '' || title === null || mangaTitle.toLowerCase().includes(title.toLowerCase()) || mangaAltTitles.toLowerCase().includes(title.toLowerCase()))
            );
        });

        let sortedManga = [...matchedManga];
        
        Object.entries(order).forEach(([key, direction]) => {
            sortedManga.sort((a, b) => {
                let valueA, valueB;
                
                switch(key) {
                    case 'title':
                        valueA = Object.values(a.attributes.title)[0]?.toLowerCase() || '';
                        valueB = Object.values(b.attributes.title)[0]?.toLowerCase() || '';
                        break;
                    case 'createdAt':
                        valueA = new Date(a.attributes.createdAt).getTime();
                        valueB = new Date(b.attributes.createdAt).getTime();
                        break;
                    default:
                        return 0;
                }

                if (direction === 'desc') {
                    [valueA, valueB] = [valueB, valueA];
                }

                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            });
        });

        const paginatedManga = sortedManga.slice(numOffset, numOffset + numLimit);

        return {
            result: "ok",
            response: "collection",
            data: paginatedManga,
            limit: numLimit,
            offset: numOffset,
            total: sortedManga.length
        };
    }

    async function getAllManga() {
        const transaction = db.transaction(MANGA_STORE, 'readonly');
        const store = transaction.objectStore(MANGA_STORE);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    function parseSearchParams(url) {
        const urlParams = new URL(url).searchParams;
        return {
            includedTags: urlParams.getAll('includedTags[]'),
            excludedTags: urlParams.getAll('excludedTags[]'),
            includedTagsMode: urlParams.get('includedTagsMode') || 'AND',
            excludedTagsMode: urlParams.get('excludedTagsMode') || 'OR',
            originLang: urlParams.getAll('originalLanguage[]'),
            onlyAvailableChapters: urlParams.get('onlyAvailableChapters') === 'true',
            author: urlParams.getAll('authors[]'),
            statuses: urlParams.getAll('status[]'),
            content: urlParams.getAll('contentRating[]'),
            demos: urlParams.getAll('publicationDemographic[]'),
            artist: urlParams.getAll('artists[]'),
            year: urlParams.get('year'),
            translatedLang: urlParams.getAll('availableTranslatedLanguage[]'),
            limit: urlParams.get('limit') || 32,
            offset: urlParams.get('offset') || 0,
            title: urlParams.get('title') || '',
            order: Object.fromEntries(
                Array.from(urlParams.entries())
                    .filter(([key]) => key.startsWith('order['))
                    .map(([key, value]) => [key.match(/\[(.*?)\]/)[1], value])
            )
        };
    }
})();