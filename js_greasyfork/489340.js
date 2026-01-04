// ==UserScript==
// @name         WK Custom SRS
// @namespace    leohumnew.wk
// @version      0.7.7
// @description  Add custom word packs to WaniKani!
// @author       leohumnew
// @match        https://www.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://greasyfork.org/scripts/489759-wk-custom-icons/code/CustomIcons.js?version=1417568
// @downloadURL https://update.greasyfork.org/scripts/489340/WK%20Custom%20SRS.user.js
// @updateURL https://update.greasyfork.org/scripts/489340/WK%20Custom%20SRS.meta.js
// ==/UserScript==

(async() => {
/*
24		D:\USERS\LIBRARIES\DOCUMENTS\GITHUB\WANIKANI-CUSTOM-SRS\CUSTOM_ELEMENTS.JS
2023		D:\USERS\LIBRARIES\DOCUMENTS\GITHUB\WANIKANI-CUSTOM-SRS\TYPES.JS
2833		D:\USERS\LIBRARIES\DOCUMENTS\GITHUB\WANIKANI-CUSTOM-SRS\SYNC_MANAGER.JS
3141		D:\USERS\LIBRARIES\DOCUMENTS\GITHUB\WANIKANI-CUSTOM-SRS\MAIN.JS
*/

// ********** D:\USERS\LIBRARIES\DOCUMENTS\GITHUB\WANIKANI-CUSTOM-SRS\CUSTOM_ELEMENTS.JS **********
const srsNames = ["Lesson", "Apprentice 1", "Apprentice 2", "Apprentice 3", "Apprentice 4", "Guru 1", "Guru 2", "Master", "Enlightened", "Burned"];
const time = 106;
let settingsLoaded = false;

if(window.location.pathname.includes("/dashboard") || window.location.pathname === "/") {
    let tempVar = {}; // Temporary variable for multiple things

    // ------------------------ Define and create custom HTML structures ------------------------

    // --------- Main popup ---------
    let overviewPopup = document.createElement("dialog");
    overviewPopup.id = "overview-popup";

    let overviewPopupStyle = document.createElement("style");
    // Styles copied in from styles.css
    overviewPopupStyle.innerHTML = /*css*/ `
    /* General styling */
    .content-box {
        background-color: var(--color-wk-panel-background);
        border-radius: 3px;
        padding: 1rem;
    }

    /* Main popup styling */
    #overview-popup {
        background-color: var(--color-menu, white);
        width: 60%;
        max-width: 50rem;
        height: 70%;
        max-height: 45rem;
        border: none;
        border-radius: 3px;
        box-shadow: 0 0 1rem rgb(0 0 0 / .5);

        &:focus-visible {
            border: none }
        p {
            margin: 0 }
        h2 {
            margin: 0.5rem 0;
            font-size: 1.5rem;
        }
        input, select {
            margin-bottom: 0.5rem;
            padding: 0.25rem;
            border-radius: 3px;
        }
        button {
            cursor: pointer;
            background-color: transparent;
            border: none;

            &[type="submit"], &.outline-button {
                border: 1px solid var(--color-text);
                border-radius: 5px;
                padding: 0.2rem 0.8rem;
            }
        }
        button:hover {
            color: var(--color-tertiary, #a5a5a5);

            &[type="submit"], &.outline-button {
                border-color: var(--color-tertiary, #a5a5a5) }
        }
        > header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid var(--color-tertiary, --color-text);
            margin-bottom: 1rem;

            > h1 {
                font-size: x-large;
                color: var(--color-tertiary, --color-text);
            }
            > button {
                border: none;
                color: var(--color-tertiary, --color-text);
                font-size: x-large;

                &:hover {
                    color: var(--color-text) }
                &:focus-visible {
                    outline: none }
            }
        }
        &::backdrop {
            background-color: rgba(0, 0, 0, 0.5) }
    }

    /* Styling for top tabs */
    #tabs {
        display: flex;
        flex-wrap: wrap;

        > input {
            display: none }
        > label {
            cursor: pointer;
            padding: 0.5rem 1rem;
            max-width: 20%;
        }
        > div {
            display: none;
            padding: 1rem;
            order: 1;
            width: 100%;
        }
        > input:checked + label {
            color: var(--color-tertiary, --color-text);
            border-bottom: 2px solid var(--color-tertiary, gray);
        }
        > input:checked + label + div {
            display: initial }
        .pack {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
    
            span {
                font-style: italic }
            > div {
                margin: auto 0 }
            button {
                margin-left: 10px }
            > div > span, & > div > input {
                margin: 0;
                vertical-align: middle;
            }
        }
    }

    /* Styling for the overview tab */
    #tab-1__content > div {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 1.5rem;
        text-align: center;

        p {
            text-align: left }
        > .content-box > h2:nth-child(2) {
            font-size: 2rem }
        #custom-srs-progress .content-box {
            background-color: var(--color-menu, white);
            margin-bottom: 0.6rem;
            h3 {
                margin-top: 0 }
            .progress-bar {
                display: flex;
                justify-content: start;
                height: 0.5rem;
                border-radius: 0.3rem;
                margin-bottom: 0.6rem;
                background-color: var(--color-wk-panel-background, lightgray);
                div {
                    border-radius: 0.3rem }
                div:nth-child(1) {
                    background-color: var(--color-guru, #2ecc71) }
                div:nth-child(2) {
                    background-color: color-mix(in srgb, var(--color-apprentice, #3daee9) 80%, lightgray);
                }
                div:nth-child(3) {
                    background-color: var(--color-apprentice, #3daee9)
                }
                div:nth-child(4) {
                    background-color: color-mix(in srgb, var(--color-apprentice, #3daee9) 80%, black);
                }
                div:nth-child(5) {
                    background-color: color-mix(in srgb, var(--color-apprentice, #3daee9) 60%, black);
                }
            }
        }
    }

    /* Styling for the pack edit tab */
    #tab-3__content > .content-box {
        margin: 1rem 0;

        input, ul {
            margin-left: 0 }
        > div {
            margin-top: 1.5rem }
        div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        li {
            margin: 0.25rem;
            justify-content: space-between;
            display: flex;

            & button {
                margin-left: 10px }
        }
        li:hover {
            color: var(--color-tertiary, rgb(165, 165, 165));
        }
    }
    #tab-3__content {
        &:has(#pack-select [value="new"]:checked) .content-box :is(div, ul) {
            display: none }
        &:has(#pack-select [value="import"]:checked) .pack-box {
            display: none }
        &:has(#pack-select [value="import"]:checked) .import-box {
            display: grid !important }
        &:has(#pack-lvl-type [value="internal"]:checked) .pack-lvl-specific {
            display: grid !important }
        &:has(#pack-lvl-type [value="wk"]:checked) .wk-lvl-warn {
            display: grid !important }
    }

    #pack-items {
        background-color: var(--color-menu, white) }

    /* Styling for the item edit tab */
    #tab-4__content {
        hr {
            margin: 0;
            border-color: var(--color-wk-panel-background, gray)
        }
        i {
            opacity: 0.5 }
        textarea {
            height: 4rem }
        .ctx-sentence-div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            input {
                margin-right: 0.5rem }
        }
        .item-info-edit-container {
            padding: 1rem;
            border-radius: 3px;
            background-color: var(--color-wk-panel-content-background, white);
            button {
                margin-left: auto }
            label {
                margin-right: 0.5rem }
            input {
                background-color: var(--color-wk-panel-background, white) }
        }
        .component-div {
            display: grid;
            grid-template-columns: 1fr 0.2fr;
        }

        &:has(#item-type [value="Radical"]:checked) .item-radical-specific {
            display: grid !important }
        &:has(#item-type [value="Kanji"]:checked) .item-kanji-specific {
            display: grid !important }
        &:has(#item-type [value="Vocabulary"]:checked) .item-vocab-specific {
            display: grid !important }
        &:has(#item-type [value="KanaVocabulary"]:checked) .item-kanavocab-specific {
            display: grid !important }

        &:has(#component-type [value="internal"]:checked), &:has(#component-type [value="wk"]:checked), &:has(#component-type [value="custom"]:checked) {
            #component-type-container {
                display: none !important }
            #component-id-container {
                display: block !important }
        }
    }
    #tab-4__content .content-box, #tab-4__content .content-box > div, #tab-3__content > .content-box, #tab-3__content > .content-box > div, #tab-5__content .content-box {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: 1fr 1fr;
        align-items: center;

        input, select {
            justify-self: end }
    }

    /* Styling for the settings tab */
    #tab-5__content {
        label {
            margin-right: 1rem;
            float: left;
        }
        .component-div {
            display: grid;
            grid-template-columns: 1fr 0.2fr;
            padding: 1rem;
            border-radius: 3px;
            background-color: var(--color-wk-panel-content-background, white);
        }
    }
    `;

    // Add custom review buttons
    let extraButtons = /*html*/ `
    <div class="dashboard__lessons-and-reviews-section">
        <div class="reviews-dashboard">
            <div class="reviews-dashboard__content">
                <div class="reviews-dashboard__title" style="color: var(--color-todays-lessons-text)">
                    <div class="reviews-dashboard__title-text">Conjugations</div>
                </div>
                <div class="reviews-dashboard__button reviews-dashboard__button--start">
                    <a href="/subjects/review?conjugations&question_order=reading_first" class="wk-button wk-button--modal-primary" target="_top" data-turbo="false" rel="noopener noreferrer">
                        <span class="wk-button__text">Start</span>
                        <span class="wk-button__icon wk-button__icon--after">
                            ${Icons.customIconTxt("chevron-right")}
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="dashboard__lessons-and-reviews-section">
        <div class="reviews-dashboard">
            <div class="reviews-dashboard__content">
                <div class="reviews-dashboard__title" style="color: var(--color-todays-lessons-text)">
                    <div class="reviews-dashboard__title-text">Audio Quiz</div>
                </div>
                <div class="reviews-dashboard__button reviews-dashboard__button--start">
                    <a href="/subjects/extra_study?queue_type=burned_items&question_order=meaning_first&audio" class="wk-button wk-button--modal-primary" target="_top" data-turbo="false" rel="noopener noreferrer">
                        <span class="wk-button__text">Start</span>
                        <span class="wk-button__icon wk-button__icon--after">
                            ${Icons.customIconTxt("chevron-right")}
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    `;

    // Add content to the Custom SRS popup
    overviewPopup.innerHTML = /*html*/ `
        <header>
            <h1>WaniKani Custom SRS</h1>
            <button class="close-button" onclick="document.getElementById('overview-popup').close();">${Icons.customIconTxt("cross")}</button>
        </header>
        <div id="tabs">
            <input type="radio" name="custom-srs-tab" id="tab-1" checked>
            <label for="tab-1">Overview</label>
            <div id="tab-1__content">
                <div>
                    <div class="content-box" id="overview-lessons">
                        <h2>Lessons</h2>
                        <h2>--</h2>
                        <a class="wk-button wk-button--modal-primary" id="custom-lessons-button" style="width: 80%">Start Lessons</a>
                    </div>
                    <div class="content-box" id="overview-reviews">
                        <h2>Reviews</h2>
                        <h2>--</h2>
                        <a class="wk-button wk-button--modal-primary" id="custom-reviews-button" style="width: 80%">Start Custom Reviews</a>
                    </div>
                    <div class="content-box" style="grid-column: span 2; margin-top: 1rem">
                        <h2>Custom SRS Progress</h2>
                        <div id="custom-srs-progress"></div>
                    </div>
                </div>
            </div>

            <input type="radio" name="custom-srs-tab" id="tab-2">
            <label for="tab-2">Packs</label>
            <div id="tab-2__content"></div>

            <input type="radio" name="custom-srs-tab" id="tab-3">
            <label for="tab-3">Edit Pack</label>
            <div id="tab-3__content">
                <label for="pack-select">Pack:</label>
                <select id="pack-select"></select><br>
                <form class="content-box pack-box">
                    <label for="pack-name">Name:</label>
                    <input id="pack-name" required type="text">
                    <label for="pack-author">Author: </label>
                    <input id="pack-author" required type="text">
                    <label for="pack-version">Version:</label>
                    <input id="pack-version" required type="number" step="0.1">
                    <label for="pack-lvl-type">Pack Levelling Type:</label>
                    <select id="pack-lvl-type" required>
                        <option value="none">No Levels</option>
                        <option value="internal">Pack Levels</option>
                        <option value="wk">WaniKani Levels</option>
                    </select>
                    <div class="wk-lvl-warn" style="display: none; grid-column: 1 / span 2; margin: 0; color: red">
                        <p style="grid-column: 1 / span 2"><i>Warning: Make sure API key is set in Custom SRS settings.</i></p>
                    </div>
                    <div class="pack-lvl-specific" style="display: none; grid-column: 1 / span 2; margin: 0">
                        <label for="pack-lvl">Pack Level (start at 1 recommended):</label>
                        <input id="pack-lvl" required type="number">
                    </div>
                    <div style="grid-column: 1 / span 2">
                        <p>Items:</p>
                        <button id="new-item-button" title="Add Item" type="button" style="margin-left: auto">${Icons.customIconTxt("plus")}</button>
                    </div>
                    <ul style="grid-column: 1 / span 2" class="content-box" id="pack-items"></ul>
                    <button style="grid-column: 1 / span 2" type="submit">Save</button>
                </form>
                <form class="content-box import-box" style="display: none;">
                    <label for="item-type">Paste Pack JSON here:</label>
                    <textarea id="pack-import" required></textarea>
                    <button style="grid-column: 1 / span 2" type="submit">Import</button>
                </form>
            </div>

            <input type="radio" name="custom-srs-tab" id="tab-4">
            <label for="tab-4">Edit Item</label>
            <div id="tab-4__content">
                <div>Select item from Pack edit tab.</div>
                <form class="content-box" style="display: none;">
                    <label for="item-type">Type:</label>
                    <select id="item-type">
                        <option value="Radical">Radical</option>
                        <option value="Kanji">Kanji</option>
                        <option value="Vocabulary">Vocabulary</option>
                        <option value="KanaVocabulary">Kana Vocabulary</option>
                    </select>
                    <label for="item-srs-stage">SRS Stage:</label>
                    <select id="item-srs-stage">
                        <option value="0">Lesson</option>
                        <option value="0.5">First Review</option>
                        <option value="1">Apprentice 1</option>
                        <option value="2">Apprentice 2</option>
                        <option value="3">Apprentice 3</option>
                        <option value="4">Apprentice 4</option>
                        <option value="5">Guru 1</option>
                        <option value="6">Guru 2</option>
                        <option value="7">Master</option>
                        <option value="8">Enlightened</option>
                        <option value="9">Burned</option>
                    </select>
                    <label for="item-characters">Characters:</label>
                    <input id="item-characters" required type="text">
                    <label for="item-meanings">Primary Meaning/s (comma separated):</label>
                    <input id="item-meanings" required type="text">
                    <div class="item-vocab-specific item-kanavocab-specific" style="display: none; grid-column: 1 / span 2">
                        <label for="item-readings">Readings (comma separated):</label>
                        <input id="item-readings" type="text">
                    </div>
                    <div class="item-info-edit-container item-kanji-specific" style="display: none; grid-column: 1 / span 2">
                        <label for="kanji-primary-reading">Primary Reading:</label>
                        <select id="kanji-primary-reading">
                            <option value="onyomi">On'yomi</option>
                            <option value="kunyomi">Kun'yomi</option>
                            <option value="nanori">Nanori</option>
                        </select>
                        <p style="grid-column: 1 / span 2"><i>Please enter at least one of the three readings:</i></p>
                        <label for="kanji-onyomi">On'yomi:</label>
                        <input id="kanji-onyomi" type="text">
                        <label for="kanji-kunyomi">Kun'yomi:</label>
                        <input id="kanji-kunyomi" type="text">
                        <label for="kanji-nanori">Nanori:</label>
                        <input id="kanji-nanori" type="text">
                    </div>
                    <!----------- Optional elements ----------->
                    <h3 style="grid-column: 1 / span 2">Optional</h3>
                    <label for="item-level">Item Unlock Level:</label>
                    <input id="item-level" type="number">
                    <div class="item-vocab-specific item-kanavocab-specific" style="display: none; grid-column: 1 / span 2">
                        <label for="item-word-function">Item Word Functions (e.g. noun, の adjective):</label>
                        <input id="item-word-function" type="text">
                    </div>
                    <div class="item-info-edit-container" style="grid-column: 1 / span 2">
                        <p style="grid-column: 1 / span 2"><i>In explanations you can use tags to highlight &lt;r&gt;radicals&lt;/r&gt;, &lt;k&gt;kanji&lt;/k&gt;, &lt;v&gt;vocabulary&lt;/v&gt;, &lt;me&gt;meanings&lt;/me&gt;, and &lt;re&gt;readings&lt;/re&gt;.</i></p>
                        <label for="item-meaning-explanation">Meaning Explanation:</label>
                        <textarea id="item-meaning-explanation" type="text"></textarea>
                        <div class="item-kanji-specific item-vocab-specific" style="display: none; grid-column: 1 / span 2; grid-template-columns: 1fr 1fr">
                            <label for="item-reading-explanation">Reading Explanation:</label>
                            <textarea id="item-reading-explanation" type="text"></textarea>
                        </div>
                    </div>
                    <div class="item-info-edit-container item-kanavocab-specific item-vocab-specific" style="display: none; grid-column: 1 / span 2">
                        <p>Context Sentences</p>
                        <button id="ctx-add-btn">${Icons.customIconTxt("plus")}</button>
                        <div id="item-context-sentences-container" style="grid-column: 1 / span 2"></div>
                    </div>
                    <div class="item-info-edit-container item-vocab-specific item-radical-specific item-kanji-specific" style="display: none; grid-column: 1 / span 2">
                        <p style="grid-column: 1 / span 2">
                            <span class="item-radical-specific" style="display: none">Kanji This Radical Is In</span>
                            <span class="item-vocab-specific" style="display: none">Kanji Components</span>
                            <span class="item-kanji-specific" style="display: none">Radical Components</span>
                        </p>
                        <p style="grid-column: 1 / span 2"><i>If item from this pack, enter the character. If WaniKani item, enter the ID found on the WK item page. If custom item not in a pack or on WK enter the character.</i></p>
                        <span>
                            <span id="component-type-container">
                                <label for="component-type" style="float: left">Type:</label>
                                <select id="component-type">
                                    <option value=""><i>Select type</i></option>
                                    <option value="internal">This Pack</option>
                                    <option value="wk">WaniKani</option>
                                    <option value="custom">New Custom</option>
                                </select>
                            </span>
                            <span id="component-id-container" style="display: none">
                                <label id="component-id-label" for="component-id" style="float: left">
                                    <span class="item-radical-specific item-vocab-specific" style="display: none;">Kanji</span>
                                    <span class="item-kanji-specific" style="display: none;">Radical</span>
                                </label>
                                <input id="component-id" type="text">
                            </span>
                        </span>
                        <button id="component-add-btn">${Icons.customIconTxt("plus")}</button>
                        <p style="display: none; grid-column: 1 / span 2; color: red"><i>Failed to find component.</i></p>
                        <hr style="grid-column: 1 / span 2">
                        <div id="components-container" style="grid-column: 1 / span 2"></div>
                    </div>
                    <div class="item-info-edit-container" style="grid-column: 1 / span 2">
                        <label for="item-meaning-whitelist">Meaning Whitelist:</label>
                        <input id="item-meaning-whitelist" type="text">
                        <label for="item-meaning-blacklist">Meaning Blacklist:</label>
                        <input id="item-meaning-blacklist" type="text">
                        <div class="item-kanji-specific item-vocab-specific" style="display: none; grid-column: 1 / span 2; grid-template-columns: 1fr 1fr">
                            <label for="item-reading-whitelist">Reading Whitelist:</label>
                            <input id="item-reading-whitelist" type="text">
                            <label for="item-reading-blacklist">Reading Blacklist:</label>
                            <input id="item-reading-blacklist" type="text">
                        </div>
                    </div>
                    <button style="grid-column: 1 / span 2" type="submit">Add</button>
                </form>
            </div>

            <input type="radio" name="custom-srs-tab" id="tab-5">
            <label for="tab-5">Settings</label>
            <div id="tab-5__content">
                <div class="content-box">
                    <h2 style="grid-column: span 2">General</h2>
                    <label for="settingsExportSRSData">Include SRS data in exports</label>
                    <input type="checkbox" id="settingsExportSRSData">
                    <label for="settingsItemQueueMode">Position to insert custom items in reviews</label>
                    <select id="settingsItemQueueMode">
                        <option value="start">Start</option>
                        <option value="weighted-start">Random, weighted to start</option>
                        <option value="random">Random</option>
                    </select>
                    <label for="settingsEnabledConjGrammar">Enable Conjugations and Audio Quiz</label>
                    <input type="checkbox" id="settingsEnabledConjGrammar" checked>
                    <label for="settingsConjGrammarSessionLength">Conjugation session length (item num.)</label>
                    <input type="number" id="settingsConjGrammarSessionLength" value="10">
                    <label style="grid-column: span 2">Active Conjugations:</label>
                    <div id="settingsActiveConj" style="grid-column: span 2"></div>
                    <h2 style="grid-column: span 2">Network Settings</h2>
                    <label for="settingsWKAPIKey">WaniKani API Key</label>
                    <input type="text" id="settingsWKAPIKey" placeholder="API key">
                    <h2 style="grid-column: span 2">Advanced</h2>
                    <label for="settingsLockByDependency">Lock items by dependencies</label>
                    <input type="checkbox" id="settingsLockByDependency" checked>
                    <label for="settingsShowDueTime">Show item due times when editing</label>
                    <input type="checkbox" id="settingsShowDueTime" checked>
                    <label style="grid-column: span 2">Item Types that can be Captured:</label>
                    <div class="component-div" style="grid-column: span 2">
                        <label for="settingsEnableRadicalCapture">Radicals</label>
                        <input type="checkbox" id="settingsEnableRadicalCapture">
                        <label for="settingsEnableKanjiCapture">Kanji</label>
                        <input type="checkbox" id="settingsEnableKanjiCapture">
                        <label for="settingsEnableVocabCapture">Vocabulary</label>
                        <input type="checkbox" id="settingsEnableVocabCapture">
                    </div>
                    <h2 style="grid-column: span 2">Experimental Settings</h2>
                    <p style="grid-column: span 2"><i>These settings are experimental and may not work as intended. I would recommend backing up any item packs you care about (download and save the pack JSON from the packs tab - enable the "Include SRS data in exports"!) just in case.</i></p>
                    <div class="component-div" style="grid-column: span 2; grid-template-columns: 1fr 0.8fr">
                        <label for="settingsSyncEnabled">Enable Cross-Device Sync</label>
                        <input type="checkbox" id="settingsSyncEnabled">
                        <p id="lastSync">&nbsp;&nbsp;Last sync: <span>Never</span></p>
                        <span style="margin-left: auto">
                            <button id="syncNowPull">Force Pull</button>
                            <button id="syncNowPush">Force Push</button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // --------- Custom Lessons ----------
    let lessonsHTML = /*html*/ `
        <button class="close-button" onclick="document.getElementById('custom-lessons').remove();">${Icons.customIconTxt("cross")}</button>
        <div class="character-header">
            <h1 lang="ja" class="character-header__characters"></h1>
            <h2></h2>
        </div>
    `;

    let lessonsCSS = /*css*/ `
    #custom-lessons {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--color-wk-panel-content-background);
        z-index: 10000;
        text-align: center;
        overflow: auto;

        h1 {
            font-weight: 350;
            line-height: normal;
        }

        .close-button {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            font-size: 1.5rem;
            color: var(--color-tertiary, --color-text);
            cursor: pointer;
            background-color: transparent;
            border: none;
            z-index: 1;

            &:hover {
                color: var(--color-text) }
        }

        .character-header {
            container-type: inline-size;
            padding: 1rem;
            box-shadow: 0px 2px 0.2rem 0px rgb(0 0 0 / .5);
            color: var(--color-character-text);

            .character-header__characters { color: var(--color-character-text) }
            &.character-header--radical { background-color: var(--color-radical) }
            &.character-header--kanji { background-color: var(--color-kanji) }
            &.character-header--vocabulary { background-color: var(--color-vocabulary) }
        }

        .container {
            background-color: var(--color-wk-panel-background);
            border-radius: 3px;
            padding: 3rem;
            text-align: left;
            box-shadow: 2px 2px 3px #0000003b;
            margin: 1rem 0 1rem auto;

            .subject-readings {
                display: flex;
                gap: 1rem;
            }
        }

        #subject-info {
            display: flex;
        
            & > button {
                margin-right: auto;
                background: none;
                border: none;
                transform: translateX(-100%);
                border-radius: 3px;
                padding: 0.5rem;
                margin-top: 1rem;

                &:hover {
                    background-color: var(--color-menu, white) }
            }

            a { 
                color: var(--color-text) }

            .subject-section__toggle-icon {
                display: none }

            .subject-section__content {
                background-color: var(--color-wk-panel-content-background);
                padding: 1rem;
                border-radius: 3px;
            }

            #section-meaning .subject-section__subsection:first-child {
                display: flex;
                gap: 2rem;

                .subject-section__meanings-items {
                    width: fit-content;
                    padding: 4px;
                }
            }

            .subject-section__subsection:last-child {
                margin-bottom: 0;
            }

            .subject-character-grid__items {
                margin: 0 }
            .subject-character-grid__item {
                &::marker {
                    content: none }
                .subject-character__content {
                    border-radius: 3px;
                    margin-bottom: 0.5rem;
                }
                .subject-character--kanji .subject-character__content {
                    background-color: var(--color-kanji) }
                .subject-character--radical .subject-character__content {
                    background-color: var(--color-radical) }
                .subject-character--vocabulary .subject-character__content {
                    background-color: var(--color-vocabulary) }
            }
        }
    }
    `;

    // ------------------- Lesson Manager -------------------
    class LessonManager {
        lessonQueue;

        constructor() {
            document.getElementById("overview-popup").close();
            if(!document.getElementById("custom-lessons-css")) {
                let lessonsCSSElem = document.createElement("style");
                lessonsCSSElem.id = "custom-lessons-css";
                lessonsCSSElem.innerHTML = lessonsCSS;
                document.head.appendChild(lessonsCSSElem);
            }
            let lessonsPopup = document.createElement("div");
            lessonsPopup.id = "custom-lessons";
            lessonsPopup.innerHTML = lessonsHTML;
            document.body.appendChild(lessonsPopup);

            this.lessonQueue = activePackProfile.getActiveLessons();

            document.addEventListener("keydown", (e) => {
                if(e.key === "ArrowRight" && document.getElementById("custom-lessons")) this.submitLesson();
            });

            this.nextLesson();
        }

        nextLesson() {
            let nextItem = this.lessonQueue[0];
            let lessonContainer = document.getElementById("custom-lessons");
            lessonContainer.querySelector("h1").innerText = nextItem.characters;
            lessonContainer.querySelector("h2").innerText = nextItem.meanings[0].text.charAt(0).toUpperCase() + nextItem.meanings[0].text.slice(1);

            lessonContainer.querySelector(".character-header").classList.remove("character-header--kanji", "character-header--radical", "character-header--vocabulary");
            if(nextItem.subject_category === "Kanji") lessonContainer.querySelector(".character-header").classList.add("character-header--kanji");
            else if(nextItem.subject_category === "Radical") lessonContainer.querySelector(".character-header").classList.add("character-header--radical");
            else if(nextItem.subject_category === "Vocabulary") lessonContainer.querySelector(".character-header").classList.add("character-header--vocabulary");

            document.getElementById("subject-info")?.remove();
            document.getElementById("custom-lessons").innerHTML += '<div class="subject-info" id="subject-info" complete>' + activePackProfile.getSubjectInfo(nextItem.id) + '</div>';
            lessonContainer.querySelectorAll(".subject-section").forEach(section => {
                const toggleLinkElem = section.querySelector(".subject-section__toggle");
                const contentElem = section.querySelector(".subject-section__content");

                if (toggleLinkElem && contentElem) {
                    toggleLinkElem.setAttribute("aria-expanded", "true");
                    contentElem.removeAttribute("hidden");
                }
            });
            let actionsSection = document.createElement("section");
            actionsSection.innerHTML = `
            <section class="subject-section subject-section--collapsible">
                <h2 class="subject-section__title">Actions</h2>
                <section class="subject-section__content">
                    <button id="burn-button" class="wk-button wk-button--modal-primary" style="width: auto">Burn</button>
                    <button id="delete-button" class="wk-button wk-button--modal-primary" style="width: auto">Delete</button>
                    <button id="skip-button" class="wk-button wk-button--modal-primary" style="width: auto">Skip for Now</button>
                </section>
            </section>
            `;
            lessonContainer.querySelector("#subject-info .container").appendChild(actionsSection);
            lessonContainer.querySelector("#burn-button").onclick = () => {
                activePackProfile.burnItem(nextItem.id);
                this.submitLesson();
            };
            lessonContainer.querySelector("#delete-button").onclick = () => {
                activePackProfile.deleteItem(nextItem.id);
                this.submitLesson(false);
            };
            lessonContainer.querySelector("#skip-button").onclick = () => this.submitLesson(false);

            let nextButton = document.createElement("button");
            nextButton.innerHTML = Icons.customIconTxt("chevron-right");
            nextButton.onclick = () => this.submitLesson();
            document.getElementById("subject-info").appendChild(nextButton);
        }

        submitLesson(submit = true) {
            let item = this.lessonQueue.shift();
            if(submit) activePackProfile.submitReview(item.id, 0, 0);
            if(this.lessonQueue.length === 0) {
                document.getElementById("custom-lessons").remove();
                return;
            } else this.nextLesson();
        }
    }

    // --------- Popup open button ---------
    let overviewPopupButton, buttonLI;

    overviewPopupButton = document.createElement("button");
    overviewPopupButton.classList = "sitemap__section-header";
    overviewPopupButton.style = `
        display: flex;
        align-items: center;
    `;
    let buttonSpan = document.createElement("span");
    buttonSpan.classList = "font-sans";
    buttonSpan.innerText = "WK Custom SRS";
    overviewPopupButton.appendChild(buttonSpan);
    buttonLI = document.createElement("li");
    buttonLI.classList = "sitemap__section";
    buttonLI.appendChild(overviewPopupButton);
    overviewPopupButton.title = "Custom SRS";
    overviewPopupButton.onclick = () => {
        changeTab(1);
        overviewPopup.showModal();
    };

    // --------- Add custom elements to page ---------
    if(document.readyState === "complete" || document.readyState === "interactive") {
        dashboardElementsLoad();
    } else {
        document.addEventListener("DOMContentLoaded", dashboardElementsLoad);
    }
    async function dashboardElementsLoad() {
        document.head.appendChild(overviewPopupStyle);
        document.body.appendChild(overviewPopup);
        // Add event listeners for buttons etc.
        for(let i = 1; i <= 5; i++) {
            document.querySelector(`#tab-${i}`).onchange = () => {
                changeTab(i) };
        }
        document.getElementById("pack-select").onchange = () => {
            loadPackEditDetails(document.getElementById("pack-select").value) };
        document.getElementById("new-item-button").onclick = () => {
            changeTab(4, null) };
        // Add popup button to page
        if (window.location.pathname.includes("/dashboard") || window.location.pathname === "/") {
            document.getElementById("sitemap").prepend(buttonLI);
        }

        while(!settingsLoaded) await new Promise(r => setTimeout(r, 250));
        if(CustomSRSSettings.userSettings.enabledConjGrammar) document.querySelector(".dashboard__lessons-and-reviews").innerHTML += extraButtons;
    }


    // ---------- Change tab ----------
    function changeTab(tab, data) {
        document.querySelector(`#tab-${tab}`).checked = true;
        switch(tab) {
            case 1:
                updateOverviewTab();
                break;
            case 2:
                updatePacksTab();
                break;
            case 3:
                updateEditPackTab(data);
                break;
            case 4:
                updateEditItemTab(data);
                break;
            case 5:
                updateSettingsTab();
                break;
        }
    }

    // ---------- Update popup content ----------
    function updateOverviewTab() {
        let numLessons = activePackProfile.getNumActiveLessons();
        document.querySelector("#overview-lessons h2:not(:first-child)").innerText = numLessons;
        if(numLessons > 0) {
            document.getElementById("custom-lessons-button").onclick = () => new LessonManager();
            document.getElementById("custom-lessons-button").style.cursor = "pointer";
        } else document.getElementById("custom-lessons-button").style.cursor = "not-allowed";
        let numReviews = activePackProfile.getNumActiveReviews();
        document.querySelector("#overview-reviews h2:not(:first-child)").innerText = numReviews;
        if(numReviews > 0) {
            document.getElementById("custom-reviews-button").onclick = () => window.location.href = "/subjects/review?custom";
            document.getElementById("custom-reviews-button").style.cursor = "pointer";
        } else document.getElementById("custom-reviews-button").style.cursor = "not-allowed";
        // Fill in the progress section with the current progress for each pack
        let progressDiv = document.getElementById("custom-srs-progress");
        progressDiv.innerHTML = "";
        for(let pack of activePackProfile.customPacks) {
            if(pack.active) progressDiv.innerHTML += packProgressHTML(pack);
        }
    }
    function packProgressHTML(pack) {
        return /*html*/ `
        <div class="content-box">
            <h3>${pack.name} - Author: ${pack.author}</h3>
            ${pack.getProgressHTML()}
        </div>
        `;
    }

    function updatePacksTab() {
        let packsTab = document.getElementById("tab-2__content");
        packsTab.innerHTML = "";
        for(let i = 0; i < activePackProfile.customPacks.length; i++) {
            let pack = activePackProfile.customPacks[i];
            let packElement = document.createElement("div");
            packElement.classList = "pack content-box";
            packElement.innerHTML = /*html*/ `
                <h3>${pack.name}: <span>${pack.items.length} items</span><br><span>${pack.author}</span></h3>
                <div>
                    <span>Active: </span>
                    <input type="checkbox" id="pack-${i}-active" ${pack.active ? "checked" : ""}>
                    <button class="edit-pack" title="Edit Pack">${Icons.customIconTxt("edit")}</button>
                    <button class="export-pack" title="Export Pack">${Icons.customIconTxt("download")}</button>
                    <button class="delete-pack" title="Delete Pack">${Icons.customIconTxt("cross")}</button>
                </div>
            `;
            packElement.querySelector(".edit-pack").onclick = () => { // Pack edit button
                changeTab(3, i);
            };
            packElement.querySelector(".export-pack").onclick = () => { // Pack export button to make JSON and then copy it to the clipboard
                let data = StorageManager.packToJSON(activePackProfile.customPacks[i]);
                navigator.clipboard.writeText(data).then(() => {
                    alert("Pack JSON copied to clipboard");
                });
            };
            packElement.querySelector(".delete-pack").onclick = () => { // Pack delete button
                if(!confirm(`Are you sure you want to delete the ${pack.name} pack?`)) return;
                activePackProfile.removePack(i);
                StorageManager.savePackProfile(activePackProfile, "main", true);
                changeTab(2);
            };
            packElement.querySelector(`#pack-${i}-active`).onchange = () => { // Pack active checkbox
                activePackProfile.customPacks[i].active = !activePackProfile.customPacks[i].active;
                StorageManager.savePackProfile(activePackProfile, "main");
            };
            packsTab.appendChild(packElement);
        }
        // Pack action buttons
        let onlinePacksButton = document.createElement("button");
        onlinePacksButton.classList = "outline-button";
        onlinePacksButton.style = "width: 49%";
        onlinePacksButton.innerHTML = "Online Packs";
        onlinePacksButton.onclick = () => {
            onlinePacks();
        };
        let importPackButton = document.createElement("button");
        importPackButton.classList = "outline-button";
        importPackButton.style = "width: 49%; float: right;";
        importPackButton.innerHTML = "Import Pack";
        importPackButton.onclick = () => {
            changeTab(3, "import");
        };
        let newPackButton = document.createElement("button");
        newPackButton.classList = "outline-button";
        newPackButton.style = "width: 100%; margin-top: 0.5rem;";
        newPackButton.innerHTML = "New Pack";
        newPackButton.onclick = () => {
            changeTab(3, "new");
        };
        packsTab.append(onlinePacksButton, importPackButton, newPackButton);
    }

    function onlinePacks() {
        let packsTab = document.getElementById("tab-2__content");
        packsTab.innerHTML = "";
        let onlinePacks = document.createElement("div");
        onlinePacks.innerHTML = "<h2>Online Packs</h2>";
        packsTab.appendChild(onlinePacks);
        // Fetch index of packs from GitHub
        fetch("https://raw.githubusercontent.com/leohumnew/wanikani-custom-srs-packs/main/index.json").then(response => response.json()).then(data => {
            for(let pack of data) {
                let packElement = document.createElement("div");
                packElement.classList = "content-box";
                packElement.style = "margin-bottom: 1rem";
                packElement.innerHTML = /*html*/ `
                    <button class="import-pack" title="Import Pack" style="float: right">${Icons.customIconTxt("download")}</button>
                    <h3 style="margin-top: 0">${pack.name}<br><span style="opacity: 0.6; font-size: 0.8em;">${pack.author}</span></h3>
                    <p>${pack.description}</p>
                `;
                packElement.querySelector(".import-pack").onclick = () => {
                    const url = pack.filename.startsWith("http") ? pack.filename : "https://raw.githubusercontent.com/leohumnew/wanikani-custom-srs-packs/main/packs/" + pack.filename;
                    fetch(url).then(response => response.json()).then(data => {
                        importPack(data);
                    }).catch(() => {
                        alert("Failed to fetch pack data");
                    });
                };
                onlinePacks.appendChild(packElement);
            }
        }).catch(() => {
            onlinePacks.innerHTML = "<h2>Failed to fetch online packs</h2>";
        });
    }

    function updateEditPackTab(editPack) {
        let packSelect = document.getElementById("pack-select");
        packSelect.innerHTML = "<option value='new'>New Pack</option><option value='import'>Import Pack</option>";
        for(let i = 0; i < activePackProfile.customPacks.length; i++) {
            let pack = activePackProfile.customPacks[i];
            packSelect.innerHTML += `<option value="${i}">${pack.name} - ${pack.author}</option>`;
        }
        if(editPack !== undefined) packSelect.value = editPack;
        else packSelect.value = "new";
        packSelect.onchange();
    }

    function updateEditItemTab(editItem) {
        tempVar.components = [];
        if(editItem !== undefined) {
            // Show add item edit tab and make sure inputs are empty
            document.querySelector("#tab-4__content > form").style.display = "grid";
            document.querySelector("#tab-4__content > div").style.display = "none";
            document.getElementById("ctx-add-btn").onclick = (e) => {
                e.preventDefault();
                document.getElementById("item-context-sentences-container").appendChild(buildContextSentenceEditHTML("", ""));
            };
            document.getElementById("component-add-btn").onclick = (e) => { // Handle adding kanji components
                e.preventDefault();
                let type = document.getElementById("component-type").value;
                let id = document.getElementById("component-id").value;
                let subjectType = document.getElementById("item-type").value == "Kanji" ? "Radical" : "Kanji";
                if(type === "" || id === "") return;
                // Check if component exists. When type is internal id is the item character to search for
                switch(type) {
                    case "internal": {
                        let itemID = activePackProfile.customPacks[document.getElementById("pack-select").value].getItemID(subjectType, id);
                        if(itemID !== null && itemID !== undefined) {
                            let itemFromID = activePackProfile.customPacks[document.getElementById("pack-select").value].getItem(itemID);
                            let itemReadings = itemFromID.info.readings || [];
                            if(itemFromID.info.onyomi) itemReadings = itemReadings.concat(itemFromID.info.onyomi);
                            if(itemFromID.info.kunyomi) itemReadings = itemReadings.concat(itemFromID.info.kunyomi);
                            if(itemFromID.info.nanori) itemReadings = itemReadings.concat(itemFromID.info.nanori);
                            tempVar.components.push({id: itemID, pack: parseInt(document.getElementById("pack-select").value), type: subjectType, characters: itemFromID.info.characters, meanings: itemFromID.info.meanings, readings: itemReadings});
                            document.getElementById("component-add-btn").nextElementSibling.style.display = "none";
                            document.getElementById("components-container").appendChild(buildComponentEditHTML(tempVar.components[tempVar.components.length - 1]));
                            document.getElementById("component-type").value = "";
                            document.getElementById("component-id").value = "";
                        } else {
                            document.getElementById("component-add-btn").nextElementSibling.style.display = "block";
                        }
                        break;
                    } case "wk": {
                        id = parseInt(id);
                        if(isNaN(id)) {
                            document.getElementById("component-add-btn").nextElementSibling.innerText = "Please enter the ID found on this item's details page.";
                            document.getElementById("component-add-btn").nextElementSibling.style.display = "block";
                            return;
                        } else document.getElementById("component-add-btn").nextElementSibling.innerText = "Failed to find component.";
                        // Fetch wk api item to check it's valid
                        Utils.wkAPIRequest("subjects/" + id).then((response) => {
                            if(response) {
                                tempVar.components.push({id: id, pack: -1, type: subjectType, characters: response.data.characters, meanings: response.data.meanings.map(m => m.meaning), readings: response.data.readings?.map(r => r.reading) || response.data.onyomi?.concat(response.data.kunyomi).concat(response.data.nanori) || null, lvl: response.data.level});
                                document.getElementById("component-add-btn").nextElementSibling.style.display = "none";
                                document.getElementById("components-container").appendChild(buildComponentEditHTML(tempVar.components[tempVar.components.length - 1]));
                                document.getElementById("component-type").value = "";
                                document.getElementById("component-id").value = "";
                            } else {
                                document.getElementById("component-add-btn").nextElementSibling.style.display = "block";
                            }
                        });
                        break;
                    } case "custom": {
                        const inputCharacters = id;
                        const link = prompt("Enter a link to more info (e.g. Jisho) if available");
                        const meaning = prompt("Enter the primary meaning of the component");
                        const reading = prompt("Enter the primary reading of the component");
                        tempVar.components.push({id: link ? link : inputCharacters, pack: null, type: subjectType, characters: inputCharacters, meanings: [meaning], readings: [reading]});
                        document.getElementById("component-add-btn").nextElementSibling.style.display = "none";
                        document.getElementById("components-container").appendChild(buildComponentEditHTML(tempVar.components[tempVar.components.length - 1]));
                        document.getElementById("component-type").value = "";
                        document.getElementById("component-id").value = "";
                    }
                }
            };
            // Clear old data and set new data
            ["item-reading-explanation", "item-meaning-explanation", "item-characters", "item-meanings", "item-readings", "kanji-onyomi", "kanji-kunyomi", "item-level", "kanji-nanori", "item-word-function", "item-meaning-whitelist", "item-meaning-blacklist", "item-reading-whitelist", "item-reading-blacklist"].forEach(s => {
                document.getElementById(s).value = "";
            });
            document.getElementById("item-context-sentences-container").innerHTML = "";
            document.getElementById("components-container").innerHTML = "";
            tempVar.components = [];

            if(editItem !== null) {
                let editItemInfo = activePackProfile.customPacks[document.getElementById("pack-select").value].getItem(editItem).info;
                document.getElementById("item-srs-stage").value = editItemInfo.srs_lvl;
                document.getElementById("item-type").value = editItemInfo.type;
                document.getElementById("item-characters").value = editItemInfo.characters;
                document.getElementById("item-meanings").value = editItemInfo.meanings.join(", ");
                if(editItemInfo.lvl) document.getElementById("item-level").value = editItemInfo.lvl;
                if(editItemInfo.meaning_expl) document.getElementById("item-meaning-explanation").value = editItemInfo.meaning_expl;
                if(editItemInfo.readings) document.getElementById("item-readings").value = editItemInfo.readings.join(", ");
                if(editItemInfo.primary_reading_type) document.getElementById("kanji-primary-reading").value = editItemInfo.primary_reading_type;
                if(editItemInfo.onyomi) document.getElementById("kanji-onyomi").value = editItemInfo.onyomi.join(", ");
                if(editItemInfo.kunyomi) document.getElementById("kanji-kunyomi").value = editItemInfo.kunyomi.join(", ");
                if(editItemInfo.nanori) document.getElementById("kanji-nanori").value = editItemInfo.nanori.join(", ");
                if(editItemInfo.reading_expl) document.getElementById("item-reading-explanation").value = editItemInfo.reading_expl;
                if(editItemInfo.func) document.getElementById("item-word-function").value = editItemInfo.func;
                if(editItemInfo.meaning_wl) document.getElementById("item-meaning-whitelist").value = editItemInfo.meaning_wl.join(", ");
                if(editItemInfo.meaning_bl) document.getElementById("item-meaning-blacklist").value = editItemInfo.meaning_bl.join(", ");
                if(editItemInfo.reading_wl) document.getElementById("item-reading-whitelist").value = editItemInfo.reading_wl.join(", ");
                if(editItemInfo.reading_bl) document.getElementById("item-reading-blacklist").value = editItemInfo.reading_bl.join(", ");
                if(editItemInfo.ctx_jp) {
                    let ctxContainer = document.getElementById("item-context-sentences-container");
                    ctxContainer.innerHTML = "";
                    editItemInfo.ctx_jp.forEach((s, i) => {
                        ctxContainer.appendChild(buildContextSentenceEditHTML(s, editItemInfo.ctx_en[i]));
                    });
                }
                if(editItemInfo.kanji || editItemInfo.radicals) {
                    tempVar.components = editItemInfo.kanji || editItemInfo.radicals;
                    let container = document.getElementById("components-container");
                    container.innerHTML = "";
                    tempVar.components.forEach(k => {
                        container.appendChild(buildComponentEditHTML(k));
                    });
                } else tempVar.components = [];
                document.querySelector("#tab-4__content button[type='submit']").innerText = "Save";
            } else {
                document.querySelector("#tab-4__content button[type='submit']").innerText = "Add";
                document.querySelector("#item-srs-stage").value = "0";
            }
            // Add event listener to form
            document.querySelector("#tab-4__content form").onsubmit = (e) => {
                e.preventDefault();

                let itemType = document.getElementById("item-type").value;

                let infoStruct = {
                    type: itemType,
                    characters: document.getElementById("item-characters").value,
                    meanings: document.getElementById("item-meanings").value.split(",").map(s => s.trim()),
                    srs_lvl: document.getElementById("item-srs-stage").value
                };
                if(document.getElementById("item-meaning-explanation").value != "") infoStruct.meaning_expl = document.getElementById("item-meaning-explanation").value;
                if(document.getElementById("item-level").value != "") infoStruct.lvl = parseInt(document.getElementById("item-level").value);
                if(document.getElementById("item-meaning-whitelist").value != "") infoStruct.meaning_wl = document.getElementById("item-meaning-whitelist").value.split(",").map(s => s.trim());
                if(document.getElementById("item-meaning-blacklist").value != "") infoStruct.meaning_bl = document.getElementById("item-meaning-blacklist").value.split(",").map(s => s.trim());

                let pack = activePackProfile.customPacks[document.getElementById("pack-select").value];
                let ctxDivs = document.getElementById("item-context-sentences-container").children;

                // Add or edit item
                switch(itemType) {
                    case "Radical":
                        infoStruct.category = infoStruct.type;
                        if(tempVar.components.length > 0) infoStruct.kanji = tempVar.components;
                        break;
                    case "Kanji":
                        infoStruct.category = infoStruct.type;
                        infoStruct.primary_reading_type = document.getElementById("kanji-primary-reading").value;
                        if(document.getElementById("kanji-" + infoStruct.primary_reading_type.toLowerCase()).value == "") {
                            alert("Primary reading must be set");
                            return;
                        }
                        let on_reading = document.getElementById("kanji-onyomi").value;
                        let kun_reading = document.getElementById("kanji-kunyomi").value;
                        let nan_reading = document.getElementById("kanji-nanori").value;
                        if(on_reading != "" && on_reading != null) infoStruct.onyomi = on_reading.split(/,|、/).map(s => s.trim());
                        if(kun_reading != "" && kun_reading != null) infoStruct.kunyomi = kun_reading.split(/,|、/).map(s => s.trim());
                        if(nan_reading != "" && nan_reading != null) infoStruct.nanori = nan_reading.split(/,|、/).map(s => s.trim());
                        if(document.getElementById("item-reading-explanation").value != "") infoStruct.reading_expl = document.getElementById("item-reading-explanation").value;
                        if(document.getElementById("item-reading-whitelist").value != "") infoStruct.reading_wl = document.getElementById("item-reading-whitelist").value.split(",").map(s => s.trim());
                        if(document.getElementById("item-reading-blacklist").value != "") infoStruct.reading_bl = document.getElementById("item-reading-blacklist").value.split(",").map(s => s.trim());
                        if(tempVar.components.length > 0) infoStruct.radicals = tempVar.components;
                        break;
                    case "Vocabulary":
                        infoStruct.category = infoStruct.type;
                        infoStruct.readings = document.getElementById("item-readings").value.split(/,|、/).map(s => s.trim());
                        if(document.getElementById("item-reading-explanation").value != "") infoStruct.reading_expl = document.getElementById("item-reading-explanation").value;
                        if(document.getElementById("item-word-function").value != "") infoStruct.func = document.getElementById("item-word-function").value;
                        if(document.getElementById("item-context-sentences-container").children.length > 0) {
                            infoStruct.ctx_jp = [];
                            infoStruct.ctx_en = [];
                            for(let i = 0; i < ctxDivs.length; i++) {
                                let ctxDiv = ctxDivs[i];
                                infoStruct.ctx_jp.push(ctxDiv.children[0].value);
                                infoStruct.ctx_en.push(ctxDiv.children[1].value);
                            }
                        }
                        if(document.getElementById("item-reading-whitelist").value != "") infoStruct.reading_wl = document.getElementById("item-reading-whitelist").value.split(",").map(s => s.trim());
                        if(document.getElementById("item-reading-blacklist").value != "") infoStruct.reading_bl = document.getElementById("item-reading-blacklist").value.split(",").map(s => s.trim());
                        if(tempVar.components.length > 0) infoStruct.kanji = tempVar.components;
                        break;
                    case "KanaVocabulary":
                        let readingsEl = document.getElementById("item-readings");
                        infoStruct.category = "Vocabulary";
                        if(readingsEl.value != "" && !(readingsEl.value.split(/,|、/).length == 1 && infoStruct.characters == readingsEl.value.split(/,|、/)[0])) infoStruct.readings = readingsEl.value.split(/,|、/).map(s => s.trim());
                        if(document.getElementById("item-word-function").value != "") infoStruct.func = document.getElementById("item-word-function").value;
                        if(document.getElementById("item-context-sentences-container").children.length > 0) {
                            infoStruct.ctx_jp = [];
                            infoStruct.ctx_en = [];
                            for(let i = 0; i < ctxDivs.length; i++) {
                                let ctxDiv = ctxDivs[i];
                                infoStruct.ctx_jp.push(ctxDiv.children[0].value);
                                infoStruct.ctx_en.push(ctxDiv.children[1].value);
                            }
                        }
                        break;
                    default:
                        console.error("Invalid item type");
                        return;
                }
                if(editItem !== null) pack.editItem(editItem, infoStruct);
                else pack.addItem(infoStruct);

                document.querySelector("#tab-4__content > form").style.display = "none";
                document.querySelector("#tab-4__content > div").style.display = "block";
                loadPackEditDetails(document.getElementById("pack-select").value);
                StorageManager.savePackProfile(activePackProfile, "main");
                changeTab(3, document.getElementById("pack-select").value);
            };
        } else {
            // Hide add item edit tab
            document.querySelector("#tab-4__content > form").style.display = "none";
            document.querySelector("#tab-4__content > div").style.display = "block";
        }
    }

    function updateSettingsTab() {
        const settings = CustomSRSSettings.userSettings;
        const updateSetting = (elementId, property, isCheckbox = false, needsReload = false) => {
            const element = document.getElementById(elementId);
            if(isCheckbox) element.checked = settings[property];
            else element.value = settings[property];
            element.onchange = () => {
                settings[property] = isCheckbox ? element.checked : element.value;
                StorageManager.saveSettings();
                if(elementId == "settingsSyncEnabled") {
                    if(element.checked) SyncManager.checkIfAuthed();
                    else {
                        if(confirm("Are you sure you want to disable sync?")) SyncManager.disableSync();
                        else {
                            element.checked = true;
                            settings[property] = true;
                            StorageManager.saveSettings();
                            return;
                        }
                    }
                } else if(elementId == "settingsEnableRadicalCapture" || elementId == "settingsEnableKanjiCapture" || elementId == "settingsEnableVocabCapture") {
                    if(!settings.enableRadicalCapture && !settings.enableKanjiCapture && !settings.enableVocabCapture) {
                        CustomSRSSettings.savedData.capturedWKReview = null;
                        StorageManager.saveSettings();
                    }
                }
                if(needsReload) window.location.reload();
            };
        };

        updateSetting("settingsShowDueTime", "showItemDueTime", true);
        updateSetting("settingsItemQueueMode", "itemQueueMode");
        updateSetting("settingsExportSRSData", "exportSRSData", true);
        updateSetting("settingsWKAPIKey", "apiKey", false, true);
        updateSetting("settingsEnabledConjGrammar", "enabledConjGrammar", true, true);
        updateSetting("settingsConjGrammarSessionLength", "conjGrammarSessionLength");
        updateSetting("settingsSyncEnabled", "syncEnabled", true);
        updateSetting("settingsEnableRadicalCapture", "enableRadicalCapture", true);
        updateSetting("settingsEnableKanjiCapture", "enableKanjiCapture", true);
        updateSetting("settingsEnableVocabCapture", "enableVocabCapture", true);
        updateSetting("settingsLockByDependency", "lockByDependency", true);

        document.getElementById("settingsActiveConj").innerHTML = "";
        document.getElementById("settingsActiveConj").appendChild(Conjugations.getSettingsHTML());

        document.querySelector("#lastSync span").innerText = new Date(CustomSRSSettings.savedData.lastSynced).toLocaleString();
        document.getElementById("syncNowPull").onclick = async () => {
            activePackProfile = await StorageManager.loadPackProfile("main", true);
        };
        document.getElementById("syncNowPush").onclick = () => {
            StorageManager.savePackProfile(activePackProfile, "main", true, true);
        };
    }

    // ---------- Tabs details ----------
    function loadPackEditDetails(i) {
        let packNameInput = document.getElementById("pack-name");
        let packAuthorInput = document.getElementById("pack-author");
        let packVersionInput = document.getElementById("pack-version");
        let packLvlTypeInput = document.getElementById("pack-lvl-type");
        let packLvlInput = document.getElementById("pack-lvl");
        let packItems = document.getElementById("pack-items");
        let importBox = document.getElementById("pack-import");
        if(i === "new") { // If creating a new pack
            packNameInput.value = "";
            packAuthorInput.value = "";
            packVersionInput.value = 0.1;
            packLvlTypeInput.value = "none";
            packLvlInput.value = 1;
        } else if(i === "import") { // If importing a pack
            importBox.value = "";
        } else { // If editing an existing pack
            let pack = activePackProfile.customPacks[i];
            packNameInput.value = pack.name;
            packAuthorInput.value = pack.author;
            packVersionInput.value = pack.version;
            packLvlTypeInput.value = pack.lvlType;
            packLvlInput.value = pack.lvl;
            packItems.innerHTML = "";
            for(let j = 0; j < pack.items.length; j++) {
                let item = pack.items[j];
                let itemElement = document.createElement("li");
                itemElement.classList = "pack-item";
                itemElement.innerHTML = `
                    ${item.info.characters} - ${item.info.meanings[0]} - ${item.info.type} ${CustomSRSSettings.userSettings.showItemDueTime ? "- Due: " + pack.getItemTimeUntilReview(j, i) : ""}
                    <div>
                        <button class="edit-item" title="Edit Item" type="button">${Icons.customIconTxt("edit")}</button>
                        <button class="delete-item" title="Delete Item" type="button">${Icons.customIconTxt("cross")}</button>
                    </div>
                `;
                itemElement.querySelector(".edit-item").onclick = () => { // Item edit button
                    savePack();
                    changeTab(4, item.id);
                };
                itemElement.querySelector(".delete-item").onclick = () => { // Item delete button
                    pack.removeItem(j);
                    loadPackEditDetails(i);
                };
                packItems.appendChild(itemElement);
            }
        }
        document.querySelector("#tab-3__content form.pack-box").onsubmit = (e) => { // Pack save button
            e.preventDefault();
            savePack();
            changeTab(2);
        };
        document.querySelector("#tab-3__content form.import-box").onsubmit = (e) => { // Pack import button
            e.preventDefault();
            let pack = JSON.parse(importBox.value);
            importPack(pack);
        };

        function savePack() {
            if(i === "new") {
                let pack = new CustomItemPack(packNameInput.value, packAuthorInput.value, packVersionInput.value, packLvlTypeInput.value, parseInt(packLvlInput.value));
                activePackProfile.addPack(pack);
                changeTab(3, activePackProfile.customPacks.length - 1);
            } else {
                activePackProfile.customPacks[i].name = packNameInput.value;
                activePackProfile.customPacks[i].author = packAuthorInput.value;
                activePackProfile.customPacks[i].version = packVersionInput.value;
                activePackProfile.customPacks[i].lvlType = packLvlTypeInput.value;
                activePackProfile.customPacks[i].lvl = packLvlInput.value;
            }
            StorageManager.savePackProfile(activePackProfile, "main", true);
        }
    }

    function importPack(pack) {
        let packExistingStatus = activePackProfile.doesPackExist(pack.name, pack.author, pack.version); // Check if pack already exists
        if(packExistingStatus == "exists") {
            alert("Import failed: A pack with the same name, author, and version already exists.");
        } else if(packExistingStatus == "no") {
            activePackProfile.addPack(StorageManager.packFromJSON(pack));
            StorageManager.savePackProfile(activePackProfile, "main", true);
            changeTab(2);
        } else {
            if(confirm("A pack with the same name and author but different version already exists. Do you want to update it?")) {
                activePackProfile.updatePack(packExistingStatus, pack);
                StorageManager.savePackProfile(activePackProfile, "main", true);
                changeTab(2);
            }
        }
    }

    // ---------- Item info procedural edit structures ----------
    function buildComponentEditHTML(item) {
        let template = document.createElement('template');
        template.innerHTML = /*html*/ `
        <div class="component-div">
            <p>${item.pack ? (item.pack < 0 ? "WaniKani" : "This Pack") : "New Custom"} ${item.type}. Character: ${item.characters} | Meaning: ${item.meanings[0]}</p>
            <button class="delete-component" title="Delete Component">${Icons.customIconTxt("cross")}</button>
        </div>
        `;
        template.content.querySelector(".delete-component").onclick = function() {
            tempVar.components.splice(tempVar.components.findIndex(c => c.id == item.id && c.pack == item.pack), 1);
            this.parentElement.remove();
        };
        return template.content;
    }

    function buildContextSentenceEditHTML(jp, en) {
        let contextSentence = document.createElement('div');
        contextSentence.classList = "ctx-sentence-div";
        contextSentence.innerHTML = /*html*/ `
        <input type="text" value="${jp}" placeholder="Japanese" required>
        <input type="text" value="${en}" placeholder="English" required>
        <button class="delete-sentence" title="Delete Sentence" onclick="this.parentElement.remove()">${Icons.customIconTxt("cross")}</button>
        `;
        return contextSentence;
    }
}
if(window.location.pathname.includes("/review") || window.location.pathname.includes("/dashboard") || window.location.pathname === "/") {
    // Add custom CSS
    let customReviewCSS = document.createElement("style");
    customReviewCSS.innerHTML = /* css */ `
    .character-header__characters {
        font-size: 25px !important;
        text-align: center;
        width: 100%;
    }
    wk-character-image {
        margin-left: auto !important;
        margin-right: auto !important;
    }
    .character-header__characters::first-line {
        font-size: 50px }

    @container(min-width: 768px) {
        .character-header__characters {
            font-size: 50px !important }
        .character-header__characters::first-line {
            font-size: 100px }
    }
    `;
    document.head.appendChild(customReviewCSS);
    // ---------- Item details HTML and formatting ----------
    function buildKanjiComponentHTML(item) {
        return /*html*/ `
        <li class="subject-character-grid__item">
            <a class="subject-character subject-character--${item.type.toLowerCase()} subject-character--grid" data-turbo-frame="_blank" ${item.pack ? (item.pack < 0 ? 'href="https://www.wanikani.com/' + item.type.toLowerCase() + '/' + item.characters + '"' : "") : 'href="' + item.id + '"'}>
                <div class="subject-character__content">
                    <span class="subject-character__characters" lang="ja">${item.characters}</span>
                    <div class="subject-character__info">
                        <span class="subject-character__reading">${item.readings ? item.readings[0] : item.primary_reading_type == "onyomi" ? item.onyomi[0] : item.primary_reading_type == "kunyomi" ? item.kunyomi[0] : item.primary_reading_type == "nanori" ? item.nanori[0] : "-"}</span>
                        <span class="subject-character__meaning">${item.meanings[0].text ? item.meanings[0].text : item.meanings[0]}</span>
                    </div>
                </div>
            </a>
        </li>
        `;
    }
    function buildRadicalComponentHTML(item) {
        return /*html*/ `
        <li class="subject-list__item">
            <a class="subject-character subject-character--radical subject-character--small-with-meaning subject-character--expandable" data-turbo-frame="_blank" ${item.pack ? (item.pack < 0 ? 'href="https://www.wanikani.com/radicals/' + item.meanings[0].text.toLowerCase() + '"' : "") : 'href="' + item.id + '"'}>
                <div class="subject-character__content">
                    <span class="subject-character__characters" lang="ja">${item.characters}</span>
                    <div class="subject-character__info">
                        <span class="subject-character__meaning">${item.meanings[0].text ? item.meanings[0].text : item.meanings[0]}</span>
                    </div>
                </div>
            </a>
        </li>
        `;
    }
    function buildVocabComponentHTML(item) {
        return /*html*/ `
        <li class="subject-character-grid__item">
            <a class="subject-character subject-character--vocabulary subject-character--grid subject-character--unlocked" href="https://www.wanikani.com/vocabulary/${item.ogChar}" data-turbo-frame="_blank" target="_blank">
                <div class="subject-character__content">
                    <span class="subject-character__characters" lang="ja">${item.ogChar}</span>
                    <div class="subject-character__info">
                        <span class="subject-character__reading">${item.ogReading}</span>
                        <span class="subject-character__meaning">${item.meanings[0].text ? item.meanings[0].text : item.meanings[0]}</span>
                    </div>
                </div>
            </a>
        </li>
        `;
    }
    function buildContextSentencesHTML(ctxArrayJP, ctxArrayEN) {
        let out = "";
        for(let i = 0; i < ctxArrayJP.length; i++) {
            out += `
            <div class="subject-section__text subject-section__text--grouped">
                <p lang="ja">${ctxArrayJP[i]}</p>
                <p>${ctxArrayEN[i]}</p>
            </div>
            `;
        }
        return out;
    }
    function explFormat(expl) {
        if(!expl) return null;
        return expl.replace(/<r>(.*?)<\/r>/g, "<mark title='Radical' class='radical-highlight'>$1</mark>").replace(/<k>(.*?)<\/k>/g, "<mark title='Kanji' class='kanji-highlight'>$1</mark>").replace(/<v>(.*?)<\/v>/g, "<mark title='Vocabulary' class='vocabulary-highlight'>$1</mark>").replace(/<me>(.*?)<\/me>/g, "<mark title='Meaning' class='meaning-highlight'>$1</mark>").replace(/<re>(.*?)<\/re>/g, "<mark title='Reading' class='reading-highlight'>$1</mark>");
    }
    function makeDetailsHTML(item) {
        switch(item.info.type) {
            case "Radical":
            return /*html*/ `
                <div class="container">
                    <section class="subject-section subject-section--meaning subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;meaning&quot;]}">
                        <a class='wk-nav__anchor' id='information'></a>
                        <h2 class='subject-section__title'>
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-meaning">
                                <span class="subject-section__toggle-icon">${Icons.customIconTxt("chevron-right")}</span>
                                <span class='subject-section__title-text'>Name</span>
                            </a>
                        </h2>
                        <section id="section-meaning" class="subject-section__content" data-toggle-target="content" hidden="hidden">
                            <section class="subject-section__subsection">
                                <div class='subject-section__meanings'>
                                    <h2 class='subject-section__meanings-title'>Primary</h2>
                                    <p class='subject-section__meanings-items'>${item.info.meanings[0]}</p>
                                </div>
                                ${item.info.meanings?.length > 1 ? `
                                <div class="subject-section__meanings">
                                    <h2 class="subject-section__meanings-title">Alternatives</h2>
                                    <p class="subject-section__meanings-items">${item.info.meanings.slice(1).join(', ')}</p>
                                </div>` : ''}
                                <!--<div class='subject-section__meanings'>
                                    <h2 class='subject-section__meanings-title'>User Synonyms</h2>
                                    <p class='subject-section__meanings-items'><i>User synonyms are currently disabled for custom items.</i></p>
                                </div>-->
                            </section>
                            <section class="subject-section__subsection">
                                <h3 class='subject-section__subtitle'>Mnemonic</h3>
                                <p class="subject-section__text">${explFormat(item.info.meaning_expl) || "This item does not have a meaning explanation. Good luck!"}</p>
                                <!--<aside class="subject-hint">
                                    <h3 class="subject-hint__title">
                                        <i class="subject-hint__title-icon" aria-hidden="true">${Icons.customIconTxt("circle-info")}</i>
                                        <span class="subject-hint__title-text">Hints</span>
                                    </h3>
                                    <p class="subject-hint__text"></p>
                                </aside>-->
                            </section>
                            <section class="subject-section__subsection">
                                <h3 class='subject-section__subtitle'>Note</h3>
                                <p class="subject-section__text"><i>Notes are currently disabled for custom items.</i></p>
                            </section>
                        </section>
                    </section>
    
                    <section class="subject-section subject-section--amalgamations subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[]}">
                        <a class='wk-nav__anchor' id='amalgamations'></a>
                        <h2 class='subject-section__title'>
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-amalgamations">
                                <span class="subject-section__toggle-icon">${Icons.customIconTxt("chevron-right")}</span>
                                <span class='subject-section__title-text'>Found In Kanji</span>
                            </a>
                        </h2>
                        <section id="section-amalgamations" class="subject-section__content" data-toggle-target="content" hidden="hidden">
                            <div class="subject-character-grid">
                                <ol class="subject-character-grid__items">
                                    ${item.info.kanji?.map(k => buildKanjiComponentHTML(k)).join('') || "No found in kanji set."}
                                </ol>
                            </div>
                        </section>
                    </section>
                </div>
            `;
            case "Kanji":
            return /*html*/ `
                <div class="container">
                    <!-- Radical combination -->
                    <section class="subject-section subject-section--components subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;meaning&quot;]}">
                        <h2 class="subject-section__title">
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-components" data-controller-connected="true">
                                <span class="subject-section__toggle-icon" aria-hidden="true">${Icons.customIconTxt("chevron-right")}</span>
                                <span class="subject-section__title-text">Radical Combination</span>
                            </a>
                        </h2>
                        <section id="section-components" class="subject-section__content" data-toggle-target="content">
                            <div class="subject-list subject-list--with-separator">
                                <ul class="subject-list__items">
                                    ${item.info.radicals?.map(k => buildRadicalComponentHTML(k)).join('') || "No radical components set."}
                                </ul>
                            </div>
                        </section>
                    </section>
                    <!-- Meaning -->
                    <section class="subject-section subject-section--meaning subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;meaning&quot;]}">
                        <a class='wk-nav__anchor' id='meaning'></a>
                        <h2 class='subject-section__title'>
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-meaning">
                                <span class="subject-section__toggle-icon">${Icons.customIconTxt("chevron-right")}</span>
                                <span class='subject-section__title-text'>Meaning</span>
                            </a>
                        </h2>
                        <section id="section-meaning" class="subject-section__content" data-toggle-target="content" hidden="hidden">
                            <section class="subject-section__subsection">
                                <div class='subject-section__meanings'>
                                    <h2 class='subject-section__meanings-title'>Primary</h2>
                                    <p class='subject-section__meanings-items'>${item.info.meanings[0]}</p>
                                </div>
                                ${item.info.meanings?.length > 1 ? `
                                <div class="subject-section__meanings">
                                    <h2 class="subject-section__meanings-title">Alternative</h2>
                                    <p class="subject-section__meanings-items">${item.info.meanings.slice(1).join(', ')}</p>
                                </div>` : ''}
                                <!--<div class='subject-section__meanings'>
                                    <h2 class='subject-section__meanings-title'>User Synonyms</h2>
                                    <p class='subject-section__meanings-items'><i>User synonyms are currently disabled for custom items.</i></p>
                                </div>-->
                            </section>
                            <section class="subject-section__subsection">
                                <h3 class='subject-section__subtitle'>Mnemonic</h3>
                                <p class="subject-section__text">${explFormat(item.info.meaning_expl) || "This item does not have a reading explanation. Good luck!"}</p>
                                <!--<aside class="subject-hint">
                                    <h3 class="subject-hint__title">
                                        <i class="subject-hint__title-icon" aria-hidden="true">${Icons.customIconTxt("circle-info")}</i>
                                        <span class="subject-hint__title-text">Hints</span>
                                    </h3>
                                    <p class="subject-hint__text"></p>
                                </aside>-->
                            </section>
                            <section class="subject-section__subsection">
                                <h3 class='subject-section__subtitle'>Note</h3>
                                <p class="subject-section__text"><i>Notes are currently disabled for custom items.</i></p>
                            </section>
                        </section>
                    </section>
                    <!-- Reading -->
                    <section class="subject-section subject-section--reading subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;reading&quot;]}">
                        <a class='wk-nav__anchor' id='reading'></a>
                        <h2 class='subject-section__title'>
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-reading">
                                <span class="subject-section__toggle-icon">${Icons.customIconTxt("chevron-right")}</span>
                                <span class='subject-section__title-text'>Reading</span>
                            </a>
                        </h2>
                        <section id="section-reading" class="subject-section__content" data-toggle-target="content" hidden="hidden">
                            <section class="subject-section__subsection">
                                <div class="subject-readings">
                                    <div class="subject-readings__reading ${item.info.primary_reading_type == "onyomi" ? "subject-readings__reading--primary" : ""}">
                                        <h3 class="subject-readings__reading-title">On’yomi</h3>
                                        <p class="subject-readings__reading-items" lang="ja">
                                            ${item.info?.onyomi?.length > 0 ? item.info.onyomi.join(', ') : "None"}
                                        </p>
                                    </div>
                                    <div class="subject-readings__reading ${item.info.primary_reading_type == "kunyomi" ? "subject-readings__reading--primary" : ""}">
                                        <h3 class="subject-readings__reading-title">Kun’yomi</h3>
                                        <p class="subject-readings__reading-items" lang="ja">
                                            ${item.info?.kunyomi?.length > 0 ? item.info.kunyomi.join(', ') : "None"}
                                        </p>
                                    </div>
                                    <div class="subject-readings__reading ${item.info.primary_reading_type == "nanori" ? "subject-readings__reading--primary" : ""}">
                                        <h3 class="subject-readings__reading-title">Nanori</h3>
                                        <p class="subject-readings__reading-items" lang="ja">
                                            ${item.info?.nanori?.length > 0 ? item.info.nanori.join(', ') : "None"}
                                        </p>
                                    </div>
                                </div>
                            </section>
                            <section class="subject-section__subsection">
                                <h3 class='subject-section__subtitle'>Mnemonic</h3>
                                <p class="subject-section__text">${explFormat(item.info.reading_expl) || "This item does not have a reading explanation. Good luck!"}</p>
                                <!--<aside class="subject-hint">
                                    <h3 class="subject-hint__title">
                                        <i class="subject-hint__title-icon" aria-hidden="true">${Icons.customIconTxt("circle-info")}</i>
                                        <span class="subject-hint__title-text">Hints</span>
                                    </h3>
                                    <p class="subject-hint__text"></p>
                                </aside>-->
                            </section>
                            <section class="subject-section__subsection">
                                <h3 class='subject-section__subtitle'>Note</h3>
                                <p class="subject-section__text"><i>Notes are currently disabled for custom items.</i></p>
                            </section>
                        </section>
                    </section>
                    <!-- Found in vocabulary -->
                    <section class="subject-section subject-section--amalgamations subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[]}">
                        <a class="wk-nav__anchor" id="amalgamations"></a>
                        <h2 class="subject-section__title">
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-amalgamations" data-controller-connected="true">
                                <span class="subject-section__toggle-icon" aria-hidden="true">${Icons.customIconTxt("chevron-right")}</span>
                                <span class="subject-section__title-text">Found In Vocabulary</span>
                            </a>
                        </h2>
                        <section id="section-amalgamations" class="subject-section__content" data-toggle-target="content">
                            <div class="subject-character-grid subject-character-grid--single-column">
                                <ol class="subject-character-grid__items">
                                    <!--<li class="subject-character-grid__item">
                                        <a class="subject-character subject-character--vocabulary subject-character--grid subject-character--burned" title="うち" href="https://www.wanikani.com/vocabulary/%E5%86%85" data-turbo-frame="_blank">
                                            <div class="subject-character__content">
                                                <span class="subject-character__characters" lang="ja">内</span>
                                                <div class="subject-character__info">
                                                    <span class="subject-character__reading">うち</span>
                                                    <span class="subject-character__meaning">Inside</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>-->
                                </ol>
                            </div>
                        </section>
                    </section>
                </div>
            `;
            case "Vocabulary":
            return /*html*/ `
                <div class="container">
                    <!-- Meaning -->
                    <section class="subject-section subject-section--meaning subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;meaning&quot;]}">
                        <a class='wk-nav__anchor' id='meaning'></a>
                        <h2 class='subject-section__title'>
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-meaning">
                                <span class="subject-section__toggle-icon">${Icons.customIconTxt("chevron-right")}</span>
                                <span class='subject-section__title-text'>Meaning</span>
                            </a>
                        </h2>
                        <section id="section-meaning" class="subject-section__content" data-toggle-target="content" hidden="hidden">
                            <section class="subject-section__subsection">
                                <div class='subject-section__meanings'>
                                    <h2 class='subject-section__meanings-title'>Primary</h2>
                                    <p class='subject-section__meanings-items'>${item.info.meanings[0]}</p>
                                </div>
                                ${item.info.meanings?.length > 1 ? `
                                <div class="subject-section__meanings">
                                    <h2 class="subject-section__meanings-title">Alternatives</h2>
                                    <p class="subject-section__meanings-items">${item.info.meanings.slice(1).join(', ')}</p>
                                </div>` : ''}
                                <!--<div class='subject-section__meanings'>
                                    <h2 class='subject-section__meanings-title'>User Synonyms</h2>
                                    <p class='subject-section__meanings-items'><i>User synonyms are currently disabled for custom items.</i></p>
                                </div>-->
                                ${item.info.func ? `<div class="subject-section__meanings">
                                    <h2 class="subject-section__meanings-title">Word Type</h2>
                                    <p class="subject-section__meanings-items">${item.info.func}</p>
                                </div>` : ''}
                            </section>
                            <section class="subject-section__subsection">
                                <h3 class='subject-section__subtitle'>Explanation</h3>
                                <p class="subject-section__text">${explFormat(item.info.meaning_expl) || "This item does not have a meaning explanation. Good luck!"}</p>
                                <!--<aside class="subject-hint">
                                    <h3 class="subject-hint__title">
                                        <i class="subject-hint__title-icon" aria-hidden="true">${Icons.customIconTxt("circle-info")}</i>
                                        <span class="subject-hint__title-text">Hints</span>
                                    </h3>
                                    <p class="subject-hint__text"></p>
                                </aside>-->
                            </section>
                            <section class="subject-section__subsection">
                                <h3 class='subject-section__subtitle'>Note</h3>
                                <p class="subject-section__text"><i>Notes are currently disabled for custom items.</i></p>
                            </section>
                        </section>
                    </section>
                    <!-- Reading -->
                    <section class="subject-section subject-section--reading subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;reading&quot;]}">
                        <a class='wk-nav__anchor' id='reading'></a>
                        <h2 class='subject-section__title'>
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-reading">
                                <span class="subject-section__toggle-icon">${Icons.customIconTxt("chevron-right")}</span>
                                <span class='subject-section__title-text'>Reading</span>
                            </a>
                        </h2>
                        <section id="section-reading" class="subject-section__content" data-toggle-target="content" hidden="hidden">
                            <section class="subject-section__subsection">
                                <div class="subject-readings-with-audio">
                                    <div class="subject-readings-with-audio__item">
                                        <div class="reading-with-audio">
                                            <div class="reading-with-audio__reading" lang='ja'>${item.info.readings[0]}</div>
                                            <ul class="reading-with-audio__audio-items">
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section class="subject-section__subsection">
                                <h3 class='subject-section__subtitle'>Explanation</h3>
                                <p class="subject-section__text">${explFormat(item.info.reading_expl) || "This item does not have a reading explanation. Good luck!"}</p>
                                <!--<aside class="subject-hint">
                                    <h3 class="subject-hint__title">
                                        <i class="subject-hint__title-icon" aria-hidden="true">${Icons.customIconTxt("circle-info")}</i>
                                        <span class="subject-hint__title-text">Hints</span>
                                    </h3>
                                    <p class="subject-hint__text"></p>
                                </aside>-->
                            </section>
                            <section class="subject-section__subsection">
                                <h3 class='subject-section__subtitle'>Note</h3>
                                <p class="subject-section__text"><i>Notes are currently disabled for custom items.</i></p>
                            </section>
                        </section>
                    </section>
                    <!-- Context -->
                    <section class="subject-section subject-section--context subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;meaning&quot;]}">
                        <a class="wk-nav__anchor" id="context"></a>
                        <h2 class="subject-section__title">
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-context" data-controller-connected="true">
                                <span class="subject-section__toggle-icon" aria-hidden="true">${Icons.customIconTxt("chevron-right")}</span>
                                <span class="subject-section__title-text">Context</span>
                            </a>
                        </h2>
                        <section id="section-context" class="subject-section__content" data-toggle-target="content">
                            <!--<section class="subject-section__subsection">
                                <div class="subject-collocations" data-controller="tabbed-content" data-tabbed-content-next-tab-hotkey-value="s" data-tabbed-content-previous-tab-hotkey-value="w" data-hotkey-registered="true">
                                    <div class="subject-collocations__patterns">
                                        <h3 class="subject-collocations__title subject-collocations__title--patterns">Pattern of Use</h3>
                                        <div class="subject-collocations__pattern-names">
                                            <a class="subject-collocations__pattern-name" data-tabbed-content-target="tab" data-action="tabbed-content#changeTab" aria-controls="collocations-710736400-0" aria-selected="true" role="tab" lang="ja" href="#collocations-710736400-0">農業を〜</a>
                                        </div>
                                    </div>
                                    <div class="subject-collocations__collocations">
                                        <h3 class="subject-collocations__title">Common Word Combinations</h3>
                                        <ul class="subject-collocations__pattern-collocations">
                                            <li class="subject-collocations__pattern-collocation" id="collocations-710736400-0" data-tabbed-content-target="content" role="tabpanel">
                                                <div class="context-sentences">
                                                    <p class="wk-text" lang="ja">農業を行う</p>
                                                    <p class="wk-text">to carry out farming</p>
                                                </div>
                                            </li>      
                                        </ul>
                                    </div>
                                </div>
                            </section>-->
                            <section class="subject-section__subsection">
                                <h3 class="subject-section__subtitle">Context Sentences</h3>
                                ${item.info.ctx_jp ? buildContextSentencesHTML(item.info.ctx_jp, item.info.ctx_en) : "No context sentences set."}
                            </section>
                        </section>
                    </section>
                    <!-- Kanji Composition -->
                    <section class="subject-section subject-section--components subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[]}">
                        <a class="wk-nav__anchor" id="components"></a>
                        <h2 class="subject-section__title">
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-components" data-controller-connected="true">
                                <span class="subject-section__toggle-icon" aria-hidden="true">${Icons.customIconTxt("chevron-right")}</span>
                                <span class="subject-section__title-text">Kanji Composition</span>
                            </a>
                        </h2>
                        <section id="section-components" class="subject-section__content" data-toggle-target="content">
                            <div class="subject-character-grid">
                                <ol class="subject-character-grid__items">
                                    ${item.info.kanji?.map(k => buildKanjiComponentHTML(k)).join('') || "No kanji components set."}
                                </ol>
                            </div>
                        </section>
                    </section>
                </div>
            `;
            case "KanaVocabulary":
            return /*html*/ `
                <div class="container">
                    <!-- Meaning -->
                    <section class="subject-section subject-section--meaning subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;meaning&quot;]}">
                        <a class='wk-nav__anchor' id='meaning'></a>
                        <h2 class='subject-section__title'>
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-meaning">
                                <span class="subject-section__toggle-icon">${Icons.customIconTxt("chevron-right")}</span>
                                <span class='subject-section__title-text'>Meaning</span>
                            </a>
                        </h2>
                        <section id="section-meaning" class="subject-section__content" data-toggle-target="content" hidden="hidden">
                            <section class="subject-section__subsection">
                                <div class='subject-section__meanings'>
                                    <h2 class='subject-section__meanings-title'>Primary</h2>
                                    <p class='subject-section__meanings-items'>${item.info.meanings[0]}</p>
                                </div>
                                ${item.info.meanings?.length > 1 ? `
                                <div class="subject-section__meanings">
                                    <h2 class="subject-section__meanings-title">Alternatives</h2>
                                    <p class="subject-section__meanings-items">${item.info.meanings.slice(1).join(', ')}</p>
                                </div>` : ''}
                                <!--<div class='subject-section__meanings'>
                                    <h2 class='subject-section__meanings-title'>User Synonyms</h2>
                                    <p class='subject-section__meanings-items'><i>User synonyms are currently disabled for custom items.</i></p>
                                </div>-->
                                ${item.info.func ? `<div class="subject-section__meanings">
                                    <h2 class="subject-section__meanings-title">Word Type</h2>
                                    <p class="subject-section__meanings-items">${item.info.func}</p>
                                </div>` : ''}
                            </section>
                            <section class="subject-section__subsection">
                                <h3 class='subject-section__subtitle'>Explanation</h3>
                                <p class="subject-section__text">${explFormat(item.info.meaning_expl) || "This item does not have a meaning explanation. Good luck!"}</p>
                                <!--<aside class="subject-hint">
                                    <h3 class="subject-hint__title">
                                        <i class="subject-hint__title-icon" aria-hidden="true">${Icons.customIconTxt("circle-info")}</i>
                                        <span class="subject-hint__title-text">Hints</span>
                                    </h3>
                                    <p class="subject-hint__text"></p>
                                </aside>-->
                            </section>
                            <section class="subject-section__subsection">
                                <h3 class='subject-section__subtitle'>Note</h3>
                                <p class="subject-section__text"><i>Notes are currently disabled for custom items.</i></p>
                            </section>
                        </section>
                    </section>
                    <!-- Pronunciation -->
                    <section class="subject-section subject-section--reading subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;reading&quot;]}">
                        <a class='wk-nav__anchor' id='reading'></a>
                        <h2 class='subject-section__title'>
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-reading">
                                <span class="subject-section__toggle-icon">${Icons.customIconTxt("chevron-right")}</span>
                                <span class='subject-section__title-text'>Pronunciation</span>
                            </a>
                        </h2>
                        <section id="section-reading" class="subject-section__content" data-toggle-target="content" hidden="hidden">
                            <section class="subject-section__subsection">
                                <div class="subject-readings-with-audio">
                                    <div class="subject-readings-with-audio__item">
                                        <div class="reading-with-audio">
                                            <div class="reading-with-audio__reading" lang='ja'>${item.info.readings ? item.info.readings[0] : item.info.characters}</div>
                                            <ul class="reading-with-audio__audio-items">
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </section>
                    <!-- Context -->
                    <section class="subject-section subject-section--context subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;meaning&quot;]}">
                        <a class="wk-nav__anchor" id="context"></a>
                        <h2 class="subject-section__title">
                            <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-context" data-controller-connected="true">
                                <span class="subject-section__toggle-icon" aria-hidden="true">${Icons.customIconTxt("chevron-right")}</span>
                                <span class="subject-section__title-text">Context</span>
                            </a>
                        </h2>
                        <section id="section-context" class="subject-section__content" data-toggle-target="content">
                            <!--<section class="subject-section__subsection">
                                <div class="subject-collocations" data-controller="tabbed-content" data-tabbed-content-next-tab-hotkey-value="s" data-tabbed-content-previous-tab-hotkey-value="w" data-hotkey-registered="true">
                                    <div class="subject-collocations__patterns">
                                        <h3 class="subject-collocations__title subject-collocations__title--patterns">Pattern of Use</h3>
                                        <div class="subject-collocations__pattern-names">
                                            <a class="subject-collocations__pattern-name" data-tabbed-content-target="tab" data-action="tabbed-content#changeTab" aria-controls="collocations-710736400-0" aria-selected="true" role="tab" lang="ja" href="#collocations-710736400-0">農業を〜</a>
                                        </div>
                                    </div>
                                    <div class="subject-collocations__collocations">
                                        <h3 class="subject-collocations__title">Common Word Combinations</h3>
                                        <ul class="subject-collocations__pattern-collocations">
                                            <li class="subject-collocations__pattern-collocation" id="collocations-710736400-0" data-tabbed-content-target="content" role="tabpanel">
                                                <div class="context-sentences">
                                                    <p class="wk-text" lang="ja">農業を行う</p>
                                                    <p class="wk-text">to carry out farming</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>-->
                            <section class="subject-section__subsection">
                                <h3 class="subject-section__subtitle">Context Sentences</h3>
                                ${item.info.ctx_jp ? buildContextSentencesHTML(item.info.ctx_jp, item.info.ctx_en) : "No context sentences set."}
                            </section>
                        </section>
                    </section>
                </div>
            `;
        }
    }

    function makeDetailsHTMLConjugation(item, extraDetails) {
        let [ , , conjName, conjDesc, conjCtx] = extraDetails;
        return /*html*/ `
            <div class="container">
                <section class="subject-section subject-section--reading subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;reading&quot;]}">
                    <a class='wk-nav__anchor' id='information'></a>
                    <h2 class='subject-section__title'>
                        <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-meaning">
                            <span class="subject-section__toggle-icon">${Icons.customIconTxt("chevron-right")}</span>
                            <span class='subject-section__title-text'>Conjugation Info</span>
                        </a>
                    </h2>
                    <section id="section-reading" class="subject-section__content" data-toggle-target="content" hidden="hidden">
                        <section class="subject-section__subsection">
                            <div class='subject-section__meanings'>
                                <h2 class='subject-section__meanings-title'>Conjugated</h2>
                                <div class="subject-section__meanings-items" lang='ja'>${item.readings[0].text}</div>
                            </div>
                            <div class='subject-section__meanings'>
                                <h2 class='subject-section__meanings-title'>Conjugation</h2>
                                <p class='subject-section__meanings-items'>${conjName} form</p>
                            </div>
                            <div class="subject-section__meanings">
                                <h2 class="subject-section__meanings-title">Verb Type</h2>
                                <p class="subject-section__meanings-items">${item.verbType.charAt(0).toUpperCase() + item.verbType.slice(1)}</p>
                            </div>
                        </section>
                        <section class="subject-section__subsection">
                            <h3 class='subject-section__subtitle'>Explanation</h3>
                            <p class="subject-section__text">${conjDesc}</p>
                        </section>
                        <section class="subject-section__subsection">
                            <h3 class='subject-section__subtitle'>Info</h3>
                            <p class="subject-section__text"><i>This is one of many "conjugations" for this verb. Depending on the type of verb, we remove or modify the last kana and then append the ending corresponding to this conjugation.</i></p>
                        </section>
                    </section>
                </section>

                <section class="subject-section subject-section--amalgamations subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;reading&quot;]}">
                    <a class='wk-nav__anchor' id='amalgamations'></a>
                    <h2 class='subject-section__title'>
                        <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-amalgamations">
                            <span class="subject-section__toggle-icon">${Icons.customIconTxt("chevron-right")}</span>
                            <span class='subject-section__title-text'>Verb Details</span>
                        </a>
                    </h2>
                    <section id="section-amalgamations" class="subject-section__content" data-toggle-target="content" hidden="hidden">
                        <div class="subject-character-grid subject-character-grid--single-column">
                            <ol class="subject-character-grid__items">
                                ${buildVocabComponentHTML(item)}
                            </ol>
                        </div>
                    </section>
                </section>

                <section class="subject-section subject-section--context subject-section--collapsible" data-controller="toggle" data-toggle-context-value="{&quot;auto_expand_question_types&quot;:[&quot;reading&quot;]}">
                    <a class="wk-nav__anchor" id="context"></a>
                    <h2 class="subject-section__title">
                        <a class="subject-section__toggle" data-toggle-target="toggle" data-action="toggle#toggle" aria-expanded="false" aria-controls="section-context">
                            <span class="subject-section__toggle-icon">${Icons.customIconTxt("chevron-right")}</span>
                            <span class="subject-section__title-text">Context Sentences</span>
                        </a>
                    </h2>
                    <section id="section-context" class="subject-section__content" data-toggle-target="content">
                        <section class="subject-section__subsection">
                            <h3 class="subject-section__subtitle">Context Sentences</h3>
                            ${conjCtx ? buildContextSentencesHTML(conjCtx[0], conjCtx[1]) : "No context sentences set."}
                        </section>
                    </section>
                </section>
            </div>
        `;
    }
}
const a = "UFRYcVJzRWlKMnQyUkIyRXphMk53YXAxcjlOUw==";

// ********** D:\USERS\LIBRARIES\DOCUMENTS\GITHUB\WANIKANI-CUSTOM-SRS\TYPES.JS **********
const srsGaps = [0, 4*60*60*1000, 8*60*60*1000, 23*60*60*1000, 47*60*60*1000, 167*60*60*1000, 335*60*60*1000, 730*60*60*1000, 2920*60*60*1000];
srsGaps["0.5"] = 0; // 0.5 stage for immediate review after lesson

class CustomItem {
    // Root variables
    id;
    last_reviewed_at = 0;

    // Item main info. Should always contain at least: 
    // type (KanaVocabulary, Vocabulary, Kanji, Radical), category (Vocabulary, Kanji, Radical), characters, meanings
    // Optional: meaning_expl, lvl, meaning_wl, meaning_bl, srs_lvl
    //
    // Radicals: --
    // Kanji: primary_reading_type, minimum one of (onyomi, kunyomi, nanori) || Optional: reading_expl, radicals
    // Vocabulary: readings || Optional: ctx_jp, ctx_en, reading_expl, kanji, reading_wl, reading_bl, func
    // KanaVocabulary: || Optional: readings, crx_jp, ctx_en, func
    info;

    constructor(id, info) {
        this.id = id;
        this.info = info;
        this.last_reviewed_at = 0;
        if(!this.info.srs_lvl) this.info.srs_lvl = 0;
    }

    isReadyForReview() {
        if(this.info.srs_lvl > 0 && this.last_reviewed_at < Date.now() - srsGaps[this.info.srs_lvl]) return true;
        return false;
    }
    isReadyForLesson(levelingType, level, packID, details = false) { // levelingType: none, internal, wk
        if(this.info.srs_lvl == 0) {
            if(CustomSRSSettings.userSettings.lockByDependency && ((this.info.type == "Vocabulary" && this.info.kanji) || (this.info.type == "Kanji" && this.info.radicals))) {
                for(let component of (this.info.type == "Vocabulary" ? this.info.kanji : this.info.radicals)) {
                    if(component.pack != null) {
                        if(component.pack != -1 && activePackProfile.customPacks[packID].getItem(component.id).info.srs_lvl < 4) return (details ? -2 : false);
                        else if(component.pack == -1 && component.lvl && component.lvl > CustomSRSSettings.userSettings.lastKnownLevel) return (details ? -2 : false);
                    }
                }
            }
            if(levelingType == "none") return true;
            else if(levelingType == "internal" && (!this.info.lvl || level >= this.info.lvl)) return true;
            else if(levelingType == "wk" && (!this.info.lvl || CustomSRSSettings.userSettings.lastKnownLevel >= this.info.lvl)) return true;
        } else return (details ? -1 : false);
    }
    getTimeUntilReview(levelingType, level, packID) { // In hours, rounded to integer
        const lessonStatus = this.isReadyForLesson(levelingType, level, packID, true);
        if(lessonStatus == true) return "Lesson";
        else if(lessonStatus == -2) return "Locked";
        else if(this.isReadyForReview()) return "Now";
        else {
            if(this.info.srs_lvl == 9) return "Burned";
            else if((levelingType == "internal" && this.info.lvl && level < this.info.lvl) || (levelingType == "wk" && this.info.lvl && this.info.srs_lvl == 0 && CustomSRSSettings.userSettings.lastKnownLevel < this.info.lvl)) return "Locked";
            else return Math.round((srsGaps[this.info.srs_lvl] - (Date.now() - this.last_reviewed_at)) / (60*60*1000)) + "h";
        }
    }

    incrementSRS() {
        if(this.info.srs_lvl == 0) this.info.srs_lvl = 0.5;
        else if(this.info.srs_lvl == 0.5) this.info.srs_lvl = 1;
        else if(this.info.srs_lvl < 9) this.info.srs_lvl++;
        this.last_reviewed_at = Date.now();
        StorageManager.savePackProfile(activePackProfile, "main");
    }
    decrementSRS() {
        if(this.info.srs_lvl > 1) {
            if(this.info.srs_lvl < 5) this.info.srs_lvl--;
            else this.info.srs_lvl -= 2;
        }
        this.last_reviewed_at = Date.now();
        StorageManager.savePackProfile(activePackProfile, "main");
    }
    getSRS(packID) {
        return [Utils.cantorNumber(packID, this.id), parseInt(this.info.srs_lvl), 1];
    }
    burnItem() {
        this.info.srs_lvl = 9;
        this.last_reviewed_at = Date.now();
        StorageManager.savePackProfile(activePackProfile, "main");
    }

    getQueueItem(packID) {
        const preparedReadings = []
        if(this.info.reading_wl) preparedReadings.push(...this.info.reading_wl.map(reading => ({"text": reading, "kind": "allowed"})));
        if(this.info.reading_bl) preparedReadings.push(...this.info.reading_bl.map(reading => ({"text": reading, "kind": "blocked"})));

        const preparedMeanings = this.info.meanings.map(meaning => ({"text": meaning, "kind": "primary"}));
        if(this.info.meaning_wl) preparedMeanings.push(...this.info.meaning_wl.map(m => ({"text": m, "kind": "allowed"})));
        if(this.info.meaning_bl) preparedMeanings.push(...this.info.meaning_bl.map(m => ({"text": m, "kind": "blocked"})));

        switch(this.info.type) {
            case "Radical":
                return {
                    id: Utils.cantorNumber(packID, this.id),
                    type: this.info.type,
                    subject_category: this.info.category,
                    characters: this.info.characters,
                    meanings: preparedMeanings,
                    kanji: this.info.kanji || []
                };
            case "Kanji":
                if(this.info.onyomi) preparedReadings.push(...this.info.onyomi.map(reading => ({"text": reading, "type": "onyomi", "kind": (this.info.primary_reading_type == "onyomi" ? "primary" : "alternative")})));
                if(this.info.kunyomi) preparedReadings.push(...this.info.kunyomi.map(reading => ({"text": reading, "type": "kunyomi", "kind": (this.info.primary_reading_type == "kunyomi" ? "primary" : "alternative")})));
                if(this.info.nanori) preparedReadings.push(...this.info.nanori.map(reading => ({"text": reading, "type": "nanori", "kind": (this.info.primary_reading_type == "nanori" ? "primary" : "alternative")})));
                return {
                    id: Utils.cantorNumber(packID, this.id),
                    type: this.info.type,
                    subject_category: this.info.category,
                    characters: this.info.characters,
                    meanings: preparedMeanings,
                    primary_reading_type: this.info.primary_reading_type,
                    readings: preparedReadings,
                    radicals: this.info.radicals || [],
                    vocabulary: this.info.vocabulary || []
                };
            case "Vocabulary":
                preparedReadings.push(...this.info.readings.map(reading => ({"text": reading, "kind": "primary", "pronunciations": []})));
                return {
                    id: Utils.cantorNumber(packID, this.id),
                    type: this.info.type,
                    subject_category: this.info.category,
                    characters: this.info.characters,
                    meanings: preparedMeanings,
                    readings: preparedReadings,
                    kanji: this.info.kanji || []
                };
            case "KanaVocabulary":
                preparedReadings.push(...(this.info.readings ? this.info.readings.map(reading => ({"text": reading, "kind": "primary", "pronunciations": []})) : [{"text": this.info.characters, "kind": "primary", "pronunciations": []}]));
                return {
                    id: Utils.cantorNumber(packID, this.id),
                    type: this.info.type,
                    subject_category: this.info.category,
                    characters: this.info.characters,
                    meanings: preparedMeanings,
                    readings: preparedReadings
                };
        }
    }

    static fromObject(object) {
        try {
            let item = new CustomItem(object.id, object.info);
            if(object.last_reviewed_at) item.last_reviewed_at = object.last_reviewed_at;
            item.runFixer();
            return item;
        } catch(e) {
            alert("Error loading item, please let me know what error you're getting (unless you haven't used this script since it was first released): " + e);
            if(confirm("Clear all custom SRS data to fix this issue? (should only be necessary if you haven't used the script since it was first released, otherwise message me on WK forum)")) {
                StorageManager.deletePackProfile("main");
            }
            return null;
        }
    }

    runFixer() {
        // Backwards compatibility fixes
        if(this.info.context_sentences) { // Convert context_sentences to ctx_jp and ctx_en
            for(let i = 0; i < this.info.context_sentences.length; i++) {
                this.info.ctx_jp = [];
                this.info.ctx_en = [];
                if(i % 2 == 0) this.info.ctx_jp.push(this.info.context_sentences[i]);
                else this.info.ctx_en.push(this.info.context_sentences[i]);
            }
            delete this.info.context_sentences;
        }

        // Optimizations
        if(this.info.type == "KanaVocabulary" && this.info.readings?.length == 1 && this.info.readings[0] == this.info.characters) delete this.info.readings;
    }
}

class CustomItemPack {
    name;
    author;
    version;
    items = [];
    active = true;
    nextID = 0;
    lvlType = "none"; // "none", "internal", "wk"
    lvl = 1;

    constructor(name, author, version, lvlType, lvl = 1) {
        this.name = name;
        this.author = author;
        this.version = version;
        this.lvlType = lvlType;
        this.lvl = lvl;
    }

    getItem(id) {
        return this.items.find(item => item.id === id);
    }
    getItemID(itemType, itemChar) {
        let item = this.items.find(item => item.info.characters === itemChar && item.info.type === itemType);
        if(item) return item.id;
        else return null;
    }
    addItem(itemInfo) {
        let id = this.nextID++;
        let item = new CustomItem(id, itemInfo);
        this.items.push(item);
    }
    editItem(id, itemInfo) {
        let item = this.getItem(id);
        delete item.info;
        item.info = itemInfo;    
    }

    removeItem(position) {
        this.items.splice(position, 1);
    }

    getActiveReviews(packID) { // Get all items that were last reviewed more than 24 hours ago
        if(!this.active) return [];
        return this.items.filter(item => item.isReadyForReview()).map(item => item.getQueueItem(packID));
    }
    getActiveLessons(packID) {
        if(!this.active) return [];
        return this.items.filter(item => item.isReadyForLesson(this.lvlType, this.lvl, packID)).map(item => item.getQueueItem(packID));
    }
    getActiveReviewsSRS(packID) {
        if(!this.active) return [];
        return this.items.filter(item => item.isReadyForReview()).map(item => item.getSRS(packID));
    }
    getNumActiveReviews() {
        if(!this.active) return 0;
        let num = 0;
        for(let item of this.items) {
            if(item.isReadyForReview()) num++;
        }
        return num;
    }
    getNumActiveLessons(packID) {
        if(!this.active) return 0;
        let num = 0;
        for(let item of this.items) {
            if(item.isReadyForLesson(this.lvlType, this.lvl, packID)) num++;
        }
        return num;
    }
    getItemTimeUntilReview(itemIndex, packID) {
        return this.items[itemIndex].getTimeUntilReview(this.lvlType, this.lvl, packID);
    }

    getProgressHTML() {
        if(!this.active) return;
        let progressByLevel = {};
        this.items.forEach(item => {
            if(this.lvlType == "none" || !item.info.lvl) {
                if(!progressByLevel["noLevel"]) progressByLevel["noLevel"] = [];
                if(item.info.srs_lvl > 4) progressByLevel["noLevel"][5] = (progressByLevel["noLevel"][5] || 0) + 1;
                else progressByLevel["noLevel"][item.info.srs_lvl] = (progressByLevel["noLevel"][item.info.srs_lvl] || 0) + 1;
                progressByLevel["noLevel"][6] = (progressByLevel["noLevel"][6] || 0) + 1;
            } else if(this.lvlType == "internal" && item.info.lvl > this.lvl) progressByLevel["locked"] = (progressByLevel["locked"] || 0) + 1;
            else if(this.lvlType == "wk" && item.info.lvl > CustomSRSSettings.userSettings.lastKnownLevel) progressByLevel["locked"] = (progressByLevel["locked"] || 0) + 1;
            else {
                if(!progressByLevel[item.info.lvl]) progressByLevel[item.info.lvl] = [];
                if(item.info.srs_lvl > 4) progressByLevel[item.info.lvl][5] = (progressByLevel[item.info.lvl][5] || 0) + 1;
                else progressByLevel[item.info.lvl][item.info.srs_lvl] = (progressByLevel[item.info.lvl][item.info.srs_lvl] || 0) + 1;
                progressByLevel[item.info.lvl][6] = (progressByLevel[item.info.lvl][6] || 0) + 1;
            }
        });
        let progressHTML = "";
        for(let level in progressByLevel) {
            if(level != "locked") {
                progressHTML += "<p>Level " + (level == "noLevel" ? "--" : level) + "</p><div class='progress-bar'>";
                for(let i = 5; i > 0; i--) {
                    progressHTML += "<div style='width: " + (progressByLevel[level][i] || 0) / progressByLevel[level][6]*100 + "%' title='" + (i == 5 ? "Guru+" : srsNames[i]) + " (" + progressByLevel[level][i] + "/" + progressByLevel[level][6] + ")'></div>";
                }
                progressHTML += "</div>";
            }
        }
        return progressHTML;
    }


    static fromObject(object) {
        let pack = new CustomItemPack(object.name, object.author, object.version, (object.lvlType || "none"), (object.lvl || 1)); // TODO: Remove lvlType and lvl checks after a few weeks
        pack.items = object.items.map(item => CustomItem.fromObject(item));
        pack.active = object.active;
        pack.nextID = (object.nextID || pack.items.length); // If lastID is not present, use the length of the items array
        return pack;
    }
}

class CustomPackProfile {
    customPacks = [];

    getPack(id) {
        return this.customPacks[id];
    }
    addPack(newPack) {
        this.customPacks.push(newPack);
    }
    removePack(id) {
        this.customPacks.splice(id, 1);
    }

    doesPackExist(packName, packAuthor, packVersion) {
        for(let i = 0; i < this.customPacks.length; i++) {
            let pack = this.customPacks[i];
            if(pack.name === packName && pack.author === packAuthor) {
                if(pack.version === packVersion) return "exists";
                else return i;
            }
        }
        return "no";
    }
    updatePack(id, newPack) { // Update pack but keeping the SRS stages of items that are in both the old and new pack
        let oldPack = this.customPacks[id];
        newPack = StorageManager.packFromJSON(newPack);
        for(let i = 0; i < newPack.items.length; i++) {
            let newItem = newPack.items[i];
            let oldItem = oldPack.items.find(item => item.id === newItem.id);
            if(oldItem) {
                newItem.info.srs_lvl = oldItem.info.srs_lvl;
                newItem.last_reviewed_at = oldItem.last_reviewed_at;
            }
        }
        this.customPacks[id] = newPack;
    }

    getActiveReviews() {
        let activeReviews = [];
        for(let i = 0; i < this.customPacks.length; i++) {
            activeReviews.push(...this.customPacks[i].getActiveReviews(i));
        }
        return activeReviews;
    }
    getActiveLessons() {
        let activeLessons = [];
        for(let i = 0; i < this.customPacks.length; i++) {
            activeLessons.push(...this.customPacks[i].getActiveLessons(i));
        }
        return activeLessons;
    }
    getNumActiveReviews() {
        return this.customPacks.reduce((acc, pack) => acc + pack.getNumActiveReviews(), 0);
    }
    getNumActiveLessons() {
        return this.customPacks.reduce((acc, pack, index) => acc + pack.getNumActiveLessons(index), 0);
    }
    getActiveReviewsSRS() {
        let activeReviewsSRS = [];
        for(let i = 0; i < this.customPacks.length; i++) {
            activeReviewsSRS.push(...this.customPacks[i].getActiveReviewsSRS(i));
        }
        return activeReviewsSRS;
    }

    getSubjectInfo(cantorNum) { // Get details of custom item for review page details display
        let [packID, itemID] = Utils.reverseCantorNumber(cantorNum);
        let item = this.getPack(packID).getItem(itemID);
        return makeDetailsHTML(item);
    }

    submitReview(cantorNum, meaningIncorrectNum, readingIncorrectNum) {
        let [packID, itemID] = Utils.reverseCantorNumber(cantorNum);
        let item = this.customPacks[packID].getItem(itemID);
        if((meaningIncorrectNum > 0 || readingIncorrectNum > 0) && item.info.srs_lvl >= 1) {
            item.decrementSRS();
        } else {
            item.incrementSRS();
            this.checkPackLevelUp(packID);
        }
    }
    burnItem(cantorNum) {
        let [packID, itemID] = Utils.reverseCantorNumber(cantorNum);
        let item = this.customPacks[packID].getItem(itemID);
        item.burnItem();
    }
    deleteItem(cantorNum) {
        let [packID, itemID] = Utils.reverseCantorNumber(cantorNum);
        this.customPacks[packID].removeItem(itemID);
        this.checkPackLevelUp(packID);
        StorageManager.savePackProfile(this, "main");
    }

    checkPackLevelUp(packID) {
        let pack = this.customPacks[packID];
        if(pack.lvlType == "internal") {
            for(let item of pack.items) {
                if(item.info.lvl && item.info.lvl <= pack.lvl && item.info.srs_lvl < 5) return;
            }
            pack.lvl++;
            StorageManager.savePackProfile(this, "main");
            StorageManager.needsPushSync = true;
        }
    }

    static fromObject(object) {
        let packProfile = new CustomPackProfile();
        packProfile.customPacks = object.customPacks.map(pack => CustomItemPack.fromObject(pack));
        return packProfile;
    }
}

const b = "Z3F0ZWZlZzZnc" + String.fromCharCode(time) + "I2NHNwaGxhdDJxaWFvNDdrdmxtaTY=";

// ------------------- Conjugations -------------------
class Conjugations {
    static verbIDs;
    static levelVerbCount;
    static activeQueue;
    static rootEnds = [
        ["わ", "か", "さ", "た", "な", "ば", "ま", "ら", "が"],
        ["い", "き", "し", "ち", "に", "び", "み", "り", "ぎ"],
        ["う", "く", "す", "つ", "ぬ", "ぶ", "む", "る", "ぐ"],
        ["え", "け", "せ", "て", "ね", "べ", "め", "れ", "げ"],
        ["お", "こ", "そ", "と", "の", "ぼ", "も", "ろ", "ご"],
        ["って", "いて", "して", "って", "んで", "んで", "んで", "って", "いで"],
        ["った", "いた", "した", "った", "んだ", "んだ", "んだ", "った", "いだ"]
    ];
    static conjugations = { // Name : [godan kana row, general ending, pretty name, explanation, ichidan ending {optional}]
        "te": [5, "て", "-te", "This is the te-form of the verb, used for connecting the verb to a word or clause that follows it. See more info <a href='https://www.tofugu.com/japanese-grammar/te-form/'>here</a>.", [["走ってシャワーをする", "寝不足でフラフラだ。"], ["I run and shower.", "I didn't sleep well, so I'm dizzy."]]],
        "ta": [6, "た", "past", "This is the ta-form of the verb, used for past tense. See more info <a href='https://www.tofugu.com/japanese-grammar/verb-past-ta-form/'>here</a>.", [["本を買った。", "昨日は雨だった。"], ["I bought a book.", "Yesterday was rainy."]]],
        "masu": [1, "ます", "formal", "This is the present/future keigo form of the verb, used in polite speech. See more info <a href='https://www.tofugu.com/japanese-grammar/masu/'>here</a>.", [["飲みます"], ["I drink."]]],
        "mashita": [1, "ました", "past formal", "This is the past keigo form of the verb, used in polite speech. See more info <a href='https://www.tofugu.com/japanese-grammar/masu/'>here</a>.", [["飲みました"], ["I drank."]]],
        "masen": [1, "ません", "negative formal", "This is the negative keigo form of the verb, used in polite speech. See more info <a href='https://www.tofugu.com/japanese-grammar/masu/'>here</a>.", [["飲みません"], ["I don't drink."]]],
        "masendeshita": [1, "ませんでした", "past negative formal", "This is the negative past keigo form of the verb, used in polite speech. See more info <a href='https://www.tofugu.com/japanese-grammar/masu/'>here</a>.", [["飲みませんでした"], ["I didn't drink."]]],
        "tai": [1, "たい", "'want'", "This is the 'want to do' form of the verb. See more info <a href='https://www.tofugu.com/japanese-grammar/tai-form/'>here</a>.", [["飲みたい"], ["I want to drink."]]],
        "nai": [0, "ない", "negative", "This is the standard negative form of the verb. See more info <a href='https://www.tofugu.com/japanese-grammar/verb-negative-nai-form/'>here</a>.", [["飲まない"], ["I don't drink."]]],
        "reru": [0, "れる", "receptive", "This is the receptive (similar to passive) form of the verb, used when something is done to the subject. See more info <a href='https://www.tofugu.com/japanese-grammar/verb-passive-form-rareru/'>here</a>.", [["蜂に刺された。"], ["I was stung by a bee."]], "られる"],
        "seru": [0, "せる", "causative", "This is the causative form of the verb, used when allowing, making, or causing something to happen. See more info <a href='https://www.tofugu.com/japanese-grammar/verb-causative-form-saseru/'>here</a>.", [["お母さんは弟を学校に行かせた。", "コウイチはマミにベーコンを好きなだけ食べさせた。"], ["My mom made my little brother go to school.", "Koichi let Mami eat as much bacon as she liked."]], "させる"],
        /*"mnotcas": [5, "てはだめ", "must not (casual)", "This is a casual way to say 'must not do' something, usually only used in casual speech. The 'te' form of the verb is used, followed by the 'は' particle and 'だめ'.", [[["こんなことで泣いていてはだめだ！"]], [["You shouldn't cry over something like this."]]]*/
    };
    static irregularVerbs = {
        "する": {"gen": "し", "reru": "さ", "seru": "さ"},
        "来る": {"gen": "き", "nai": "こ", "reru": "こら", "seru": "こさ"},
        "有る": {"nai": ""},
        "行く": {"te": "いって", "ta": "いった"}
    };

    static init() {
        this.verbIDs = new Uint16Array(1045);
        this.verbIDs = [2480,2490,2495,2492,2557,2572,2586,2576,2603,2606,2609,2614,2641,8945,2578,2645,2671,2697,2699,2706,2723,2729,2733,8660,8961,2481,2491,2494,2556,2577,2587,2598,2613,2698,2740,2742,2750,2756,2765,2775,2787,2805,2824,2838,2840,2601,2724,2776,2868,2874,2901,2902,2914,2923,2926,3406,3418,3496,3817,4378,7477,7671,7681,8697,2599,2720,2903,2937,2941,2971,4070,4071,7677,8738,2700,2966,2992,2994,2997,3007,3015,3018,3025,3052,3054,3065,3074,3434,3435,3453,3461,3462,3463,3464,3465,3467,3468,7530,8938,2816,3088,3091,3106,3112,3130,3142,3144,3148,3429,3466,3475,3476,3479,3523,3807,4147,4377,7478,7741,9261,9279,3097,3113,3159,3162,3167,3171,3172,3174,3177,3180,3183,3185,3189,3192,3208,3215,3217,3222,3445,3488,3491,3492,3493,3494,3506,3707,7575,7621,7686,9240,9250,3149,3238,3245,3252,3267,3277,3278,3281,3284,3285,3287,3288,3291,3305,3310,3316,3490,3505,3507,3508,3509,4148,4217,7497,7514,7626,8932,8939,8951,3098,3128,3333,3337,3352,3391,3393,3424,3556,3557,3558,3561,3562,3563,3565,3566,3582,3925,4073,7748,8933,8946,3394,3524,3554,3571,3576,3577,3578,3579,3580,3583,3586,3587,3594,3605,3624,3628,3639,3888,7495,7496,8943,9245,3129,3489,3662,3666,3684,3689,3700,3705,3798,3880,3881,3883,3884,3885,3886,3887,3889,3902,3944,3946,6946,8954,3575,3732,3755,3756,3767,3776,3904,3905,3906,5927,5983,7540,7697,7754,8952,9244,9249,9269,3720,3826,3828,3838,3843,3849,3856,3866,3870,3920,3922,3929,3930,3931,7755,8947,9262,9276,9294,3797,3823,3845,3976,3985,3994,4005,7588,7589,7700,7759,4065,4082,4091,4102,4105,4107,4111,4115,4146,4152,7479,7645,7646,8710,8852,8927,8997,9021,9247,2634,4166,4189,4198,4210,4220,4222,4225,4226,4243,4367,4372,6301,7550,8944,9295,9304,4181,4204,4221,4254,4261,4278,4304,4317,4334,4345,4370,8953,9027,9085,9253,4122,4309,4381,4384,4388,4391,4392,4393,4407,4409,4417,4425,4426,4443,4451,4454,4456,4458,4464,4472,4474,6457,8712,8888,8998,9086,9283,4389,4480,4482,4488,4492,4497,4499,4502,4514,4526,4533,4552,4561,4562,4582,4841,4843,4844,4845,4852,7502,7597,8867,4390,4577,4578,4581,4607,4613,4617,4625,4627,4631,4642,4648,4652,4853,4854,4855,4856,4857,4858,5937,7507,7765,7779,8931,8936,4655,4657,4660,4668,4687,4689,4695,4700,4710,4714,4725,4741,4752,4755,4865,4866,4869,4870,6235,7711,3800,4747,4763,4764,4766,4767,4768,4769,4773,4777,4779,4782,4788,4792,4797,4805,4812,4822,4827,4830,4834,4836,4837,4878,4879,4885,7600,7724,8680,8716,8809,8868,8905,9257,4012,4778,4838,4883,4895,4901,4903,4907,4908,4910,4912,4924,4925,4948,4949,4960,4966,4967,4977,4978,4994,4998,7160,7769,9072,4771,4810,5001,5002,5003,5004,5018,5019,5021,5025,5027,5029,5036,5069,5070,5072,5079,5082,5084,5088,5093,5096,5103,5197,7656,7770,8541,8940,8949,9307,5028,5039,5092,5109,5124,5152,5160,5161,5163,5178,5190,5200,5262,5284,5388,5751,8757,9252,5009,5031,5076,5081,5213,5216,5220,5242,5249,5255,5263,5266,5273,5280,5282,5288,5290,5396,5397,6295,7772,8684,9045,9296,5283,5297,5300,5308,5310,5316,5317,5320,5330,5333,5336,5338,5343,5356,5373,5376,5380,5381,5383,5386,5399,5504,5701,6456,8842,8875,8929,8930,8934,9080,9263,5337,5403,5404,5406,5407,5410,5414,5421,5433,5436,5443,5447,5449,5466,5467,5483,5491,5497,5702,5703,5704,5705,5706,8935,5508,5511,5512,5516,5517,5526,5560,5575,5582,5585,5596,5600,5606,5608,5609,5610,5708,8723,8876,8956,4277,5611,5613,5618,5629,5640,5643,5648,5653,5657,5665,5672,5681,5691,5709,5710,5711,5712,5713,5721,5722,5726,5728,5729,5730,5732,5735,5736,5738,5742,5757,5763,5784,5789,5790,5795,5796,5801,5813,5816,5820,5829,5834,8725,8878,3207,5725,5837,5839,5840,5841,5845,5847,5850,5851,5857,5858,5859,5863,5867,5877,5917,7776,8917,9059,5562,5940,5957,5970,5974,5981,5986,5988,6001,6006,6009,6015,6028,6238,9266,6038,6040,6041,6043,6050,6055,6063,6067,6073,6075,6079,6080,6081,6084,6098,6102,6108,6109,6120,6123,6128,6130,6131,6137,6078,6142,6143,6144,6146,6153,6162,6163,6166,6168,6169,6174,6178,6179,6182,6191,6196,6203,6213,6216,6219,6222,6223,6229,6230,6232,6233,8983,9272,9297,5022,6241,6243,6245,6246,6247,6250,6255,6258,6267,6268,6289,6303,6305,6306,6308,6318,6322,7511,6340,6341,6342,6344,6345,6348,6349,6350,6352,6357,6360,6366,6369,6380,6386,6393,6395,6405,6413,6424,6433,6441,6444,8928,9154,6454,6455,6469,6475,6476,6488,6495,6514,6526,6540,6551,6554,6557,6560,6561,6562,6583,6589,6592,6594,6595,6598,6617,6618,6623,6627,6644,6936,6937,6938,6939,6940,6942,7558,7725,6658,6661,6681,6699,6711,6718,6732,6740,6944,6945,8942,6731,6753,6759,6760,6761,6766,6767,6783,6801,6812,6815,6935,6941,6949,8926,6763,6765,6844,6846,6852,6855,6856,6886,6890,6892,6897,6899,6908,6923,6925,6931,6933,6955,9008,9034,6988,7024,7031,7038,7041,7044,7782,6721,7007,7056,7060,7064,7103,7105,7107,7109,7120,7143,7144,9060,7057,7123,7163,7171,7172,7185,7195,7198,7205,7208,7213,7220,7229,7232,7245,7251,8937,7267,7281,7288,7290,7306,7311,7314,7317,7326,7336,7341,7349,7434,8890,8920,8921,8941,8948,4974,7358,7385,7392,7397,7404,7436,7438,7440,7444,7667,8950,7787,7789,7796,7798,7799,7802,7818,7832,7857,8813,9001,7863,7878,7892,7916,7930,7939,7946,7968,7976,7988,7989,7994,7995,8021,8043,8044,8073,8081,8086,8094,8137,8146,8153,8179,8190,8200,8206,8213,8246,8262,8288,8316,8318,8328,8339,8359,8381,8417,8424,8425,9053,8437,8441,8463,8470,8477,8504,8510,8518,8521,8527,8558,8568,8579,8581,8602,8618,8632,8635,9116,9117];
        this.levelVerbCount = [3,7,14,25,45,64,74,99,121,152,181,203,225,247,265,284,295,314,331,346,373,396,421,441,475,500,530,548,572,603,627,647,666,692,712,727,751,781,800,825,838,860,871,886,906,913,926,943,961,973,984,991,1000,1007,1013,1019,1025,1032,1039,1045];
    }
    static async getRandomVerbInfo(quantity) {
        let verbInfo = [];
        for(let i = 0; i < quantity; i++) {
            let verbID = this.verbIDs[Math.floor(Math.random() * this.levelVerbCount[(CustomSRSSettings.userSettings.lastKnownLevel == 60) ? 59 : CustomSRSSettings.userSettings.lastKnownLevel - 3])];
            verbInfo.push(verbID);
        }
        // Make one request to get all verb info from WK API
        let verbInfoString = verbInfo.join(",");
        let response = await Utils.wkAPIRequest("subjects?ids=" + verbInfoString);
        for(let i = 0; i < verbInfo.length; i++) {
            verbInfo[i] = response.data.find(item => item.id === verbInfo[i]);
        }
        return verbInfo;
    }

    static conjugateVerb(verb, type, form, characters) {
        switch(type) {
            case "godan": {
                if(this.irregularVerbs[characters]?.[form]) verb = this.irregularVerbs[characters][form]; // Check for single verb irregularities
                else {
                    let lastKanaColumn = this.rootEnds[2].indexOf(verb.slice(-1));
                    verb = verb.slice(0, -1);
                    verb += this.rootEnds[this.conjugations[form][0]][lastKanaColumn];
                }
                if(form != "te" && form != "ta") verb += this.conjugations[form][1];
                break;
            } case "ichidan":
                verb = verb.slice(0, -1);
                verb += this.conjugations[form][5] || this.conjugations[form][1];
                break;
            case "irregular":
                if(characters.includes("する")) verb = verb.slice(0, -2) + (this.irregularVerbs["する"][form] || this.irregularVerbs["する"].gen);
                else verb = this.irregularVerbs[characters][form] || this.irregularVerbs[characters].gen;
                verb += this.conjugations[form][1];
                break;
        }
        return verb;
    }
    static getConjugationQueueItem(item) {
        let conjugationKeys = Object.keys(this.conjugations).filter(c => !CustomSRSSettings.userSettings.inactiveConjugations.includes(c));
        if(conjugationKeys.length == 0) {
            alert("No conjugations selected, please select some in the settings.");
            window.location.href = "/dashboard";
        }
        const conjugationType = conjugationKeys[Math.floor(Math.random() * conjugationKeys.length)];
        const partsOfSpeech = item.data.parts_of_speech.join(" ");
        const verbType = partsOfSpeech.includes("ichidan") ? "ichidan" : partsOfSpeech.includes("godan") ? "godan" : (this.irregularVerbs[item.data.characters] || item.data.characters.includes("する")) ? "irregular" : "ichidan"; // Determine verb type
        return {
            id: -item.id,
            type: "Vocabulary",
            subject_category: "Vocabulary",
            characters: item.data.characters + "\n" + this.conjugations[conjugationType][2] + " form",
            meanings: item.data.meanings.map(m => ({"text": m.meaning, "kind": "primary"})) || [],
            auxiliary_meanings: item.data.auxiliary_meanings || [],
            readings: [{"text": this.conjugateVerb(item.data.readings[0].reading, verbType, conjugationType, item.data.characters), "kind": "primary", "pronunciations": []}],
            auxiliary_readings: item.data.auxiliary_readings || [],
            kanji: [],
            verbType: verbType,
            conjugationType: conjugationType,
            ogChar: item.data.characters,
            ogReading: item.data.readings[0].reading
        };
    }

    static async getConjugationSessionItems(quantity) {
        if(CustomSRSSettings.userSettings.lastKnownLevel < 3) {
            alert("WK level too low, conjugation practice requires at least level 3.");
            window.location.href = "/dashboard";
        }

        Conjugations.init();
        let items = await Conjugations.getRandomVerbInfo(quantity);

        if(items.length < quantity) {
            alert("Not enough verbs unlocked yet, try again once you've increased your WK level!");
            window.location.href = "/dashboard";
            return;
        }

        // Set up items
        let srsItems = [], verbItems = [];
        for(let item of items) {
            srsItems.push([-item.id, 0, 1]);
            verbItems.push(this.getConjugationQueueItem(item));
        }
        this.activeQueue = verbItems;
        return [verbItems, srsItems];
    }

    static getSubjectInfo(subjectID) { // Get details of item for review page details display
        let item = this.activeQueue.find(item => item.id === parseInt(subjectID));
        return makeDetailsHTMLConjugation(item, this.conjugations[item.conjugationType]);
    }

    static getSettingsHTML() {
        let container = document.createElement("div");
        container.classList.add("component-div");
        container.style.gridColumn = "span 2";
        for(let conjugation in this.conjugations) {
            let label = document.createElement("label");
            label.innerHTML = this.conjugations[conjugation][2] + " form";
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = !CustomSRSSettings.userSettings.inactiveConjugations.includes(conjugation);
            checkbox.onchange = function() {
                if(checkbox.checked) CustomSRSSettings.userSettings.inactiveConjugations = CustomSRSSettings.userSettings.inactiveConjugations.filter(c => c != conjugation);
                else CustomSRSSettings.userSettings.inactiveConjugations.push(conjugation);
                StorageManager.saveSettings();
            };
            container.append(label, checkbox);
        }
        return container;
    }
}

// ------------------- Audio Quiz -------------------
class AudioQuiz {
    static activeItemLink;

    static addAudioQuizItem(id, audioURL) {
        this.activeQueueLinks[id] = audioURL;
    }

    static async playActiveQuizItemAudio() {
        if(!this.activeItemLink) return;
        let audio = new Audio(this.activeItemLink);
        audio.play();
    }

    static setUpAudioQuizHTML() {
        let soundIcon = Icons.customIcon("sound-on");
        soundIcon.classList.add("sound-icon");
        soundIcon.style.width = "100%";
        soundIcon.style.height = "7.5rem";
        soundIcon.onclick = () => this.playActiveQuizItemAudio();

        document.getElementById("custom-srs-header-style").innerHTML += /*css*/ `
        .character-header .character-header__characters {
            height: 0;
            overflow: hidden;
        }
        .character-header__content {
            cursor: pointer
        }
        .quiz__content:has(.quiz-input .quiz-input__input-container[correct="true"]), .quiz__content:has(.quiz-input .quiz-input__input-container[correct="false"]) {
            .character-header .character-header__characters {
                height: auto;
                overflow: visible;
            }
            .sound-icon {
                display: none
            }
        }
        `;

        let audioButton = document.querySelector("a.additional-content__item.additional-content__item--audio");
        audioButton.onclick = () => this.playActiveQuizItemAudio();
        audioButton.style.cursor = "pointer";

        window.addEventListener("willShowNextQuestion", (e) => {
            this.activeItemLink = e.detail.subject?.readings[0].pronunciation.sources[0]?.url;
            this.playActiveQuizItemAudio();
        });

        return soundIcon;
    }
}

// ------------------- Utility classes -------------------
class Utils {
    static cantorNumber(a, b) {
        return -(0.5 * (a + b) * (a + b + 1) + b) - 1;
    }
    static reverseCantorNumber(z) {
        z = -z - 1;
        let w = Math.floor((Math.sqrt(8 * z + 1) - 1) / 2);
        let y = z - ((w * w + w) / 2);
        let x = w - y;
        return [x, y];
    }
    static async get_controller(name) {
        let controller;
        while(!controller) {
            try {
                controller = Stimulus.getControllerForElementAndIdentifier(document.querySelector(`[data-controller~="${name}"]`),name);
            } catch(e) {
                Utils.log("Error getting controller " + name);
            }
            Utils.log("Waiting for controller " + name);
            await new Promise(r => setTimeout(r, 50));
        }
        return controller;
    }
    static async setMeaningsOnly() {
        let controller = await Utils.get_controller("quiz-queue");
        controller = controller.quizQueue.stats;

        const originalGet = controller.get.bind(controller);
        controller.get = function(t) {
            let stat = originalGet(t);
            stat.reading.complete = true;
            return stat;
        };
    }
    static async setReadingsOnly() {
        let controller = await Utils.get_controller("quiz-queue");
        controller = controller.quizQueue.stats;

        const originalGet = controller.get.bind(controller);
        controller.get = function(t) {
            let stat = originalGet(t);
            stat.meaning.complete = true;
            return stat;
        };
    }

    static async wkAPIRequest(endpoint, method = "GET", data = null) {
        if(!CustomSRSSettings.userSettings.apiKey) {
            console.error("CustomSRS: No API key set");
            return;
        }
        let url = "https://api.wanikani.com/v2/" + endpoint;
        let headers = new Headers({
            Authorization: "Bearer " + CustomSRSSettings.userSettings.apiKey,
        });
        let apiRequest = new Request(url, {
            method: method,
            headers: headers
        });
        if(data) apiRequest.body = JSON.stringify(data);

        let response = await fetch(apiRequest);
        return response.json();
    }

    static log(message) {
        if(typeof message === "object") console.log(message);
        else console.log("Custom SRS: " + message);
    }
}

class CustomSRSSettings {
    static defaultUserSettings = {
        showItemDueTime: true,
        itemQueueMode: "weighted-start",
        exportSRSData: false,
        lastKnownLevel: 0,
        apiKey: null,
        enabledConjGrammar: true,
        conjGrammarSessionLength: 10,
        inactiveConjugations: [],
        syncEnabled: false,
        enableRadicalCapture: true,
        enableKanjiCapture: true,
        enableVocabCapture: true,
        lockByDependency: true
    };
    static userSettings = this.defaultUserSettings;
    static defaultSavedData = {
        capturedWKReview: null,
        lastSynced: 0
    };
    static savedData = this.defaultSavedData;
    static validateSettings() {
        for(let setting in this.defaultUserSettings) {
            if(this.userSettings[setting] === undefined) this.userSettings[setting] = this.defaultUserSettings[setting];
        }
        // Prompt user for API key if not set
        if(!this.userSettings.apiKey) {
            if(confirm("Custom SRS: No API key set, would you like to set it now? CustomSRS will not work properly without it. It can be found in your WaniKani account settings > API Keys.")) {
                let apiKey = prompt("Please enter your WaniKani API key:");
                if(apiKey) {
                    this.userSettings.apiKey = apiKey;
                    StorageManager.saveSettings();
                } else {
                    alert("Custom SRS: No API key set, Custom SRS will not work properly without it.");
                    console.error("Custom SRS: No API key set");
                }
            } else {
                alert("Custom SRS: No API key set, Custom SRS will not work properly without it. Reload the page or go to the CustomSRS settings tab to set it.");
                console.error("Custom SRS: No API key set");
            }
        }
        for(let setting in this.defaultSavedData) {
            if(this.savedData[setting] === undefined) this.savedData[setting] = this.defaultSavedData[setting];
        }
    }
}
settingsLoaded = true;

class StorageManager {
    static downloadedPackProfile = null;
    static needsPushSync = false;

    // Get custom packs saved in GM storage
    static async loadPackProfile(profileName, forceSync = false) {
        if(this.needsPushSync) {
            this.needsPushSync = false;
            await this.savePackProfile(null, profileName, true, true);
            Utils.log("Synced data to drive after review session");
            return;
        }
        if(CustomSRSSettings.userSettings.syncEnabled && (window.location.pathname.includes("dashboard") || window.location.pathname === "/") && (forceSync || new Date().getTime() > CustomSRSSettings.savedData.lastSynced + 120000)) {
            await SyncManager.loadDataFromDrive(profileName, forceSync);
            let maxWaitCount = 150;
            while(!this.downloadedPackProfile && maxWaitCount > 0) {
                await new Promise(r => setTimeout(r, 100));
                Utils.log("Waiting for pack profile to download");
                maxWaitCount--;
            }
            console.log(this.downloadedPackProfile);
            if(this.downloadedPackProfile != null && this.downloadedPackProfile != -1) {
                GM.setValue("customPackProfile_" + profileName, this.downloadedPackProfile);
                this.downloadedPackProfile = CustomPackProfile.fromObject(this.downloadedPackProfile);
                return this.downloadedPackProfile;
            }
        }
        let savedPackProfile;
        try {
            savedPackProfile = CustomPackProfile.fromObject(await GM.getValue("customPackProfile_" + profileName, new CustomPackProfile()));
        } catch(e) {
            Utils.log("Error loading pack profile: " + e);
            savedPackProfile = new CustomPackProfile();
        }
        this.downloadedPackProfile = null;
        return savedPackProfile;
    }

    // Save custom packs to GM storage
    static async savePackProfile(packProfile, profileName, shouldSync = false, forceSync = false) {
        if(!packProfile) packProfile = CustomPackProfile.fromObject(await GM.getValue("customPackProfile_" + profileName, new CustomPackProfile()));
        if(!packProfile) return;
        GM.setValue("customPackProfile_" + profileName, packProfile);
        if(CustomSRSSettings.userSettings.syncEnabled && shouldSync && (new Date().getTime() > CustomSRSSettings.savedData.lastSynced + 40000 || forceSync)) SyncManager.saveDataToDrive(packProfile, profileName);
    }
    static async deletePackProfile(profileName) {
        GM.deleteValue("customPackProfile_" + profileName);
    }

    // Settings
    static async saveSettings() {
        GM.setValue("custom_srs_user_data", CustomSRSSettings.userSettings);
        GM.setValue("custom_srs_saved_data", CustomSRSSettings.savedData);
    }
    static async updateLastSynced() {
        CustomSRSSettings.savedData.lastSynced = Date.now();
        GM.setValue("custom_srs_saved_data", CustomSRSSettings.savedData);
    }
    static async loadSettings() {
        CustomSRSSettings.userSettings = await GM.getValue("custom_srs_user_data", CustomSRSSettings.userSettings);
        CustomSRSSettings.savedData = await GM.getValue("custom_srs_saved_data", CustomSRSSettings.savedData);
        CustomSRSSettings.validateSettings();
    }

    static packFromJSON(json) {
        let pack = CustomItemPack.fromObject(json);
        return pack;
    }
    static packToJSON(pack) {
        let packJSON = JSON.parse(JSON.stringify(pack));
        if(!CustomSRSSettings.userSettings.exportSRSData) {
            packJSON.items.forEach(item => {
                delete item.last_reviewed_at;
                delete item.info.srs_lvl;
            });
        }
        return JSON.stringify(packJSON);
    }
}

await StorageManager.loadSettings();

// ********** D:\USERS\LIBRARIES\DOCUMENTS\GITHUB\WANIKANI-CUSTOM-SRS\SYNC_MANAGER.JS **********
let stopRemainingScriptLoad = false;

// Class with utilities for performing the OAuth2.0 flow and for making requests to the Google Drive API.
class SyncManager {
    static #c = atob("NTA4Njc3MDM4NTU5") + "-" + atob(b) + ".apps.googleusercontent.com";
    static #s = atob("R09DU1BY") + "-" + atob(a);
    static #r = "https://www.wanikani.com";
    
    static beginAuth() {
        Utils.log("beginAuth");
        let builtAuthURL = `https://accounts.google.com/o/oauth2/auth?client_id=${this.#c}&redirect_uri=${this.#r}&response_type=code&scope=https://www.googleapis.com/auth/drive.appdata&access_type=offline&prompt=consent`;
        window.open(builtAuthURL, "Log in", "resizeable, scrollbars, status, toolbar, dependent, width=480,height=660");
    }

    static async checkIfAuthed() {
        if(!CustomSRSSettings.userSettings.syncEnabled) return;

        let url = new URL(window.location.href);
        let authCode = url.searchParams.get("code");

        if(authCode) {
            stopRemainingScriptLoad = true;
            // If authenticating, cover the page with a loading screen
            let loadingScreen = "<div style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--color-wk-panel-background, white); z-index: 1000;'><h1 id='loadingScreenText' style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%'>Loading...</h1></div>";
            Utils.log("Auth code found. Getting access token.");
            document.addEventListener("DOMContentLoaded", () => {
                document.body.innerHTML += loadingScreen;
                this.getAccessToken(authCode);
            });
        } else if(await GM.getValue("customSrsAccessToken")) {
            Utils.log("Google Drive Access Token found");
            if(await GM.getValue("customSrsDidReview")) {
                Utils.log("Review was done, saving data to Google Drive");
                this.saveDataToDrive(activePackProfile, "main", true);
                GM.deleteValue("customSrsDidReview");
            }
        } else {
            Utils.log("No auth code / access token found. Beginning auth.");
            SyncManager.beginAuth();
        }
    }

    static getLoadingScreenText() {
        return unsafeWindow.document.getElementById("loadingScreenText");
    }

    static getAccessToken(authCode) {
        let bodyTxt = `client_id=${encodeURIComponent(this.#c)}&` + atob("Y2xpZW50X3NlY3JldA==") +
        `=${encodeURIComponent(this.#s)}&` +
        `code=${encodeURIComponent(authCode)}&` +
        `grant_type=authorization_code&` +
        `redirect_uri=${encodeURIComponent(this.#r)}&` +
        `access_type=offline`;

        GM.xmlHttpRequest({
            method: "POST",
            url: "https://oauth2.googleapis.com/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: bodyTxt,
            onload: function(response) {
                if(response.status != 200) {
                    Utils.log("Error getting access token");
                    Utils.log(response);
                    CustomSRS_getLoadingScreenText().innerText = "Error getting access token";
                    return;
                }
                let responseJSON = JSON.parse(response.responseText);
                GM.setValue("customSrsAccessToken", responseJSON.access_token);
                GM.setValue("customSrsRefreshToken", responseJSON.refresh_token);
                GM.setValue("customSrsTokenExpires", Date.now() + responseJSON.expires_in * 1000);
                Utils.log("Google Drive Access Token received: " + responseJSON.access_token + ", expires in " + responseJSON.expires_in + " seconds, refresh token: " + responseJSON.refresh_token);
                CustomSRS_selectMasterSource(responseJSON.access_token);
            },
            onerror: function(response) {
                Utils.log("Error getting access token");
                Utils.log(response);
                CustomSRS_getLoadingScreenText().innerText = "Error getting access token";
            }
        });
    }

    static async selectMasterSource(accessToken) {
        let packProfile = await StorageManager.loadPackProfile("main");
        GM.xmlHttpRequest({
            method: "GET",
            url: "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='packProfiles__main.json'&fields=files(id,modifiedTime)",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            onload: function(response) {
                let files = JSON.parse(response.responseText).files;
                if(!files || files.length == 0) CustomSRS_getLoadingScreenText().innerText = "Please close this window and then refresh WaniKani to begin syncing.";
                else {
                    CustomSRS_getLoadingScreenText().innerHTML = `
                    <h2>Select Source</h2>
                    <p style="font-size: 40%">Choose which version of your data to keep - whichever you choose will overwrite the other. Whicever you do not choose will be permanently deleted.</p>
                    <button style="width: 100%" id="driveButton">Google Drive<br><small>Last modified: ${new Date(files[0].modifiedTime).toLocaleString()}</small></button>
                    <button style="width: 100%" id="localButton">Local</button>`;
                    document.getElementById("driveButton").addEventListener("click", () => {
                        GM.setValue("customSrsDriveFileId", files[0].id);
                        SyncManager.loadDataFromDrive("main", true);
                        // Wait for the data to be downloaded
                        let interval = setInterval(() => {
                            if(StorageManager.downloadedPackProfile != null) {
                                clearInterval(interval);
                                if(StorageManager.downloadedPackProfile == -1) {
                                    CustomSRS_getLoadingScreenText().innerText = "Error downloading file from Google Drive, please close this window and then refresh WaniKani, then go to settings and click 'force pull' to try again.";
                                    return;
                                }
                                CustomSRS_getLoadingScreenText().innerText = "Please close this window and then refresh WaniKani to begin syncing.";
                            }
                        }, 100);
                    });
                    document.getElementById("localButton").addEventListener("click", () => {
                        SyncManager.saveDataToDrive(packProfile, "main").then(() => {
                            CustomSRS_getLoadingScreenText().innerText = "Please close this window and then refresh WaniKani";
                        });
                    });
                }
            },
            onerror: function(response) {
                Utils.log("Error getting file metadata from Google Drive");
                Utils.log(response);
                CustomSRS_getLoadingScreenText().innerText = "Error getting file metadata from Google Drive";
            }
        });
    }

    static async refreshToken() {
        let refreshToken = await GM.getValue("customSrsRefreshToken")
        if(!refreshToken) {
            Utils.log("No refresh token found, please re-authenticate");
            return;
        }
        Utils.log("Refreshing token - " + refreshToken);

        let bodyTxt = `client_id=${encodeURIComponent(this.#c)}&` + atob("Y2xpZW50X3NlY3JldA==") +
        `=${encodeURIComponent(this.#s)}&` +
        `refresh_token=${encodeURIComponent(refreshToken)}&` +
        `grant_type=refresh_token`;

        await GM.xmlHttpRequest({
            method: "POST",
            url: "https://oauth2.googleapis.com/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: bodyTxt,
            onload: function(response) {
                let responseJSON = JSON.parse(response.responseText);
                GM.setValue("customSrsAccessToken", responseJSON.access_token);
                GM.setValue("customSrsTokenExpires", Date.now() + responseJSON.expires_in * 1000);
                Utils.log("Google Drive Access Token refreshed to " + responseJSON.access_token);
            },
            onerror: function(response) {
                Utils.log("Error refreshing access token");
                Utils.log(response);
            }
        });
    }

    static async saveDataToDrive(data, fileSuffix, forceSync = false) {
        // Check if review was done less than 3 seconds ago
        if(!forceSync && CustomSRSSettings.savedData.lastSynced > Date.now() - 3000) {
            Utils.log("Review was done less than 3 seconds ago, preventing API spam");
            return;
        }
        // Check if access token is expired
        let tokenExpires = await GM.getValue("customSrsTokenExpires");
        if (Date.now() > tokenExpires) {
            await this.refreshToken();
        }
        let accessToken = await GM.getValue("customSrsAccessToken");
        
        // Convert data object to JSON string
        let dataString = JSON.stringify(data);

        let fileId = await GM.getValue("customSrsDriveFileId");

        // Create file metadata
        let metadata = fileId ? {
            modifiedTime: new Date().toISOString()
        } : {
            name: 'packProfiles__' + fileSuffix + '.json',
            mimeType: 'application/json',
            parents: ['appDataFolder'],
            modifiedTime: new Date().toISOString()
        };

        // Save file to Google Drive
        GM.xmlHttpRequest({
            method: fileId ? "PATCH" : "POST",
            url: "https://www.googleapis.com/upload/drive/v3/files" + (fileId ? "/" + fileId : "") + "?uploadType=multipart",
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "multipart/related; boundary=foo_bar_baz"
            },
            data: "--foo_bar_baz\r\n" +
                "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
                JSON.stringify(metadata) + "\r\n" +
                "--foo_bar_baz\r\n" +
                "Content-Type: application/json\r\n\r\n" +
                dataString + "\r\n" +
                "--foo_bar_baz--",
            onload: function(response) {
                if(response.status != 200) {
                    Utils.log("Error saving file to Google Drive");
                    Utils.log(response);
                    return;
                }
                Utils.log("File saved to Google Drive");
                if(fileId && fileId != JSON.parse(response.responseText).id) alert("File saved incorrectly - fileID mismatch. Please report this to the developer.");
                GM.setValue("customSrsDriveFileId", JSON.parse(response.responseText).id);
                StorageManager.updateLastSynced();
            },
            onerror: function(response) {
                Utils.log("Error saving file to Google Drive");
                Utils.log(response);
            }
        });
    }

    static async loadDataFromDrive(fileSuffix, forceSync = false) {
        StorageManager.downloadedPackProfile = null;
        let accessToken = await GM.getValue("customSrsAccessToken");
        if(!accessToken) {
            StorageManager.downloadedPackProfile = -1;
            return;
        }

        // Check if access token is expired
        let tokenExpires = await GM.getValue("customSrsTokenExpires");
        if (Date.now() > tokenExpires) {
            await this.refreshToken();
            accessToken = await GM.getValue("customSrsAccessToken");
        }

        let lastSync = CustomSRSSettings.savedData.lastSynced;

        // Get file metadata
        GM.xmlHttpRequest({
            method: "GET",
            url: "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='packProfiles__" + fileSuffix + ".json'&fields=files(id,modifiedTime)",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            onload: function(response) {
                let files = JSON.parse(response.responseText).files;
                if(!files) {
                    Utils.log("Error getting file metadata from Google Drive");
                    Utils.log(response);
                } else if (files.length > 0) {
                    let fileId = files[0].id;
                    let fileModifiedTime = new Date(files[0].modifiedTime).getTime();
                    Utils.log("File modified time: " + new Date(files[0].modifiedTime));
                    if (forceSync || fileModifiedTime > lastSync) {
                        // File has been modified, download the updated data
                        GM.xmlHttpRequest({
                            method: "GET",
                            url: "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media",
                            headers: {
                                "Authorization": "Bearer " + accessToken
                            },
                            onload: function(response) {
                                if(response.status != 200) {
                                    Utils.log("Error downloading file from Google Drive");
                                    Utils.log(response);
                                    StorageManager.downloadedPackProfile = -1;
                                    return;
                                }
                                let data = JSON.parse(response.responseText);
                                StorageManager.downloadedPackProfile = data;
                                StorageManager.updateLastSynced();
                                Utils.log("File downloaded from Google Drive");
                            }
                        });
                    } else {
                        Utils.log("No updates found");
                        StorageManager.downloadedPackProfile = -1;
                        StorageManager.updateLastSynced();
                    }
                } else {
                    Utils.log("File not found on Google Drive, syncing for the first time");
                    StorageManager.downloadedPackProfile = -1;
                    StorageManager.savePackProfile(null, "main", true, true);
                }
            }
        });
    }

    static disableSync() {
        GM.deleteValue("customSrsAccessToken");
        GM.deleteValue("customSrsRefreshToken");
        GM.deleteValue("customSrsTokenExpires");
        GM.deleteValue("customSrsDriveFileId");
    }

    static setDidReview() {
        GM.setValue("customSrsDidReview", true);
    }
}

window.CustomSRS_selectMasterSource = SyncManager.selectMasterSource;
window.CustomSRS_getLoadingScreenText = SyncManager.getLoadingScreenText;

// ********** D:\USERS\LIBRARIES\DOCUMENTS\GITHUB\WANIKANI-CUSTOM-SRS\MAIN.JS **********
if(stopRemainingScriptLoad) return;

let activePackProfile = await StorageManager.loadPackProfile("main");
let quizStatsController;

// ----------- If on review page -----------
if (window.location.pathname.includes("/review") || (window.location.pathname.includes("/extra_study") && window.location.search.includes("audio"))) {
    let urlParams = new URLSearchParams(window.location.search);

    if(activePackProfile.getNumActiveReviews() !== 0 || urlParams.has("conjugations") || urlParams.has("audio")) {
        // Add style to root to prevent header flash
        let headerStyle = document.createElement("style");
        headerStyle.id = "custom-srs-header-style";
        headerStyle.innerHTML = `
        .character-header__loading {
            .character-header__characters {
                opacity: 0;
                transition: opacity 0.05s;
            }
        }
        `;
        document.head.append(headerStyle);
    }

    // Add custom items to the quiz queue and update captured WK review
    if(document.readyState === "complete" || document.readyState === "interactive") {
        replaceQueue();
    } else {
        document.addEventListener("DOMContentLoaded", replaceQueue);
    }

    async function replaceQueue() {
        let changedFirstItem = false;
        let queueEl = document.getElementById('quiz-queue');
        let parentEl = queueEl.parentElement;
        queueEl.remove();
        let cloneEl = queueEl.cloneNode(true);
        let SRSElement, queueElement;

        // Switch based on review session type
        if(urlParams.has("conjugations")) {
            let verbs = await Conjugations.getConjugationSessionItems(CustomSRSSettings.userSettings.conjGrammarSessionLength);
            queueElement = verbs[0];
            SRSElement = verbs[1];
            changedFirstItem = true;
        } else if(urlParams.has("audio")) {
            queueElement = JSON.parse(cloneEl.querySelector("script[data-quiz-queue-target='subjects']").innerHTML);
            SRSElement = JSON.parse(cloneEl.querySelector("script[data-quiz-queue-target='subjectIds']").innerHTML);
            for(let i = queueElement.length - 1; i >= 0; i--) {
                if(queueElement[i].subject_category !== "Vocabulary" && queueElement[i].subject_category !== "KanaVocabulary") {
                    queueElement.splice(i, 1);
                    SRSElement.splice(i, 1);
                    if(i === 0) changedFirstItem = true;
                }
            }
            if(queueElement.length === 0) {
                alert("No vocabulary items found in burned items. Please try again after burning some vocabulary items.");
                window.location.href = "https://www.wanikani.com/dashboard";
                return;
            }

            document.querySelector(".character-header__content").appendChild(AudioQuiz.setUpAudioQuizHTML());
        } else {
            queueElement = JSON.parse(cloneEl.querySelector("script[data-quiz-queue-target='subjects']").innerHTML);
            SRSElement = JSON.parse(cloneEl.querySelector("script[data-quiz-queue-target='subjectIdsWithSRS']").innerHTML).subject_ids_with_srs_info;

            if(!urlParams.has("custom")) {
                // Capture WK review from queue
                let settings = {"Radical": CustomSRSSettings.userSettings.enableRadicalCapture, "Kanji": CustomSRSSettings.userSettings.enableKanjiCapture, "Vocabulary": CustomSRSSettings.userSettings.enableVocabCapture};
                if(settings.Radical || settings.Kanji || settings.Vocabulary) {
                    queueElement.findLast((item, index) => {
                        if((!CustomSRSSettings.savedData.capturedWKReview || item.id !== CustomSRSSettings.savedData.capturedWKReview.id) && settings[item.subject_category]) {
                            CustomSRSSettings.savedData.capturedWKReview = item;
                            queueElement.splice(index, 1);
                            SRSElement.splice(index, 1);
                            if(index === 0) changedFirstItem = true;
                            Utils.log("Captured item " + index + " from queue.");
                            return true;
                        }
                    });
                }
            }

            // Add custom items to queue
            if(activePackProfile.getNumActiveReviews() !== 0) {
                // if url param is set to "custom" then set queue to only custom items
                if(urlParams.has("custom")) {
                    queueElement = activePackProfile.getActiveReviews();
                    SRSElement = activePackProfile.getActiveReviewsSRS();
                    changedFirstItem = true;
                } else {
                    switch(CustomSRSSettings.userSettings.itemQueueMode) {
                        case "weighted-start": {
                            let reviewsToAddW = activePackProfile.getActiveReviews();
                            let reviewsSRSToAddW = activePackProfile.getActiveReviewsSRS();
                            for(let i = 0; i < reviewsToAddW.length; i++) {
                                let pos = Math.floor(Math.random() * queueElement.length / 4);
                                if(pos === 0) changedFirstItem = true;
                                queueElement.splice(pos, 0, reviewsToAddW[i]);
                                SRSElement.splice(pos, 0, reviewsSRSToAddW[i]);
                            }
                            break;
                        } case "random": {
                            let reviewsToAdd = activePackProfile.getActiveReviews();
                            let reviewsSRSToAdd = activePackProfile.getActiveReviewsSRS();
                            for(let i = 0; i < reviewsToAdd.length; i++) {
                                let pos = Math.floor(Math.random() * queueElement.length);
                                if(pos === 0) changedFirstItem = true;
                                queueElement.splice(pos, 0, reviewsToAdd[i]);
                                SRSElement.splice(pos, 0, reviewsSRSToAdd[i]);
                            }
                            break;
                        } case "start":
                            changedFirstItem = true;
                            queueElement = activePackProfile.getActiveReviews().concat(queueElement);
                            SRSElement = activePackProfile.getActiveReviewsSRS().concat(SRSElement);
                            break;
                    }
                }
            }

            StorageManager.saveSettings();
        }

        if(changedFirstItem) document.querySelector(".character-header").classList.add("character-header__loading");

        cloneEl.querySelector("script[data-quiz-queue-target='subjects']").innerHTML = JSON.stringify(queueElement);
        if(!urlParams.has("audio")) cloneEl.querySelector("script[data-quiz-queue-target='subjectIdsWithSRS']").innerHTML = '{"subject_ids_with_srs_info":' + JSON.stringify(SRSElement) + ',"srs_ids_stage_names":[[1,["Unlocked","Apprentice","Apprentice","Apprentice","Apprentice","Guru","Guru","Master","Enlightened","Burned"]]]}';
        else cloneEl.querySelector("script[data-quiz-queue-target='subjectIds']").innerHTML = JSON.stringify(SRSElement);
        parentEl.appendChild(cloneEl);

        if(changedFirstItem) {
            let headerElement = document.querySelector(".character-header");
            for(let className of headerElement.classList) { // Fix header colour issues
                if(className.includes("character-header--")) {
                    headerElement.classList.remove(className);
                    document.querySelector(".quiz-input__input").setAttribute("placeholder", (document.querySelector(".quiz-input__question-type").innerText.includes("reading") ? "答え" : "Your Response"));
                    setTimeout(() => {
                        headerElement.classList.remove("character-header__loading");
                    }, 400);
                    break;
                }
            }
        }

        if(urlParams.has("conjugations")) {
            await Utils.setReadingsOnly();
            Utils.log("Controller set up for conjugations.");
            setTimeout(() => {
                document.querySelector(".character-header").classList.add("character-header--loaded");
            }, 200);
        } else {
            if(urlParams.has("audio")) Utils.setMeaningsOnly();
            loadControllers();
        }

        // Force full refresh when returning to home page
        const homeButton = document.querySelector(".summary-button");
        homeButton.setAttribute("target", "_top");
        homeButton.setAttribute("data-turbo", "false");
        homeButton.setAttribute("rel", "noopener noreferrer");
    }

    // Catch submission fetch and stop it if submitted item is a custom item
    function overrideFetch() {
        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = function(...args) {
            let [resource, config] = [...args];
            if(resource?.includes("/subjects/review") && config?.method === "POST") {
                let payload = JSON.parse(config.body);
                if(payload?.counts[0]?.id < 0) {
                    Utils.log("Custom item submitted. Stopping fetch.");
                    if(!window.location.search.includes("conjugations")) {
                        activePackProfile.submitReview(payload.counts[0].id, payload.counts[0].meaning, payload.counts[0].reading);
                        SyncManager.setDidReview();
                    }
                    return new Promise((resolve, reject) => {resolve(new Response(null, {status: 200}));});
                }
            }
            return originalFetch(...args);
        };
    }
    overrideFetch();
    document.addEventListener("turbo:frame-load", overrideFetch);
    document.addEventListener("turbo:load", overrideFetch);
    document.addEventListener("turbo:before-fetch-request", handleTurboFetchRequest);
    
    async function handleTurboFetchRequest(e) {
        console.log("Handling Turbo fetch request.");
        if(!e.detail) return;
        e.preventDefault();
        if(!e.detail.url) return e.detail.resume();

        let [resource, config] = [e.detail.url.href, e.detail.fetchOptions];
        //console.log("Resource: " + resource + " Config: " + JSON.stringify(config));
        if(resource.includes("/subjects/review") && config != null && config.method === "POST") {
            console.log("Review submitted.");
            console.log(e.detail);
            let payload = JSON.parse(config.body);
            // Check if submitted item is a custom item
            if(payload?.counts[0]?.id < 0) {
                // Check if url includes ?conjugations
                if(window.location.search.includes("conjugations")) {
                    // Do nothing
                } else {
                    // Update custom item SRS
                    activePackProfile.submitReview(payload.counts[0].id, payload.counts[0].meaning, payload.counts[0].reading);
                    SyncManager.setDidReview();
                }
            } else {
                if(payload?.counts[0]?.id == CustomSRSSettings.savedData.capturedWKReview?.id) { // Check if somehow the captured WK review is being submitted
                    CustomSRSSettings.savedData.capturedWKReview = null;
                    StorageManager.saveSettings();
                }
                e.detail.resume();
            }
        // Catch subject info fetch and return custom item details if the number at the end of the url is negative
        } else if(resource.includes("/subject_info/") && config && config.method === "GET" && resource.split("/").pop() < 0) {
            const currentFetchingID = resource.split("/").pop();
            console.log("Replacing subject info fetch for item " + currentFetchingID);
            let subjectInfo;
            if (window.location.search.includes("conjugations")) {
                subjectInfo = Conjugations.getSubjectInfo(currentFetchingID);
            } else {
                subjectInfo = activePackProfile.getSubjectInfo(currentFetchingID);
            }
            document.getElementById("subject-info").innerHTML = subjectInfo;
            document.getElementById("subject-info").setAttribute("complete", "");
        } else {
            console.log("Resuming fetch.");
            e.detail.resume();
        }
    }

// ----------- If on dashboard page -----------
} else if (window.location.pathname.includes("/dashboard") || window.location.pathname === "/") {
    // Catch lesson / review count fetch and update it with custom item count
    const { fetch: originalFetch } = unsafeWindow;
    unsafeWindow.fetch = async (...args) => {
        let [resource, config] = args;
        if (resource.includes("lesson-and-review-count") && config != null && config.method === "get") {
            let response = await originalFetch(...args);
            let data = await response.text();
            return new Response(updateLessonReviewCountData(data), {
                status: response.status,
                headers: response.headers
            });
        } else if(resource.includes("review-forecast") && config != null && config.method === "get" && CustomSRSSettings.savedData.capturedWKReview) {
            let response = await originalFetch(...args);
            let dataText = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(dataText, 'text/html');
            for(counter of doc.querySelectorAll("#review-forecast .review-forecast__total")) {
                counter.innerHTML = parseInt(counter.innerHTML) - 1;
            }
            return new Response(doc.documentElement.outerHTML, {
                status: response.status,
                headers: response.headers
            });
        } else {
            return originalFetch(...args);
        }
    };

    // Catch document load to edit review count on dashboard
    if(document.readyState === "complete" || document.readyState === "interactive") {
        dashboardLoad();
    } else {
        document.addEventListener("DOMContentLoaded", dashboardLoad);
    }

    function dashboardLoad() {
        let reviewNumberElement = document.querySelector(".reviews-dashboard .reviews-dashboard__count-text span");
        reviewNumberElement.innerHTML = parseInt(reviewNumberElement.innerHTML) + activePackProfile.getNumActiveReviews() + (CustomSRSSettings.savedData.capturedWKReview ? -1 : 0);
        Utils.log("Captured review item: " + (CustomSRSSettings.savedData.capturedWKReview ? CustomSRSSettings.savedData.capturedWKReview.id : "none"));

        let reviewTile = document.querySelector("div.reviews-dashboard");
        if(reviewTile.querySelector(".reviews-dashboard__buttons") === null && activePackProfile.getNumActiveReviews() > 0) { // If failed to catch WK review and custom items are due, display error message
            reviewTile.querySelector(".reviews-dashboard__text .wk-text").innerHTML = "CustomSRS Error. Please wait for WK review item to be available.";
        } else if(parseInt(reviewTile.querySelector(".count-bubble").innerHTML) === 0) { // If no custom items are due, update review tile to remove buttons
            reviewTile.querySelector(".reviews-dashboard__buttons").remove();
            reviewTile.classList.add("reviews-dashboard--complete");
            reviewTile.querySelector(".reviews-dashboard__text .wk-text").innerHTML = "There are no more reviews to do right now.";
        }

        // Force full refresh when clicking on lesson or review buttons
        document.querySelectorAll(".dashboard__lessons-and-reviews a.wk-button").forEach(button => {
            button.setAttribute("target", "_top");
            button.setAttribute("data-turbo", "false");
            button.setAttribute("rel", "noopener noreferrer");
        });
    }

    await SyncManager.checkIfAuthed();

    // Update the stored user level
    let response = await Utils.wkAPIRequest("user");
    if(response && response.data && response.data.level) {
        CustomSRSSettings.userSettings.lastKnownLevel = response.data.level;
        StorageManager.saveSettings();
    }
} else {
    // Catch lesson / review count fetch and update it with custom item count
    const { fetch: originalFetch } = unsafeWindow;
    unsafeWindow.fetch = async (...args) => {
        let [resource, config] = args;
        if (resource.includes("lesson-and-review-count") && config != null && config.method === "get") {
            let response = await originalFetch(...args);
            let data = await response.text();
            let res = new Response(updateLessonReviewCountData(data), {
                status: response.status,
                headers: response.headers
            });
            return res;
        } else {
            return originalFetch(...args);
        }
    };

    // Add event listener for turbo:load, then check if the site address includes /radicals /kanji or /vocabulary
    document.addEventListener("turbo:frame-load", () => {
        if(window.location.pathname.includes("/radicals/") || window.location.pathname.includes("/kanji/") || window.location.pathname.includes("/vocabulary/")) {
            // Use the meta tag in the header with name subject_id to get the subject ID
            let itemHeader = document.querySelector("header.page-header");
            if(itemHeader.querySelector("h3")) itemHeader.querySelector("h3").innerText = "ID: " + document.querySelector("meta[name='subject_id']").content;
            else itemHeader.innerHTML += "<h3> ID: " + document.querySelector("meta[name='subject_id']").content + "</h3>";
        }
    });
}

// ----------- WKOF HANDLER -----------
/*if(wkof) {
    const wkofHandler = (config, options) => {
        console.log(config, options);
        return new Promise((resolve, reject) => {
            reject("Not implemented yet.");
        });
    }
    wkof.ItemData.registry.sources["wk_custom_srs"] = {
       description: "WK Custom SRS",
       fetcher: wkofHandler
    }
}*/

// ----------- UTILITIES -----------
function parseHTML(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t.content;
}

function updateLessonReviewCountData(data) {
    if(data === null) Utils.log("Error: updateLessonReviewCountData data is null.");
    data = parseHTML(data);

    let reviewCountElement = data.querySelector("a[href='/subjects/review'] .lesson-and-review-count__count");
    // If reviewCountElement is null, replace the span .lesson-and-review-count__item with some custom HTML
    let numActiveReviews = activePackProfile.getNumActiveReviews();
    if(reviewCountElement === null && numActiveReviews > 0) {
        let reviewTile = data.querySelector(".lesson-and-review-count__item:nth-child(2)");
        reviewTile.outerHTML = `
        <a class="lesson-and-review-count__item" target="_top" href="/subjects/review">
            <div class="lesson-and-review-count__count">${numActiveReviews}</div>
            <div class="lesson-and-review-count__label">Reviews</div>
        </a>
        `;
    } else {
        if(numActiveReviews > 0 || (!CustomSRSSettings.savedData.capturedWKReview && parseInt(reviewCountElement.innerHTML) > 0) || parseInt(reviewCountElement.innerHTML) > 1) reviewCountElement.innerHTML = parseInt(reviewCountElement.innerHTML) + numActiveReviews + (CustomSRSSettings.savedData.capturedWKReview ? -1 : 0);
        else {
            let reviewTile = data.querySelector(".lesson-and-review-count__item:nth-child(2)");
            reviewTile.outerHTML = `
            <span class="lesson-and-review-count__item" target="_top">
                <div class="lesson-and-review-count__count lesson-and-review-count__count--zero">0</div>
                <div class="lesson-and-review-count__label">Reviews</div>
            </span>
            `;
        }
    }

    // Convert the DocumentFragment back to a string and return it as a Response
    return (new XMLSerializer()).serializeToString(data);
}

async function loadControllers() {
    quizStatsController = await Utils.get_controller('quiz-statistics');
    quizStatsController.remainingCountTarget.innerText = parseInt(quizStatsController.remainingCountTarget.innerText) + (CustomSRSSettings.savedData.capturedWKReview ? -1 : 0) + ((new URLSearchParams(window.location.search)).has("conjugations") ? CustomSRSSettings.userSettings.conjGrammarSessionLength : activePackProfile.getNumActiveReviews());
}
})();