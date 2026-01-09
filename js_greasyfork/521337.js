// ==UserScript==
// @name          Natively Recap
// @namespace     https://learnnatively.com
// @description   Generate a list of everything you watched or read on Natively this year
// @author        araigoshi
// @version       1.0.10
// @match         https://learnnatively.com/*
// @license       MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/521337/Natively%20Recap.user.js
// @updateURL https://update.greasyfork.org/scripts/521337/Natively%20Recap.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const CSS_TEXT = `
    .recap-hide-ui {
        #main-nav {
            display: none;
        }
        .body-footer {
            display: none;
        }
        
        .content-wrapper {
            padding-top: 0;
        }
    }
    #recap-takeover {
        display: grid;
        grid-template-columns: auto;
        justify-content: center;
        justify-items: center;
        padding: 1em;

        header div {
            display: flex;
            gap: 2em;
            align-items: center;
            margin: 5px 0;

            h2 {
                font-size: var(24px);
            }

            p {
                margin-bottom: 0;
            }

            input[type=number] {
                width: 3em;
            }
        }

        .recap-body {
            padding-top: 1em;
            display: grid;
            width: fit-content;
            grid-template-columns: repeat(10, 150px);
            justify-content: center;
            grid-gap: 0.5em;
        }

        .hide-title figure .title {
            display: none;
        }
        
        .hide-series figure .series-progress {
            display: none;
        }

        .hide-level figure .level {
            display: none;
        }
        
        .hide-dates figure .dates {
            display: none;
        }

        figure .level {
            cursor: default;
        }

        figure {
            margin: 0;
            text-align: center;
            padding: 0.3em;
        }

        figure img {
            height: 200px;
            aspect-ratio: keep;
        }

        span.series-progress {
            font-size: 10px;
            white-space: pre;
        }

        p.dates {
            font-size: 10px;
            margin-bottom: 0;
        }
    }
    #recap-dialog {
        padding: 1em;
        header {
            display: flex;
            align-items: center;
            margin-bottom: 1em;

            h2 {
                flex-grow: 1;
            }
        }
        #recap-settings-body {
            width: 900px;
            display: grid;
            grid-template-columns: 1fr 1fr auto;
            gap: 0.5em;

            .full-width {
                grid-column: 1/4;
            }

            h6.action {
                text-align: center;
            }

            .show-settings {
                display: flex;
                gap: 2em;
            }

            h4.full-width:not(:first-child) {
                margin-top: 1em;
            }
        }
    }
    `;

    const RECAP_DIALOG_ID = 'recap-dialog';

    const NATIVELY_LEVEL_RANGES = {
        'n5': { min: 0, max: 12 },
        'n4': { min: 13, max: 19 },
        'n3': { min: 20, max: 26 },
        'n2': { min: 27, max: 33 },
        'n1': { min: 34, max: 40 },
        'n1_plus': { min: 41, max: 999 },
    }

    const DEFAULT_COLORS = {
        'recap-background': 'rgba(255, 255, 255, 0)',
        'recap-text': '#161314',
        'manga': '#f7eafa',
        'manhwa': '#f7eafa',
        'comic': '#f7eafa',
        'novel': '#d9c1de',
        'light_novel': '#d9c1de',
        'childrens_book': '#d9c1de',
        'graded_reader': '#d9c1de',
        'textbook': '#d9c1de',
        'nonfiction': '#d9c1de',
        'movie': '#c7dec1',
        'tv_season': '#bce3b2',
        'other': '#d9d9d9',
    }

    const COLOR_NAME_LOOKUPS = {
        'recap-background': 'Recap Background',
        'recap-text': 'Text',
        'manga': 'Manga',
        'manhwa': 'Manhwa',
        'comic': 'Comic',
        'novel': 'Novel',
        'light_novel': 'Light Novel',
        'childrens_book': 'Children\'s Book',
        'graded_reader': 'Graded Reader',
        'textbook': 'Textbook',
        'nonfiction': 'Non-fiction',
        'movie': 'Movie',
        'tv_season': 'TV Season',
        'other': 'Other',
    };

    let state = {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        finishedFilter: {},
        settings: {
            columns: 10,
            nameReplacements: new Map(),
            colorOverrides: new Map(),
            defaultStartDate: "2024-01-01",
            defaultEndDate: "2024-12-31",
            show: {
                dates: true,
                title: true,
                seriesPos: true,
                level: false,
            }
        }
    };


    function saveSettings() {
        window.localStorage.setItem("araigoshi-recap-settings", JSON.stringify({
            columns: state.settings.columns,
            show: state.settings.show,
            nameReplacements: Object.fromEntries(state.settings.nameReplacements.entries()),
            colorOverrides: Object.fromEntries(state.settings.colorOverrides.entries()),
            defaultStartDate: state.startDate.toISOString(),
            defaultEndDate: state.endDate.toISOString(),
        }))
    }

    function loadSettings() {
        const savedSettingsStr = window.localStorage.getItem("araigoshi-recap-settings");
        if (savedSettingsStr === null) {
            return;
        }
        const savedSettings = JSON.parse(savedSettingsStr);
        if (savedSettings?.columns) {
            state.settings.columns = savedSettings.columns;
        }
        if (savedSettings?.nameReplacements) {
            state.settings.nameReplacements = new Map(Object.entries(savedSettings.nameReplacements));
        }
        if (savedSettings?.colorOverrides) {
            state.settings.colorOverrides = new Map(Object.entries(savedSettings.colorOverrides));
        }

        if (savedSettings?.show) {
            state.settings.show = {
                ...state.settings.show,
                ...savedSettings.show,
            };
        }

        if (savedSettings?.defaultStartDate) {
            state.startDate = new Date(savedSettings.defaultStartDate);
        }

        if (savedSettings?.defaultEndDate) {
            state.endDate = new Date(savedSettings.defaultEndDate);
        }
    }

    function loadStylesheet() {
        console.log('Loading recap stylesheet');
        if (document.getElementById('recap-styles') === null) {
            let styleSheet = document.createElement('style');
            styleSheet.id = 'recap-styles';
            styleSheet.textContent = CSS_TEXT;
            document.head.appendChild(styleSheet);
        }
        if (document.getElementById('recap-style-overrides') === null) {
            let overrideStyleSheet = document.createElement('style');
            overrideStyleSheet.id = 'recap-style-overrides';
            document.head.appendChild(overrideStyleSheet);
        }
    }

    function createDialog() {
        const el = document.createElement('dialog');
        el.id = RECAP_DIALOG_ID;
        document.body.appendChild(el);
        state.recapDialog = el;
    }

    function buildRequest(libraryType, page, finishedFilterId) {
        return {
            "page": page,
            "numOfPages": 1,
            "totalCount": 0,
            "itemType": "",
            "genre": "",
            "q": "",
            "bookProviders": "",
            "watchProviders": "",
            "location": "",
            "minLevel": "",
            "maxLevel": "",
            "levelFilter": "",
            "bookType": "",
            "tagFilters": "",
            "loading": false,
            "onlyFree": false,
            "excludeTemporaryRatings": false,
            "excludeLibrary": false,
            "wanikani": false,
            "mobileFilter": false,
            "tags": "",
            "includeSpoilers": false,
            "includeMinorElements": false,
            "includeMajorElementsOnly": false,
            "itemTypes": [],
            "genreOptions": [],
            "openSeries": [],
            "error": "",
            "libraryType": libraryType,
            "sort": "-recent",
            "subs": "",
            "favorite": false,
            "resultActive": null,
            "listFilter": finishedFilterId,
            "lists": [],
            "customTags": "",
            "collapseSeries": false,
            "pageSize": 50,
            "needsBackendSearch": false
        };
    }

    function isItemInRange(startDate, endDate) {
        return function (item) {
            const itemFinishedUnixDate = item.dateFinishedData?.timestampSeconds;
            if (!itemFinishedUnixDate) {
                return false;
            }

            const itemFinishedDate = new Date(itemFinishedUnixDate * 1000);
            const nextDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1);

            return startDate <= itemFinishedDate && itemFinishedDate < nextDay;
        }
    }

    function jsToIsoDate(jsDate) {
        return jsDate.toISOString().substring(0, 10);
    }

    function transformItemDate(item, key) {
        if (!item[key]) {
            return 'Unknown';
        }
        const unixDate = item[key].timestampSeconds;
        const jsDate = new Date(unixDate * 1000);
        return jsToIsoDate(jsDate);
    }

    function calculateRatingGroup(rating) {
        for (const [key, def] of Object.entries(NATIVELY_LEVEL_RANGES)) {
            if (def.min <= rating && rating <= def.max) {
                return key;
            }
        }
        return '';
    }

    function generateItemSummary(item, seriesCache) {
        let adjustedName = item.item.title;
        for (const [src, replacement] of state.settings.nameReplacements.entries()) {
            adjustedName = adjustedName.replace(src, replacement);
        }
        const simpleType = item.item.mediaType.replace(' ', '_').toLowerCase();
        return {
            'image': item.item.image?.url,
            'url': item.item.url,
            'level': 'L' + (item.ratingLevel ? '' + item.ratingLevel : '?') + (item.item.rating?.temporary ? '?' : ''),
            'levelGroup': calculateRatingGroup(item.ratingLevel),
            'seriesPos': item.item.seriesOrder || 1,
            'seriesLength': item.item.seriesId ? (seriesCache[item.item.seriesId]?.numOfItems || 0) : 1,
            'name': adjustedName,
            'started': transformItemDate(item, 'dateStartedData'),
            'finished': transformItemDate(item, 'dateFinishedData'),
            'finishedUnix': item.dateFinishedData?.timestampSeconds || 0,
            'type': simpleType,
        }
    }

    function itemElement(parsedItem) {
        const figure = document.createElement('figure');
        figure.classList.add(`item-${parsedItem['type']}`)
        figure.innerHTML = `
        <a href="${parsedItem['url']}"><img src="${parsedItem['image']}" /></a>
        <figcaption>
            <span class="level ${parsedItem['levelGroup']}">${parsedItem['level']}</span>
            <a class="title" href="${parsedItem['url']}">${parsedItem['name']}</a>
            <span class="series-progress">(${parsedItem['seriesPos']} / ${parsedItem['seriesLength']})</span>
            <p class="dates"><span class="started">${parsedItem['started']}</span> - <span class="ended">${parsedItem['finished']}</span></p>
        </figcaption>
        `;
        return figure;
    }

    async function findFinishedFilter(libraryType) {
        if (state.finishedFilter[libraryType]) {
            return state.finishedFilter[libraryType];
        }

        const listsResult = await fetch(`/item-list-api?user=${state.user}&library_type=${libraryType}`);
        const resultBody = await listsResult.json();
        const listFilter = resultBody.find(listFilter => listFilter.correlatedStatus === 'finished');
        if (listFilter) {
            state.finishedFilter[libraryType] = listFilter.id;
            return listFilter.id;
        } else {
            state.finishedFilter[libraryType] = '';
            return '';
        }
    }

    function generateItemList(nativelyData) {
        const dateFilter = isItemInRange(state.startDate, state.endDate);
        const items = nativelyData.results
            .filter(item => item.item != null)
            .filter(dateFilter);
        return items.map(item => generateItemSummary(item, nativelyData.seriesCache));
    }

    function setDialogToLoadingText(text) {
        state.recapDialog.innerHTML = `
            <h2>Loading Natively Recap</h2>
            <p>${text}</p>
        `
    }

    function addSettingsReplacementRow(recapBody, addReplButton, src, dest) {
        const srcInput = document.createElement('input');
        srcInput.type = 'text';
        srcInput.value = src;
        srcInput.classList.add('recap-replacement-src');
        recapBody.insertBefore(srcInput, addReplButton);

        const destInput = document.createElement('input');
        destInput.type = 'text';
        destInput.value = dest;
        destInput.classList.add('recap-replacement-dest');
        recapBody.insertBefore(destInput, addReplButton);

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', (evt) => {
            recapBody.removeChild(srcInput);
            recapBody.removeChild(destInput);
            recapBody.removeChild(deleteButton);
            evt.stopPropagation();
        });
        recapBody.insertBefore(deleteButton, addReplButton);
    }

    function addColourConfigRow(recapBody, key, currentValue) {
        const label = document.createElement('p');
        label.textContent = COLOR_NAME_LOOKUPS[key];
        recapBody.appendChild(label);

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.dataset.colorKey = key;
        textInput.value = currentValue;
        textInput.classList.add('color-text-code');
        recapBody.appendChild(textInput);

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = currentValue;
        colorInput.addEventListener('change', (evt) => {
            textInput.value = evt.target.value;
        });
        recapBody.appendChild(colorInput);
    }

    function showSettingsDialog() {
        const initialTitleShowState = state.settings.show.title ? 'checked' : ''
        const initialSeriesShowState = state.settings.show.seriesPos ? 'checked' : ''
        const initialDatesShowState = state.settings.show.dates ? 'checked' : ''
        const initialLevelShowState = state.settings.show.level ? 'checked' : ''
        state.recapDialog.innerHTML = `
            <header>
                <h2>Recap Settings</h2>
                <button type="button" id="recap-dialog-close-button">X</button>
            </header>
            <main id="recap-settings-body">
                <h4 class="full-width">Show/Hide Info</h4>
                <div class="full-width show-settings">
                    <div><input type="checkbox" id="recap-show-title" name="recap-show-title" ${initialTitleShowState}> <label for="recap-show-title">Title</label></div>
                    <div><input type="checkbox" id="recap-show-series" name="recap-show-series" ${initialSeriesShowState}> <label for="recap-show-series">Series Position</label></div>
                    <div><input type="checkbox" id="recap-show-dates" name="recap-show-dates" ${initialDatesShowState}> <label for="recap-show-dates">Dates</label></div>
                    <div><input type="checkbox" id="recap-show-level" name="recap-show-level" ${initialLevelShowState}> <label for="recap-show-level">Level</label></div>
                </div>
                <h4 class="full-width">Name Replacements</h4>
                <p class="full-width">
                    Do some of your shows/books have long/ugly names? Make them shorter
                </p>
                <h6>Text to change</h6><h6>Replacement text</h6><h6 class="material-icons-outlined action">delete</h6>
                <div class="full-width" id="recap-add-more-replacements">
                    <button type="button" id="add-more-button">+ Add more</button>
                </div>
                <h4 class="full-width">Custom Colors</h4>
                <h6>Type</h6><h6>Colour</h6><h6 class="action">Prv</h6>
            </main>
        `;
        const recapBody = state.recapDialog.querySelector('#recap-settings-body');
        const addReplButton = state.recapDialog.querySelector('#recap-add-more-replacements');
        const nameReplacements = state.settings.nameReplacements.size > 0 ? [...state.settings.nameReplacements] : [["", ""]];
        for (const [src, dest] of nameReplacements) {
            addSettingsReplacementRow(recapBody, addReplButton, src, dest);
        }
        state.recapDialog.querySelector('#add-more-button').addEventListener('click', () => {
            addSettingsReplacementRow(recapBody, addReplButton, "", "");
        });
        const resolvedColors = resolveCurrentColors();
        for (const [key, color] of resolvedColors.entries()) {
            addColourConfigRow(recapBody, key, color);
        }
        state.recapDialog.querySelector('#recap-dialog-close-button').addEventListener('click', () => {
            const replacementSrcs = [...recapBody.querySelectorAll('.recap-replacement-src').values()].map(x => x.value);
            const replacementValues = [...recapBody.querySelectorAll('.recap-replacement-dest').values()].map(x => x.value);

            let newNameReplacements = new Map();
            for (let i = 0; i < replacementSrcs.length; i++) {
                let src = replacementSrcs[i];
                let value = replacementValues[i] || "";

                if (src !== "") {
                    newNameReplacements.set(src, value);
                }
            }
            state.settings.nameReplacements = newNameReplacements;
            let colorOverrides = new Map();
            for (const element of recapBody.querySelectorAll('.color-text-code')) {
                const key = element.dataset.colorKey;
                const value = element.value;
                colorOverrides.set(key, value);
            }
            state.settings.colorOverrides = colorOverrides;
            state.settings.show.title = document.querySelector('#recap-show-title').checked;
            state.settings.show.seriesPos = document.querySelector('#recap-show-series').checked;
            state.settings.show.dates = document.querySelector('#recap-show-dates').checked;
            state.settings.show.level = document.querySelector('#recap-show-level').checked;
            saveSettings();
            updateRecapBody();
            updateStyleOverrides();
            state.recapDialog.close();
        });
        state.recapDialog.showModal();
    }

    async function fetchLibrary(libraryType) {
        setDialogToLoadingText(`Loading filters for ${libraryType}`);
        const filterId = await findFinishedFilter(libraryType);
        let seriesCache = {};
        let results = [];
        let totalPages = 1;
        let currentPage = 0;
        do {
            setDialogToLoadingText(`Loading ${libraryType} page ${currentPage + 1} of ${totalPages}`);
            const csrfToken = document.querySelector('meta[name=csrf-token]').getAttribute('content');
            const response = await fetch(`/api/item-library-search-api/${state.user}/`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify(buildRequest(libraryType, currentPage + 1, filterId)),
            });
            const responseBody = await response.json();
            if (responseBody.numOfPages) {
                totalPages = responseBody.numOfPages;
            }
            currentPage++;
            for (const result of responseBody.results) {
                if (result.item) {
                    results.push(result);
                } else if (result.itemList) {
                    for (const listItem of result.results) {
                        results.push(listItem.data);
                    }
                }
            }
            if (responseBody.seriesCache) {
                seriesCache = { ...seriesCache, ...responseBody.seriesCache };
            }
        } while (currentPage < totalPages);
        return {
            seriesCache,
            results,
        };
    }

    async function loadData() {
        setDialogToLoadingText('Building your recap');
        state.recapDialog.showModal();
        if (!state.rawBookData) {
            console.log('Loading data');
            state.rawBookData = await fetchLibrary('books');
        }
        if (!state.rawVideoData) {
            state.rawVideoData = await fetchLibrary('videos');
        }
        const bookList = generateItemList(state.rawBookData);
        const videoList = generateItemList(state.rawVideoData);
        const parsedData = [...bookList, ...videoList];
        parsedData.sort((a, b) => a.finishedUnix - b.finishedUnix);
        state.recapDialog.close();
        console.log('Loaded item data');
        console.log(parsedData);
        return parsedData;
    }

    async function updateRecapBody() {
        const data = await loadData();
        let recapBodies = document.querySelectorAll('.recap-body');
        for (const recapBody of recapBodies) {
            recapBody.innerHTML = '';
            for (const item of data) {
                recapBody.appendChild(itemElement(item));
            }
        }
    }

    function addLink() {
        const navbar = document.querySelector('.navbar-nav');
        const lastLink = document.querySelector('.last-link');

        const recapLink = document.createElement('a');
        recapLink.textContent = 'Recap';
        recapLink.classList.add('nav-link');
        recapLink.href = '#recap';
        recapLink.addEventListener('click', showRecap);
        navbar.insertBefore(recapLink, lastLink);
    }

    function resolveCurrentColors() {
        const resolvedColors = new Map();
        for (const [k, v] of Object.entries(DEFAULT_COLORS)) {
            resolvedColors.set(k, v);
        }
        for (const [k, v] of state.settings.colorOverrides.entries()) {
            resolvedColors.set(k, v);
        }

        return resolvedColors;
    }

    function updateStyleOverrides() {
        const resolvedColors = resolveCurrentColors();
        const itemStyles = resolvedColors.entries().map(([key, value]) => `
            .item-${key} {
                background: ${value};
            }
        `).reduce((a, b) => a + '\n' + b);

        const textColor = resolvedColors.get('recap-text');
        const bgColor = resolvedColors.get('recap-background');
        const styles = `
        #recap-takeover {
            .recap-body {
                padding: 1em;
                grid-template-columns: repeat(${state.settings.columns}, 150px);
                color: ${textColor};
                background-color: ${bgColor};
            }
            .recap-body a {
                color: ${textColor};
            }
            ${itemStyles}
        }
        `;
        document.querySelector('#recap-style-overrides').innerHTML = styles;
        if (document.querySelector('.recap-body')) {
            document.querySelector('.recap-body').classList.toggle('hide-title', !state.settings.show.title);
            document.querySelector('.recap-body').classList.toggle('hide-series', !state.settings.show.seriesPos);
            document.querySelector('.recap-body').classList.toggle('hide-dates', !state.settings.show.dates);
            document.querySelector('.recap-body').classList.toggle('hide-level', !state.settings.show.level);
        }
    }

    function createRecapElement(elementType, id) {
        const recapEl = document.createElement(elementType);
        recapEl.id = id;
        recapEl.innerHTML = `
            <header>
                <div>
                    <h3>${state.user}'s Natively Recap</h3>
                    <button class="hide-natively-ui">Toggle Natively UI</button>
                </div>
                <div>
                    <p>Date range</p>
                    <input type="date" id="recap-start-date" value="${jsToIsoDate(state.startDate)}" min="2000-01-01" max="2029-12-31" />
                    <input type="date" id="recap-end-date" value="${jsToIsoDate(state.endDate)}" min="2000-01-01" max="2029-12-31" />
                    <p>Columns</p>
                    <input type="number" id="recap-columns" value="${state.settings.columns}" />
                    <a class="material-icons-outlined" id="recap-settings-link" href="#">settings</a>
                </div>
            </header>

            <main class="recap-body">
            </main>
        `;
        recapEl.querySelector('.hide-natively-ui').addEventListener('click', (evt) => {
            document.body.classList.toggle('recap-hide-ui');
        });
        recapEl.querySelector('#recap-start-date').addEventListener('change', (evt) => {
            state.startDate = new Date(evt.target.valueAsNumber);
            updateRecapBody();
            saveSettings();
            evt.preventDefault();
        });
        recapEl.querySelector('#recap-end-date').addEventListener('change', (evt) => {
            state.endDate = new Date(evt.target.valueAsNumber);
            updateRecapBody();
            saveSettings();
        });
        recapEl.querySelector('#recap-columns').addEventListener('change', (evt) => {
            state.settings.columns = evt.target.value;
            saveSettings();
            updateStyleOverrides();
        });
        recapEl.querySelector('#recap-settings-link').addEventListener('click', (evt) => {
            showSettingsDialog();
            evt.stopPropagation();
        });
        recapEl.querySelector('.recap-body').classList.toggle('hide-title', !state.settings.show.title);
        recapEl.querySelector('.recap-body').classList.toggle('hide-series', !state.settings.show.seriesPos);
        recapEl.querySelector('.recap-body').classList.toggle('hide-dates', !state.settings.show.dates);
        recapEl.querySelector('.recap-body').classList.toggle('hide-level', !state.settings.show.level);
        document.body.appendChild(recapEl);
        return recapEl;
    }

    function findCurrentUser() {
        const hashParams = document.location.hash.split('?')[1]?.split('&') || [];
        let hashParamsLookup = {};
        for (const hashParam of hashParams) {
            let parts = hashParam.split('=');
            let key = parts[0];
            let value = parts[1] || "";
            hashParamsLookup[key] = value;
        }
        state.user = hashParamsLookup["recap-user"] || window.gs.initialState.user.username;
    }

    function showRecap() {
        const recapEl = createRecapElement('div', 'recap-takeover');
        document.querySelector('.content-wrapper').replaceChildren(recapEl);
        updateRecapBody();
    }

    function init() {
        createDialog();
        loadStylesheet();
        findCurrentUser();
        addLink();
        loadSettings();
        updateStyleOverrides();
        window.RECAP_STATE = state;
        if (window.location.hash.startsWith('#recap')) {
            showRecap();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
