// ==UserScript==
// @name         NHK School Program & Episode Tracker (Multi-Sheet with Auto-Cache)
// @namespace    http://tampermonkey.net/
// @version      1.35
// @description  Scrapes NHK programs/episodes into Excel sheets, tracks watched status, auto-caches.
// @author       iniquitousx
// @match        https://www.nhk.or.jp/school/program/
// @match        https://www.nhk.or.jp/school/*/*/
// @match        https://www.nhk.or.jp/school/*/*/*/
// @match        https://edu.web.nhk/school/program/
// @match        https://edu.web.nhk/school/*/*/
// @match        https://edu.web.nhk/school/*/*/*/
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      www.nhk.or.jp
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536401/NHK%20School%20Program%20%20Episode%20Tracker%20%28Multi-Sheet%20with%20Auto-Cache%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536401/NHK%20School%20Program%20%20Episode%20Tracker%20%28Multi-Sheet%20with%20Auto-Cache%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CACHED_EXCEL_DATA_KEY = 'nhkSchoolExcelData_v1_2'; // Version bump for potential cache structure changes
    const PROGRAM_OVERVIEW_SHEET_NAME = "Program Overview";
    let currentExcelData = {};

    // --- Helper Functions ---
    async function fetchData(url) { /* ... (same as before) ... */
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        resolve(doc);
                    } else {
                        reject(new Error(`Failed to fetch ${url}: Status ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Network error fetching ${url}: ${error}`));
                }
            });
        });
    }
    function getRubyText(element) { /* ... (same as before) ... */
        if (!element) return '';
        const rbElement = element.querySelector('rb');
        if (rbElement) return rbElement.textContent.trim();
        let text = element.textContent.trim();
        const rtElement = element.querySelector('rt');
        if (rtElement) {
            text = text.replace(rtElement.textContent.trim(), '');
        }
        return text.trim().replace(/\s+/g, ' ');
    }

    function cacheCurrentExcelData() {
        if (Object.keys(currentExcelData).length > 0) {
            GM_setValue(CACHED_EXCEL_DATA_KEY, JSON.stringify(currentExcelData));
            console.log("NHK Tracker: Excel data cached automatically.");
        } else {
            GM_deleteValue(CACHED_EXCEL_DATA_KEY);
            console.log("NHK Tracker: Excel data cache cleared.");
        }
    }

    function loadExcelDataFromCache() {
        const cachedJson = GM_getValue(CACHED_EXCEL_DATA_KEY, null);
        if (cachedJson) {
            try {
                currentExcelData = JSON.parse(cachedJson);
                console.log("NHK Tracker: Data loaded from cache.", Object.keys(currentExcelData).length, "sheets.");
                return true;
            } catch (e) {
                console.error("NHK Tracker: Error parsing cached data:", e);
                GM_deleteValue(CACHED_EXCEL_DATA_KEY); // Clear corrupted cache
                currentExcelData = {};
                return false;
            }
        }
        currentExcelData = {};
        return false;
    }

    function sanitizeSheetName(name) { /* ... (same as before) ... */
        return name.replace(/[:\\/?*[\]]/g, '').substring(0, 31);
    }

    // --- UI Elements and General Functions ---
    const statusDivGlobal = document.createElement('div');
    statusDivGlobal.id = 'nhk-tracker-global-status';
    const statusDivOnProgramPage = document.createElement('div'); // Defined here for broader access
    statusDivOnProgramPage.id = 'nhk-tracker-program-page-status';


    function displayStatus(message, isError = false, onProgramPage = false) {
        const targetDiv = onProgramPage ? statusDivOnProgramPage : statusDivGlobal;
        if(document.getElementById(targetDiv.id)) { // Only update if the div is on the page
            targetDiv.textContent = message;
            targetDiv.style.color = isError ? 'red' : 'black';
        }
        console.log("NHK Tracker Status:", message);
    }

    // --- UI Styling ---
    GM_addStyle(`/* ... (same full CSS as before) ... */
        #nhk-tracker-controls-container {
            position: fixed; top: 10px; right: 10px; z-index: 10000;
            background: #f8f9fa; border: 1px solid #dee2e6; border-radius: .25rem;
            padding: 15px; box-shadow: 0 .5rem 1rem rgba(0,0,0,.15); width: 320px;
            font-family: sans-serif; font-size: 14px;
        }
        .nhk-tracker-btn {
            background-color: #007bff; color: white; border: none; padding: 8px 12px;
            margin: 8px 0; cursor: pointer; border-radius: 4px; font-size: 14px; display: block; width: 100%;
            text-align: center; box-sizing: border-box;
        }
        .nhk-tracker-btn:hover { background-color: #0056b3; }
        .nhk-tracker-btn-success { background-color: #28a745; }
        .nhk-tracker-btn-success:hover { background-color: #1e7e34; }
        .nhk-tracker-btn-info { background-color: #17a2b8; }
        .nhk-tracker-btn-info:hover { background-color: #117a8b; }
        #nhk-tracker-global-status, #nhk-tracker-program-page-status {
            margin-top: 10px; padding: 8px; background-color: #e9ecef; border: 1px solid #ced4da;
            font-size: 13px; min-height: 20px; word-wrap: break-word;
        }
        #excelFileInput { display: none; }
        .nhk-episode-watched-toggle {
            padding: 3px 6px; font-size: 11px; min-width: 90px; margin-left: 8px;
            border: 1px solid #ccc; border-radius: 3px; cursor: pointer;
        }
        .nhk-episode-watched-toggle.watched-true { background-color: #28a745; color: white; }
        .nhk-episode-watched-toggle.watched-false { background-color: #dc3545; color: white; }
        .nhk-episode-watched-toggle.not-tracked { background-color: #ffc107; color: black; }
        .nhk-scan-prompt-div {
            background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba;
            padding: 10px; margin: 10px 0; border-radius: 4px; text-align: center; font-size: 13px;
        }
        .programList .itemList { display: flex; align-items: center; }
        .programList .itemList > a { flex-grow: 1; }
    `);


    // --- Excel Handling ---
    function handleExcelFileLoad(file) {
        const isOnProgramPage = !!document.getElementById('nhk-tracker-program-page-status');
        displayStatus('Reading Excel file...', false, isOnProgramPage);
        // ... (rest of handleExcelFileLoad - ENSURE IT CALLS cacheCurrentExcelData() after successful load)
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                let newExcelData = {};
                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    newExcelData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
                });
                currentExcelData = newExcelData;
                cacheCurrentExcelData(); // <<<< SAVE TO CACHE AFTER LOAD
                displayStatus(`Excel loaded. ${Object.keys(currentExcelData).length} sheets.`, false, isOnProgramPage);
                if (window.location.pathname.match(/^\/school\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/($|onair\/$)/)) {
                    addEpisodeButtonsToPage();
                }
            } catch (err) {
                displayStatus(`Error processing Excel: ${err.message}`, true, isOnProgramPage);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    function saveToExcel() { /* ... (same as before, this is an explicit action, doesn't need to re-cache) ... */
        const isOnProgramPage = !!document.getElementById('nhk-tracker-program-page-status');
        if (Object.keys(currentExcelData).length === 0) {
            alert("No data to save.");
            displayStatus("No data to save.", true, isOnProgramPage);
            return;
        }
        const workbook = XLSX.utils.book_new();
        for (const sheetName in currentExcelData) {
            if (currentExcelData.hasOwnProperty(sheetName) && currentExcelData[sheetName].length > 0) {
                const worksheet = XLSX.utils.json_to_sheet(currentExcelData[sheetName]);
                if (sheetName === PROGRAM_OVERVIEW_SHEET_NAME) {
                     worksheet['!cols'] = [ { wch: 25 }, { wch: 40 }, { wch: 60 } ];
                } else {
                     worksheet['!cols'] = [ { wch: 40 }, { wch: 60 }, { wch: 10 } ];
                }
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            } else if (currentExcelData.hasOwnProperty(sheetName)) {
                const emptyWs = XLSX.utils.json_to_sheet([]);
                XLSX.utils.book_append_sheet(workbook, emptyWs, sheetName);
            }
        }
        XLSX.writeFile(workbook, "nhk_school_tracker.xlsx");
        displayStatus("Data exported to 'nhk_school_tracker.xlsx'.", false, isOnProgramPage);
    }


    // --- Logic for Program Overview Page (/school/program/) ---
    function scanProgramOverview() {
        displayStatus('Scanning program overview...');
        let programOverviewData = [];
        // ... (rest of scanProgramOverview as before) ...
        const gradeListSection = document.getElementById('gradeList');
        if (!gradeListSection) {
            displayStatus('Error: Main program section (id="gradeList") not found.', true);
            return;
        }
        const categoryBlocks = gradeListSection.querySelectorAll('div.listWrap[id]');
        if (categoryBlocks.length === 0) {
            displayStatus('No category blocks found.', true);
            return;
        }

        categoryBlocks.forEach(block => {
            const categoryHeader = block.querySelector('h3');
            const categoryRubyElement = categoryHeader ? categoryHeader.querySelector('ruby') : null;
            const categoryName = categoryRubyElement ? getRubyText(categoryRubyElement) : 'Unknown Category';
            const programItems = block.querySelectorAll('div.itemKyouka');
            programItems.forEach(item => {
                const anchorElement = item.querySelector('a');
                if (!anchorElement) return;
                const titleDiv = anchorElement.querySelector('div.title');
                const programName = titleDiv ? titleDiv.textContent.trim().replace(/\s+/g, ' ') : 'Unknown Program';
                let programLink = anchorElement.getAttribute('href');
                if (programLink) {
                    try { programLink = new URL(programLink, window.location.href).href; }
                    catch (e) { programLink = anchorElement.getAttribute('href'); }
                } else { programLink = '#'; }

                if (programName !== 'Unknown Program') {
                    programOverviewData.push({
                        "Category (Subject)": categoryName,
                        "Program Name": programName,
                        "Program Link": programLink
                    });
                }
            });
        });


        if (programOverviewData.length > 0) {
            currentExcelData[PROGRAM_OVERVIEW_SHEET_NAME] = programOverviewData;
            cacheCurrentExcelData(); // <<<< SAVE TO CACHE
            displayStatus(`Program overview updated: ${programOverviewData.length} programs.`);
        } else {
            displayStatus('No programs found in overview scan.', true);
        }
    }

    // --- Logic for Individual Program Pages ---
    async function scanEpisodesForCurrentProgram() {
        const isOnProgramPage = true;
        // ... (rest of scanEpisodesForCurrentProgram as before - ENSURE IT CALLS cacheCurrentExcelData() on success)
        const programNameElement = document.querySelector('#programHeader h2, .program-header__title, .program-detail__title');
        const programNameUnsanitized = programNameElement ? getRubyText(programNameElement) : "Unknown Program";
         if (programNameUnsanitized === "Unknown Program") {
            displayStatus("Could not determine program name from this page.", true, isOnProgramPage);
            return;
        }
        const programName = sanitizeSheetName(programNameUnsanitized); // Use sanitized for sheet name, but display original if needed
        const programSheetName = `${programName} Episodes`;
        const currentPageUrl = window.location.href;

        displayStatus(`Scanning episodes for "${programNameUnsanitized}"...`, false, isOnProgramPage);

        let existingEpisodesInSheet = (currentExcelData[programSheetName] || []).reduce((acc, ep) => {
            if(ep["Episode Link"]) acc[ep["Episode Link"]] = ep["Watched"];
            return acc;
        }, {});

        let newEpisodeListData = [];

        try {
            let docToScrapeEpisodesFrom = document;
            if (!currentPageUrl.includes('/onair/') && !document.querySelector('div.programList div.itemList a')) {
                const navHeader = document.querySelector('nav.nav-header');
                let episodeListPageUrl = null;
                if (navHeader) {
                    const links = navHeader.querySelectorAll('a');
                    for(const link of links){
                        if(link.getAttribute('href') && (link.getAttribute('href').includes('/onair/') || link.textContent.includes('放送リスト'))) {
                            episodeListPageUrl = new URL(link.getAttribute('href'), currentPageUrl).href;
                            break;
                        }
                    }
                }
                if (!episodeListPageUrl) {
                    const commonLink = document.querySelector('.onairLink a[href*="/onair/"], a.cbtn.school[href*="/onair/"]');
                    if (commonLink) episodeListPageUrl = new URL(commonLink.getAttribute('href'), currentPageUrl).href;
                }

                if (episodeListPageUrl && episodeListPageUrl !== currentPageUrl) {
                    displayStatus(`Fetching episode list from ${episodeListPageUrl}...`, false, isOnProgramPage);
                    docToScrapeEpisodesFrom = await fetchData(episodeListPageUrl);
                } else {
                     displayStatus(`Attempting to scrape episodes from current page: ${programNameUnsanitized}`, false, isOnProgramPage);
                }
            }

            const episodeItems = docToScrapeEpisodesFrom.querySelectorAll('div.programList div.itemList a');
            if (episodeItems.length === 0) {
                 displayStatus(`No episode items found for "${programNameUnsanitized}" with the current selectors.`, true, isOnProgramPage);
            }

            episodeItems.forEach(item => {
                const subTitleElement = item.querySelector('div.subTitle');
                const onairDateElement = item.querySelector('div.onair');
                const episodeTitle = (subTitleElement ? subTitleElement.textContent.trim() : (onairDateElement ? onairDateElement.textContent.trim() : 'Unknown Episode')).replace(/\s+/g, ' ');
                let episodeLink = item.getAttribute('href');
                if (episodeLink) {
                    try { episodeLink = new URL(episodeLink, docToScrapeEpisodesFrom.baseURI || currentPageUrl).href; }
                    catch(e) { console.warn("Invalid episode link:", item.getAttribute('href')); return; }
                } else { return; }

                const watchedStatus = existingEpisodesInSheet[episodeLink] || "No";
                newEpisodeListData.push({
                    "Episode Title": episodeTitle,
                    "Episode Link": episodeLink,
                    "Watched": watchedStatus
                });
            });

            currentExcelData[programSheetName] = newEpisodeListData;
            cacheCurrentExcelData(); // <<<< SAVE TO CACHE
            displayStatus(`"${programSheetName}" sheet updated: ${newEpisodeListData.length} episodes.`, false, isOnProgramPage);
            addEpisodeButtonsToPage();
        } catch (err) {
            displayStatus(`Error scanning episodes for "${programNameUnsanitized}": ${err.message}`, true, isOnProgramPage);
            console.error(err);
        }
    }

    function addEpisodeButtonsToPage() {
        const isOnProgramPage = true;
        // ... (rest of addEpisodeButtonsToPage - ENSURE button.onclick CALLS cacheCurrentExcelData())
        const programNameElement = document.querySelector('#programHeader h2, .program-header__title, .program-detail__title');
        let programNameUnsanitized = programNameElement ? getRubyText(programNameElement) : null;

        if (!programNameUnsanitized) {
            const pathParts = window.location.pathname.split('/').filter(Boolean);
            if (pathParts.length >= 3 && pathParts[0] === 'school') {
                let derivedName = pathParts[pathParts.length - (pathParts.includes('onair') ? 2 : 1)];
                const overview = currentExcelData[PROGRAM_OVERVIEW_SHEET_NAME] || [];
                const progEntry = overview.find(p => p["Program Link"] && p["Program Link"].includes(`/${pathParts[1]}/${derivedName}/`));
                programNameUnsanitized = progEntry ? progEntry["Program Name"] : derivedName;
            }
            if (!programNameUnsanitized) { console.warn("NHK Tracker: Could not determine program name for button addition."); return; }
        }
        programNameUnsanitized = programNameUnsanitized.replace(/\s+/g, ' ');
        const programName = sanitizeSheetName(programNameUnsanitized);
        const programSheetName = `${programName} Episodes`;

        const episodeListItems = document.querySelectorAll('div.programList div.itemList');
         if (episodeListItems.length === 0) {
            if(document.querySelector('div.programList')){ // Only show prompt if programList div exists but no items
                 displayStatus(`No episode items found on page for "${programNameUnsanitized}" to add buttons to.`, false, isOnProgramPage);
            }
            return;
        }

        const existingScanPrompt = document.querySelector('.nhk-scan-prompt-div');
        if (existingScanPrompt) existingScanPrompt.remove();

        if ((!currentExcelData[programSheetName] || currentExcelData[programSheetName].length === 0) && episodeListItems.length > 0) {
            const programListDiv = document.querySelector('div.programList');
            if (programListDiv) {
                const scanPromptDiv = document.createElement('div');
                scanPromptDiv.className = 'nhk-scan-prompt-div';
                scanPromptDiv.innerHTML = `Episode data for "<strong>${programNameUnsanitized}</strong>" is not yet tracked. <br>`;
                const scanNowButton = document.createElement('button');
                scanNowButton.textContent = 'Scan Episodes Now';
                scanNowButton.className = 'nhk-tracker-btn nhk-tracker-btn-info';
                scanNowButton.style.width = 'auto'; scanNowButton.style.display = 'inline-block'; scanNowButton.style.padding = '5px 10px';
                scanNowButton.onclick = async () => { await scanEpisodesForCurrentProgram(); scanPromptDiv.remove(); };
                scanPromptDiv.appendChild(scanNowButton);
                programListDiv.parentNode.insertBefore(scanPromptDiv, programListDiv);
            }
            return;
        }

        episodeListItems.forEach(itemDiv => {
            const anchor = itemDiv.querySelector('a');
            if (!anchor) return;
            let episodeLink = anchor.getAttribute('href');
            if (episodeLink) { try { episodeLink = new URL(episodeLink, window.location.href).href; } catch(e) { return; } } else { return; }

            const oldButton = itemDiv.querySelector('.nhk-episode-watched-toggle');
            if (oldButton) oldButton.remove();

            const episodeDataEntry = (currentExcelData[programSheetName] || []).find(ep => ep["Episode Link"] === episodeLink);
            let isWatched = false; let buttonText = "Mark Watched"; let buttonClass = "watched-false";

            if (episodeDataEntry) {
                isWatched = (episodeDataEntry["Watched"] === "Yes");
                buttonText = isWatched ? "Watched" : "Mark Watched";
                buttonClass = isWatched ? "watched-true" : "watched-false";
            } else {
                buttonText = "Not Tracked"; buttonClass = "not-tracked";
            }

            const button = document.createElement('button');
            button.className = `nhk-episode-watched-toggle ${buttonClass}`; button.textContent = buttonText;

            if (episodeDataEntry) {
                button.onclick = () => {
                    if (!currentExcelData[programSheetName]) return;
                    let epEntry = currentExcelData[programSheetName].find(ep => ep["Episode Link"] === episodeLink);
                    if (epEntry) {
                        epEntry["Watched"] = (epEntry["Watched"] === "Yes") ? "No" : "Yes";
                        isWatched = (epEntry["Watched"] === "Yes");
                        button.textContent = isWatched ? "Watched" : "Mark Watched";
                        button.classList.toggle('watched-true', isWatched);
                        button.classList.toggle('watched-false', !isWatched);
                        cacheCurrentExcelData(); // <<<< SAVE TO CACHE
                        displayStatus(`Episode status updated. Save Excel to persist.`, false, isOnProgramPage);
                    }
                };
            } else {
                button.disabled = true; button.title = "Episode not in tracker. Scan episodes.";
            }
            const detailDiv = itemDiv.querySelector('div.detail');
            if(detailDiv) detailDiv.appendChild(button); else itemDiv.appendChild(button);
        });
    }


    // --- Page Specific UI Initialization ---
    function initPageControls() {
        const controlsContainerId = 'nhk-tracker-controls-container';
        let isOnProgramPage = window.location.pathname.match(/^\/school\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/($|onair\/$)/);

        if (document.getElementById(controlsContainerId)) {
            if (isOnProgramPage) { addEpisodeButtonsToPage(); }
            return;
        }
        // ... (rest of initPageControls as before, ensuring displayStatus targets correctly)
        const controlsContainer = document.createElement('div');
        controlsContainer.id = controlsContainerId;

        const title = document.createElement('h4');
        title.textContent = 'NHK Tracker';
        title.style.textAlign = 'center'; title.style.marginBottom = '10px'; title.style.marginTop = '0';

        const excelFileInput = document.createElement('input');
        excelFileInput.type = 'file'; excelFileInput.id = 'excelFileInput'; excelFileInput.accept = ".xlsx, .xls";
        excelFileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                 if (Object.keys(currentExcelData).length > 0) {
                    if (!confirm("Loading this Excel will replace any currently cached data. Continue?")) {
                        event.target.value = null; return;
                    }
                }
                handleExcelFileLoad(file); // This now calls cacheCurrentExcelData
            }
            event.target.value = null;
        };

        const loadExcelButton = document.createElement('button');
        loadExcelButton.textContent = 'Load Data (Excel)';
        loadExcelButton.className = 'nhk-tracker-btn';
        loadExcelButton.onclick = () => excelFileInput.click();

        const saveExcelButton = document.createElement('button');
        saveExcelButton.textContent = 'Save Data (Excel)';
        saveExcelButton.className = 'nhk-tracker-btn nhk-tracker-btn-success';
        saveExcelButton.onclick = saveToExcel;

        controlsContainer.appendChild(title);
        controlsContainer.appendChild(loadExcelButton);
        controlsContainer.appendChild(excelFileInput);
        controlsContainer.appendChild(saveExcelButton);

        let statusDivToUse = statusDivGlobal;

        if (window.location.pathname === '/school/program/') {
            const scanOverviewButton = document.createElement('button');
            scanOverviewButton.textContent = 'Scan/Update Program List';
            scanOverviewButton.className = 'nhk-tracker-btn nhk-tracker-btn-info';
            scanOverviewButton.onclick = scanProgramOverview; // This now calls cacheCurrentExcelData
            controlsContainer.appendChild(scanOverviewButton);
        } else if (isOnProgramPage) {
            const scanEpisodesButton = document.createElement('button');
            scanEpisodesButton.textContent = 'Scan/Update Episodes (This Program)';
            scanEpisodesButton.className = 'nhk-tracker-btn nhk-tracker-btn-info';
            scanEpisodesButton.onclick = scanEpisodesForCurrentProgram; // This now calls cacheCurrentExcelData
            controlsContainer.appendChild(scanEpisodesButton);
            statusDivOnProgramPage.id = 'nhk-tracker-program-page-status';
            statusDivToUse = statusDivOnProgramPage;
        }
        controlsContainer.appendChild(statusDivToUse);
        document.body.appendChild(controlsContainer);

        console.log("NHK Tracker: initPageControls - On program page. Will attempt to add episode buttons after a short delay.");
        setTimeout(() => {
            console.log("NHK Tracker: initPageControls - setTimeout fired. Calling addEpisodeButtonsToPage.");
            addEpisodeButtonsToPage();
        }, 1000);
    }

    // --- Main Execution ---
    loadExcelDataFromCache(); // Load any previously saved data at the very start
    initPageControls();

})();