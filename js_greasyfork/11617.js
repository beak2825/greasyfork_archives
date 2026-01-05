// ==UserScript==
// @name           IMDb - List Helper
// @description    Makes creating IMDb lists more efficient and convenient
// @namespace      imdb
// @author         themagician, monk-time
// @include        http://*imdb.com/list/*/edit
// @include        http://*imdb.com/list/*/edit?*
// @include        https://*imdb.com/list/*/edit
// @include        https://*imdb.com/list/*/edit?*
// @require        https://cdnjs.cloudflare.com/ajax/libs/d3-dsv/1.0.8/d3-dsv.min.js
// @icon           http://www.imdb.com/favicon.ico
// @version        3.1.1
// @downloadURL https://update.greasyfork.org/scripts/11617/IMDb%20-%20List%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/11617/IMDb%20-%20List%20Helper.meta.js
// ==/UserScript==

//
// CHANGELOG
//
// 3.1.1
// fixed: https caused the script not to load
//
// 3.1
// fixed: 'Skip/retry' buttons failed to keep search results visible
// changed: The script searches for both IDs or titles by default again
// added: A more granular control for what is used for search
//
// 3.0.1
// fixed: New IMDb search results layout
// changed: Search only for regex matches by default
// added: A checkbox to toggle search mode (matches only vs. matches or full string)
//
// 3.0
// fixed: Search by movie title
// fixed: No longer requires jQuery; jquery-csv is replaced with d3-dsv
// fixed: Remove delay before auto-clicking on a search result
// changed: Criticker score conversion: 0..10 -> 1, 11..20 -> 2, 91..100 -> 10
// changed: Criticker importer requires .csv
// changed: If the regex fails, try searching for the whole string
//
// 2.4.1
// fixed: In some instances the script wasn't loaded (bad @include)
// changed: Limit number of setTimeOut calls
//
// 2.4.0
// fixed: IMDb changed layout
//
// 2.3.0
// fixed: importing ratings works again
//
// 2.2.0
// added: support for people
//
// 2.1.1
// added: only show import form if ratings is selected
//
// 2.1
// added: importers for imdb, rateyourmusic, criticker
//
// 2.0
// added: import ratings
// added: if regex doesn't match, skip entry
//
// 1.6.1.2
// added: input text suggestion as a placeholder
//
// 1.6.1.1
// fixed: some entries are skipped when adding imdb ids/urls
//

/* global d3 */

'use strict';

// milliseconds between each request
const REQUEST_DELAY = 1000;

// ----- DOM ELEMENTS: STYLING, CREATION AND TRACKING -----

document.head.insertAdjacentHTML('beforeend', `<style>
    #ilh-ui {
        margin: 0 5% 5% 5%;
        padding: 10px;
        border: 1px solid #e8e8e8;
    }

    #ilh-ui div {
        margin: 0.5em 0 0.75em
    }

    #ilh-ui label {
        font-weight: normal;
        margin-right: 6px;
    }

    #ilh-ui span,
    #ilh-ui label:first-child {
        font-weight: bold;
    }

    #ilh-ui textarea {
        width: 100%;
        background-color: lightyellow;
        overflow: auto;
    }

    #ilh-ui .ilh-block {
        display: flex;
    }

    #ilh-ui .ilh-block input[type=text] {
        font-family: monospace;
        flex-grow: 1;
    }
</style>`);

const searchModeHints = {
    auto:   'Input titles, IMDb URLs or IDs here and click Start. ' +
            'If a line has an IMDb ID, it\'ll be auto-added to the list. ' +
            'Otherwise the whole line will be searched for, ' +
            'and you\'ll have to select the correct title manually.',
    imdbid: 'Input text containing IMDb IDs here and click Start. ' +
            'IMDb IDs are extracted from lines (only one per line) and ' +
            'auto-added to the list, skipping the rest.',
    line:   'Input titles or IMDb IDs here and click Start. ' +
            'Whole lines are used for search, nothing is skipped.',
    regexp: 'Input text here and click Start. Only captured groups of regex matches ' +
            'are used for search.',
    rating: 'Use the controls below to load data from a file or input text here and click Start. ' +
            'Your rating and IMDb ID/title is extracted from each line with regex.',
};

const uiHTML = `
    <div id="ilh-ui">
        <div class="ilh-block">
            <label>Import mode:</label>
            <input type="radio" id="ilh-mode-list" name="mode" value="list" checked>
            <label for="ilh-mode-list">List</label>
            <input type="radio" id="ilh-mode-ratings" name="mode" value="ratings">
            <label for="ilh-mode-ratings">Ratings</label>
        </div>
        <textarea id="ilh-film-list" rows="7" placeholder="${searchModeHints.auto}"></textarea>
        <div>
            <input type="button" value="Start" id="ilh-start">
            <input type="button" value="Skip"  id="ilh-skip">
            <input type="button" value="Retry" id="ilh-retry">
            <span>Remaining: <span id="ilh-films-remaining">0</span></span>
        </div>
        <div class="ilh-block">
            <label for="ilh-current-film">Current:</label>
            <input type="text" id="ilh-current-film">
        </div>
        <div class="ilh-block" id="ilh-regexp-box" style="display: none">
            <label for="ilh-regexp">Regexp:</label>
            <input type="text" id="ilh-regexp">
        </div>
        <div id="ilh-search-mode-box">
            <label for="ilh-search-mode">Search mode:</label>
            <select name="searchmode" id="ilh-search-mode">
                <option value="auto" selected>Auto</option>
                <option value="imdbid">IMDb IDs</option>
                <option value="line">Line</option>
                <option value="regexp">Regexp</option>
            </select>
        </div>
        <div id="ilh-import" style="display: none">
            <label for="ilh-import-sel">Import .csv from:</label>
            <select name="import" id="ilh-import-sel">
                <option value="" selected disabled hidden>Select</option>
                <option value="imdb">IMDb</option>
                <option value="rym">RateYourMusic</option>
                <option value="criticker">Criticker</option>
            </select>
            <span>File:</span>
            <input type="file" id="ilh-file-import" disabled>
        </div>
    </div>`;

document.querySelector('div.lister-search').insertAdjacentHTML('afterend', uiHTML);

const innerIDs = [
    'mode-list',
    'mode-ratings',
    'film-list',
    'start',
    'skip',
    'retry',
    'films-remaining',
    'current-film',
    'search-mode-box',
    'search-mode',
    'regexp-box',
    'regexp',
    'import',
    'import-sel',
    'file-import',
];

const camelCase = s => s.replace(/-[a-z]/g, m => m[1].toUpperCase());

// Main object for interacting with the script's UI; keys match element ids
const ui = Object.assign(...innerIDs.map(id => ({
    [camelCase(id)]: document.getElementById(`ilh-${id}`),
})));

ui.freezables = [ui.modeList, ui.modeRatings, ui.filmList, ui.start, ui.regexp, ui.searchMode];
const elIMDbSearch = document.getElementById('add-to-list-search');
const elIMDbResults = document.getElementById('add-to-list-search-results');

// ----- HANDLERS AND ACTIONS -----

const convertRating = n => Math.ceil(n / 10) || 1; // 0..100 -> 1..10
// d3 skips a row if a row conversion function returns null
const joinOrSkip = (...fields) => (fields.includes(undefined) ? null : fields.join(','));
const rowConverters = {
    imdb: row => joinOrSkip(row['Your Rating'], row.Const),
    rym: row => joinOrSkip(row.Rating, row.Title),
    // .csv exported from Criticker have spaces between column names
    criticker: row => joinOrSkip(convertRating(+row.Score), row[' IMDB ID']),
};

const prepareImport = e => {
    const isLegalParser = Boolean(rowConverters[e.target.value]); // in case of html-js mismatch
    ui.fileImport.disabled = !isLegalParser;
};

const handleImport = e => {
    const format = ui.importSel.value;
    const reader = new FileReader();
    reader.onload = event => {
        const fileStr = event.target.result;
        ui.filmList.value = d3.csvParse(fileStr, rowConverters[format]).join('\n');
    };

    const [file] = e.target.files;
    reader.readAsText(file);
};

const RatingManager = {
    rating: 0,
    regex: /^([1-9]|10),(.*)$/i,
    match: (line, mode, regex) => regex.exec(line),
    processMatch: ([, rating, filmTitle], callback) => {
        RatingManager.rating = rating;
        callback(filmTitle);
    },
    afterClick: async (imdbID, callback) => {
        console.log(`RatingManager::afterClick: Rating ${imdbID}`);
        const moviePage = await fetch(
            `http://www.imdb.com/title/${imdbID}/`,
            { credentials: 'same-origin' },
        );
        const authHash = new DOMParser()
            .parseFromString(await moviePage.text(), 'text/html')
            .getElementById('star-rating-widget')
            .dataset.auth;

        const params = {
            tconst: imdbID,
            rating: RatingManager.rating,
            auth: authHash,
            tracking_tag: 'list',
        };

        const postResp = await fetch('http://www.imdb.com/ratings/_ajax/title', {
            method: 'POST',
            body: new URLSearchParams(params),
            credentials: 'same-origin',
        });

        if (postResp.ok) {
            callback();
        } else {
            alert(`Rating failed. Status code ${postResp.status}`);
        }
    },
};

const ListManager = {
    regex: /((?:tt|nm)\d+)/i, // IMDb IDs
    match: (line, mode, regex) => ({
        /* eslint-disable no-sparse-arrays */
        // 'auto' - search for an id (if a string has one) or for a full non-empty string
        auto:   s => ListManager.regex.exec(s) || s && [, s],
        imdbid: s => ListManager.regex.exec(s),
        line:   s => s && [, s],
        regexp: s => regex.exec(s),
        /* eslint-enable no-sparse-arrays */
    })[mode](line),
    processMatch: ([, filmTitle], callback) => callback(filmTitle),
    afterClick: (imdbID, callback) => callback(),
};

const App = {
    manager: ListManager,
    films: [],
    regexObj: null,
    run: () => {
        // Set the default value for the 'Regexp' mode
        ui.regexp.value = App.manager.regex.source;

        ui.importSel.addEventListener('change', prepareImport);
        ui.fileImport.addEventListener('change', handleImport);

        ui.searchMode.addEventListener('change', () => {
            ui.regexpBox.style.display = ui.searchMode.value === 'regexp' ? '' : 'none';
            ui.filmList.placeholder = searchModeHints[ui.searchMode.value];
        });

        ui.modeList.addEventListener('change', () => {
            App.manager = ListManager;
            ui.import.style.display = 'none';
            ui.regexp.value = App.manager.regex.source;
            ui.regexpBox.style.display = ui.searchMode.value === 'regexp' ? '' : 'none';
            ui.searchModeBox.style.display = '';
            ui.filmList.placeholder = searchModeHints[ui.searchMode.value];
        });

        ui.modeRatings.addEventListener('change', () => {
            App.manager = RatingManager;
            ui.import.style.display = '';
            ui.regexp.value = App.manager.regex.source;
            ui.regexpBox.style.display = '';
            ui.searchModeBox.style.display = 'none';
            ui.filmList.placeholder = searchModeHints.rating;
        });

        ui.start.addEventListener('click', () => {
            // This will be used only for ListManager's 'regexp' mode or RatingManager
            App.regexObj = new RegExp(ui.regexp.value, 'i');

            // Disable relevant UI elements
            ui.freezables.forEach(el => {
                el.disabled = true;
            });

            App.films = ui.filmList.value.trim().split('\n');
            App.handleNext();
        });

        // When the search popup loses focus, IMDb will hide it after 300 ms,
        // so all button clicks that want to keep it visible need to be delayed
        ui.skip.addEventListener('click', () =>
            setTimeout(() => App.handleNext(), 350));

        ui.retry.addEventListener('click', () =>
            setTimeout(() => elIMDbSearch.dispatchEvent(new Event('keydown')), 350));
    },
    handleNext: () => {
        if (App.films.length) {
            App.search(App.films.shift());
        } else { // if last film
            App.reset();
        }
    },
    reset: () => {
        App.films = [];
        App.regexObj = null;

        ui.freezables.forEach(el => {
            el.disabled = false;
        });

        ui.currentFilm.value = '';
        elIMDbSearch.value = '';
    },
    search: line => {
        line = line.trim();
        ui.currentFilm.value = line;
        ui.filmsRemaining.textContent = App.films.length;
        ui.filmList.value = App.films.join('\n');

        const result = App.manager.match(line, ui.searchMode.value, App.regexObj);
        if (result) {
            App.manager.processMatch(result, filmTitle => {
                // Set imdb search input field to film title and trigger search
                elIMDbSearch.value = filmTitle;
                elIMDbSearch.dispatchEvent(new Event('keydown'));
            });
        } else {
            App.handleNext();
        }
    },
};

// Handle clicks on search results by a user or the script
elIMDbResults.addEventListener('click', e => {
    const imdbID = e.target.closest('a').dataset.const;
    if (!imdbID || !imdbID.startsWith('tt')) return;
    App.manager.afterClick(imdbID, () => {
        setTimeout(() => App.handleNext(), REQUEST_DELAY);
    });
});

// Monitor for changes to the search result box.
// If the search was for IMDb URL/ID, the only result is clicked automatically
const mut = new MutationObserver(mutList => mutList.forEach(({ addedNodes }) => {
    if (!addedNodes.length || !/(nm|tt)\d{7}/i.test(ui.currentFilm.value)) return;
    addedNodes[0].click();
}));
mut.observe(elIMDbResults, { childList: true });

App.run();
