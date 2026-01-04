// ==UserScript==
// @name          Wanikani Levels Overview Plus
// @namespace     Mercieral
// @description   Improves the levels overview popup with progress indications
// @match         https://www.wanikani.com/*
// @match         https://preview.wanikani.com/*
// @version       2.2.4
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/394132/Wanikani%20Levels%20Overview%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/394132/Wanikani%20Levels%20Overview%20Plus.meta.js
// ==/UserScript==

(function() {
    // Require the WK open resource
    if (!window.wkof) {
        alert('"Wanikani Levels Overview Plus" script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }

    // Initialize the level stage data array
    const levelCounts = [];
    for (let i = 0; i < 61; i++) {
        levelCounts.push({
            locked: 0,
            unlocked: 0,
            apprentice: 0,
            guru: 0,
            master: 0,
            enlighten: 0,
            burn: 0,
            nextReviewItem: null,
            longestReviewItem: null,
        });
    }

    window.wkof.include('ItemData,Settings');
    window.wkof.ready('document,ItemData,Settings')
        .then(load_settings)
        .then(initCSS)
        .then(sortData)
        .then(finishUI)
        .catch(loadError);

    /**
     * Loads the saved settings for this script
     */
    function load_settings () {
        return window.wkof.Settings.load('levelOverviewPlus', {
            showNextReview: true
        })
    }

    /**
     * Parse the data once the document and WKOF data is ready
     */
    function sortData () {
        if (window.wkof.ItemData == null) {
            return Promise.reject();
        }
        const config = {
            wk_items: {
                options: {assignments: true}
            }
        };
        return window.wkof.ItemData.get_items(config).then(function (processItems) {
            if (processItems == null) {
                return Promise.reject();
            }
            for (let i = 0, itemsLen = processItems.length; i < itemsLen; i++) {
                const item = processItems[i];
                if (item != null) {
                    const srsLevel = item.assignments && item.assignments.srs_stage;
                    const unlockedDate = item.assignments && item.assignments.unlocked_at;
                    const level = item.data && item.data.level;
                    const levelStageCounts = levelCounts[level];
                    if (levelStageCounts == null) {
                        // skip this item...
                        continue;
                    }

                    // Increment the appropriate level's stage counter for this item
                    if (srsLevel == null || srsLevel === 0) {
                        // Checking for unlocked date allows "unlocked but unstarted" items to be considered separately if needed
                        if (unlockedDate == null) {
                            levelStageCounts.locked++;
                        }
                        else {
                            levelStageCounts.unlocked++;
                        }
                    } else if (srsLevel < 5) {
                        levelStageCounts.apprentice++;
                    } else if (srsLevel < 7) {
                        levelStageCounts.guru++;
                    } else if (srsLevel === 7) {
                        levelStageCounts.master++;
                    } else if (srsLevel === 8) {
                        levelStageCounts.enlighten++;
                    } else if (srsLevel === 9) {
                        levelStageCounts.burn++;
                    }

                    // Check if this is the furthest item from burning
                    let nextReviewDate = item.assignments && item.assignments.available_at && new Date(item.assignments.available_at);
                    if ((nextReviewDate == null && srsLevel == 8 && levelStageCounts.longestReviewItem == null) ||
                        (nextReviewDate != null && (
                            levelStageCounts.longestReviewItem == null ||
                            srsLevel < levelStageCounts.longestReviewItem.level ||
                            (srsLevel == levelStageCounts.longestReviewItem.level && nextReviewDate > levelStageCounts.longestReviewItem.nextReviewDate)
                        ))) {
                        levelStageCounts.longestReviewItem = {
                            level: srsLevel,
                            nextReviewDate: nextReviewDate,
                        };
                    }

                    // Check if this is the next item for review for its level
                    if (nextReviewDate != null && (levelStageCounts.nextReviewItem == null || nextReviewDate < levelStageCounts.nextReviewItem.reviewDate)) {
                        levelStageCounts.nextReviewItem = {
                            reviewDate: nextReviewDate,
                            characters: item.data.characters,
                            type: item.object,
                        }
                        if (item.data.characters == null) {
                            const itemImg = item.data.character_images.filter((img) => {
                                return (img.content_type === 'image/svg+xml' && !img.metadata.inline_styles);
                            })[0];
                            levelStageCounts.nextReviewItem.imgUrl = itemImg && itemImg.url;
                            levelStageCounts.nextReviewItem.slug = item.data.slug;
                        }
                    }
                }
            }
            return Promise.resolve();
        });
    }

    /**
     * Create the UI once the data has been parsed into the data array
     */
    function finishUI () {
        // Get the HTML square elements for each level in the popout
        const levelBlocks = document.querySelectorAll('.sitemap__expandable-chunk--levels .sitemap__grouped-pages > ol > li > a');
        for (let levelBlock of levelBlocks) {
            overwriteLevelBlock(levelBlock);
        }
        createSettings();
        updateLevelHeader();

        /**
         * Overwrite the level block with the custom elements and tooltip
         */
        function overwriteLevelBlock (levelBlock) {
            levelBlock.classList.add('level-block');
            const originalLevelText = levelBlock.textContent;
            const levelStageCounts = levelCounts[Number(originalLevelText)];
            const levelTotal = levelStageCounts.locked + levelStageCounts.unlocked + levelStageCounts.apprentice + levelStageCounts.guru + levelStageCounts.master + levelStageCounts.enlighten + levelStageCounts.burn;

            // Create the overlay elements
            const levelText = `<span class="level-block-text">${originalLevelText}</span>`;
            const lockedDiv = `<div class="level-block-item level-block-locked" style="width:${(levelStageCounts.locked + levelStageCounts.unlocked)/levelTotal*100}%"></div>`;
            const apprenticeDiv = `<div class="level-block-item level-block-apprentice" style="width:${levelStageCounts.apprentice/levelTotal*100}%"></div>`;
            const guruDiv = `<div class="level-block-item level-block-guru" style="width:${levelStageCounts.guru/levelTotal*100}%"></div>`;
            const masterDiv = `<div class="level-block-item level-block-master" style="width:${levelStageCounts.master/levelTotal*100}%"></div>`;
            const enlightenedDiv = `<div class="level-block-item level-block-enlightened" style="width:${levelStageCounts.enlighten/levelTotal*100}%"></div>`;
            const burnDiv = `<div class="level-block-item level-block-burn" style="width:${levelStageCounts.burn/levelTotal*100}%"></div>`;

            // Create the tooltip
            const lockedText = `<div class="locked-tooltip tooltip-section"><p class="tooltip-section-title">Locked</p><p class="tooltip-section-count">${levelStageCounts.locked + levelStageCounts.unlocked}</p></div>`;
            const apprenticeText = `<div class="apprentice-tooltip tooltip-section"><p class="tooltip-section-title">Apprentice</p><p class="tooltip-section-count">${levelStageCounts.apprentice}</p></div>`;
            const guruText = `<div class="guru-tooltip tooltip-section"><p class="tooltip-section-title">Guru</p><p class="tooltip-section-count">${levelStageCounts.guru}</p></div>`;
            const masterText = `<div class="master-tooltip tooltip-section"><p class="tooltip-section-title">Master</p><p class="tooltip-section-count">${levelStageCounts.master}</p></div>`;
            const enlightenedText = `<div class="enlightened-tooltip tooltip-section"><p class="tooltip-section-title">Enlightened</p><p class="tooltip-section-count">${levelStageCounts.enlighten}</p></div>`;
            const burnText = `<div class="burn-tooltip tooltip-section"><p class="tooltip-section-title">Burn</p><p class="tooltip-section-count">${levelStageCounts.burn}</p></div>`;
            const totalText = `<div class="total-tooltip tooltip-section"><p class="tooltip-section-title">Total</p><p class="tooltip-section-count">${levelTotal}</p></div>`;
            let nextReviewDateText = "N/A";
            let nextReviewChars = "N/A";
            const nextReview = levelStageCounts.nextReviewItem;
            let loadImgData;
            if (nextReview != null) {
                // Get the time amount until review
                const nextReviewMinutes = (new Date(nextReview.reviewDate) - new Date()) / (1000 * 60);
                const nextReviewHours = nextReviewMinutes / 60;
                if (nextReviewHours <= 0) {
                    nextReviewDateText = "now";
                } else if (nextReviewHours <= 1) {
                    const minutes = Math.floor(nextReviewMinutes);
                    nextReviewDateText = minutes + " minute" + (minutes !== 1 ? "s" : '');
                } else if (nextReviewHours >= 24) {
                    const days = Math.floor(nextReviewHours / 24);
                    nextReviewDateText = days + " day" + (days !== 1 ? "s" : '');
                } else {
                    const hours = Math.floor(nextReviewHours);
                    nextReviewDateText = hours + " hour" + (hours !== 1 ? "s" : '');
                }

                // Get the review item characters
                let itemClass = "guru-tooltip";
                if (nextReview.type === "radical") {
                    itemClass = "enlightened-tooltip";
                } else if (nextReview.type === "kanji") {
                    itemClass = "apprentice-tooltip";
                }
                if (nextReview.characters) {
                    nextReviewChars = `<span class="${itemClass} next-review-chars">${nextReview.characters}</span>`;
                }
                else if (nextReview.imgUrl && nextReview.slug) {
                    nextReviewChars = `<span class="${itemClass} next-review-chars" id="svg_${nextReview.slug}"></span>`;
                    loadImgData = nextReview;
                }
            }

            let longestReviewDate = 'N/A';
            if (levelStageCounts.burn === levelTotal) {
                longestReviewDate = 'Done!';
            }
            else if (levelStageCounts.longestReviewItem && levelStageCounts.locked == 0) {
                longestReviewDate = levelStageCounts.longestReviewItem.nextReviewDate;
                const currLevel = levelStageCounts.longestReviewItem.level;

                if (longestReviewDate == null) {
                    longestReviewDate = 'Now!';
                }
                else {
                    let hoursToAdd = 0;
                    let daysToAdd = 0;
                    let monthsToAdd = 0;

                    /*  Apprentice 1 → 4 hours → Apprentice 2
                        Apprentice 2 → 8 hours → Apprentice 3
                        Apprentice 3 → 1 day → Apprentice 4
                        Apprentice 4 → 2 days → Guru 1
                        Guru 1 → 1 week → Guru 2
                        Guru 2 → 2 weeks → Master
                        Master → 1 month → Enlightened
                        Enlightened → 4 months → Burned

                        For Level 1 & 2 the SRS timings are accelerated for the Apprentice stage.
                        Apprentice 1 → 2 hours → Apprentice 2
                        Apprentice 2 → 4 hours → Apprentice 3
                        Apprentice 3 → 8 hours → Apprentice 4
                        Apprentice 4 → 1 day → Guru 1 */

                    if (currLevel <= 7) monthsToAdd += 4;
                    if (currLevel <= 6) monthsToAdd += 1;
                    if (currLevel <= 5) daysToAdd += 14;
                    if (currLevel <= 4) daysToAdd += 7;
                    if (Number(originalLevelText) <= 2) {
                        if (currLevel <= 3) daysToAdd += 1;
                        if (currLevel <= 2) hoursToAdd += 8;
                        if (currLevel <= 1) hoursToAdd += 4;
                    }
                    else {
                        if (currLevel <= 3) daysToAdd += 2;
                        if (currLevel <= 2) daysToAdd += 1;
                        if (currLevel <= 1) hoursToAdd += 8;
                    }

                    if (monthsToAdd) {
                        longestReviewDate.setMonth(longestReviewDate.getMonth() + monthsToAdd);
                    }
                    if (daysToAdd) {
                        longestReviewDate.setDate(longestReviewDate.getDate() + daysToAdd);
                    }
                    if (hoursToAdd) {
                        longestReviewDate.setHours(longestReviewDate.getHours() + hoursToAdd);
                    }
                    longestReviewDate = longestReviewDate.toLocaleString([], {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    });
                }
            }

            const nextReviewText = `<p class="tooltip-extra-info next-review-text">Next: ${nextReview ? `${nextReviewChars} (${nextReviewDateText})` : "N/A"}</p>`;
            const burnDateText = `<p class="tooltip-extra-info next-review-text">Burn: ${longestReviewDate}</p>`;
            const tooltip = `<div class="level-tooltip"><p class="tooltip-level-text">Level ${originalLevelText}</p>${lockedText}${apprenticeText}${guruText}${masterText}${enlightenedText}${burnText}${totalText}${nextReviewText}${burnDateText}</div>`;

            if (levelStageCounts.burn === levelTotal) {
                // Fully burned level, add the checkbox to the div
                levelBlock.classList.add('level-block-complete');
            }

            if (levelStageCounts.locked === levelTotal) {
                // Fully locked level, add the padlock to the div
                levelBlock.classList.add('level-block-full-locked');
            }

            // Rewrite the level block's HTML with the custom elements
            levelBlock.innerHTML = `<div class="level-block-container">${apprenticeDiv}${guruDiv}${masterDiv}${enlightenedDiv}${burnDiv}${lockedDiv}</div>${levelText}${tooltip}`;

            if (loadImgData != null && loadImgData.imgUrl) {
                wkof.load_file(loadImgData.imgUrl).then((svgData) => {
                    const destSpan = document.getElementById(`svg_${loadImgData.slug}`);
                    if (destSpan) {
                        destSpan.innerHTML = svgData;
                    }
                });
            }
        }

        /**
         * Create the settings button and panel with contents
         */
        function createSettings () {
            // Create the settings popop
            const settingsButton = document.createElement('div');
            settingsButton.id = "settings-button";
            const settingsPanel = document.createElement('div');
            settingsPanel.id = "settings-panel"
            settingsPanel.innerHTML = `<div id='settings-title'>Levels Overview Plus Settings</div><div id="showNextRow" class="settings-row"><input id="showNextCb" type="checkbox"><span>Show Next Review</span></div>`;
            document.querySelector('.sitemap__grouped-pages').append(settingsButton, settingsPanel);
            const showNextToggle = document.getElementById("showNextCb");
            const showNextSetting = document.getElementById("showNextRow");

            // Handling hiding/showing the settings panel
            let settingsPanelActive = false;
            function handleBodyClick (e) {
                if (settingsPanelActive && !e.target.closest("#settings-panel") && e.target.id !== 'settings-button') {
                    settingsPanel.style.display = 'none';
                    settingsButton.style.backgroundColor = "";
                    settingsPanelActive = false;
                }
            }
            document.body.addEventListener('mouseup', handleBodyClick);

            settingsButton.onclick = () => {
                settingsPanelActive = !settingsPanelActive;
                if (settingsPanelActive) {
                    settingsPanel.style.display = 'block';
                    settingsButton.style.backgroundColor = "#b0b0b0";
                } else {
                    settingsPanel.style.display = 'none';
                    settingsButton.style.backgroundColor = "";
                }
            };

            // Handle the "toggle next review" checkbox
            const nextReviewTexts = Array.from(document.getElementsByClassName('next-review-text'));
            const updateNextReviewTexts = () => {
                const checked = window.wkof.settings.levelOverviewPlus.showNextReview;
                if(checked) {
                    nextReviewTexts.forEach((nrt) => nrt.style.display = 'block');
                } else {
                    nextReviewTexts.forEach((nrt) => nrt.style.display = 'none');
                }
            }
            const showNextReviewChanged = () => {
                window.wkof.settings.levelOverviewPlus.showNextReview = showNextToggle.checked;
                window.wkof.Settings.save('levelOverviewPlus');
                updateNextReviewTexts();
            }
            showNextToggle.onchange = showNextReviewChanged;
            updateNextReviewTexts();
            showNextToggle.checked = window.wkof.settings.levelOverviewPlus.showNextReview;
            showNextSetting.onclick = () => {
                showNextToggle.checked = !window.wkof.settings.levelOverviewPlus.showNextReview;
                showNextReviewChanged();
            };
        }

        /**
         * Append a "+" to the level nav text to indicate script success
         */
        function updateLevelHeader () {
            document.querySelectorAll('.navigation > .sitemap > li:first-child > .sitemap__section-header > span').forEach((levelSpan) => levelSpan.append('+'));
        }
    }

    /**
     * Create the CSS style sheet and append it to the document
     */
    function initCSS() {
        const styling = document.createElement('style');
        styling.innerHTML = `
            .level-block {
                position: relative;
                height: 46px;
                border-width: 0 !important;
            }

            .level-block-text {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                text-align: center;
                line-height: 46px;
            }

            #settings-button {
                width: 28px;
                height: 28px;
                position: absolute;
                top: 8px;
                right: 8px;
                cursor: pointer;
                border-radius: 5px;
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABaklEQVR4Xu2aTUoDQRCFv2yNP9cInsCtbkWCl9EraE4jwWXIVo8gXiIkxL0URNBON3Yyq6p6s00z9Hv1VVdPpUYkf0bJ9SMDREByB5QCyQHQIagUUAokd0Ap0ABgAjwBN8CZc0i+gCXwAHyUWmoEmPh34MK58HL7a+CqNKFmwAswDSb+R8681FYzYBMA+1b8tqW2mgG2aByUgC4DDJO7oAZYet//1pbpEFztDsHP/wyw360SPO/K4KlzGgz7BfAI/BFvunQRch7dwdsXAYMtdP4CEeA8gIO3LwIGW+j8BS0CLoEZcA2cONd4cD/AxL8B586FH90PeAVug4k/qB9gyHjHXv2AhgPqB6gfUHwSt8qg+gFBq8CeLF2Fs0S6pVMEiIDkDigFkgPQ/F9A/QD1A2LmRtd8gPoBmg/QfEDIISnNB2g+oFLZdBWOWe77VYmAfq9irhQBMePar0oE9HsVc6UIiBnXflXpCfgGC8dCQbbkoGgAAAAASUVORK5CYII=');
                background-position: center !important;
                background-repeat: no-repeat !important;
                background-size: 18px !important;
            }

            #settings-panel {
                display: none;
                position: absolute;
                padding: 10px 15px;
                background-color: #2a2a2a;
                border-radius: 4px;
                top: 40px;
                right: 8px;
                user-select: none;
            }

            #settings-title {
                font-weight: bold;
                font-size: 14px;
            }

            .settings-row {
                padding: 8px 0 0 10px;
                font-size: 12px;
                line-height: 20px;
                cursor: pointer;
            }

            .settings-row input {
                margin: 0 3px 0 0;
                width: 20px;
                height: 20px;
            }

            .level-tooltip {
                color: #eeeeee;
                visibility: hidden;
                background-color: rgba(0,0,0,0.8);
                text-align: center;
                padding: 0 10px 2px 10px;
                margin-left: 52px;
                margin-top: -5px;
                border-radius: 6px;
                position: absolute;
                z-index: 2;
                width: 160px;
                font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif !important;
                pointer-events: none;
                box-sizing: content-box;
            }

            .tooltip-level-text {
                font-size: 16px;
                margin: 5px 0;
                font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif !important;
                line-height: 26px;
            }

            .tooltip-extra-info {
                font-size: 12px;
                text-align: left;
                margin: 0;
                font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif !important;
                white-space: normal;
                text-shadow: none;
                text-indent: -20px;
                padding-left: 20px;
                padding-bottom: 6px;
                line-height: 18px;
            }

            .next-review-chars {
                text-shadow: none;
                padding: 0 3px;
                font-size: 14px;
            }

            svg.radical {
                fill:none;
                stroke:#fff;
                stroke-linecap:square;
                stroke-miterlimit:2;
                stroke-width:68px;
                height: 15px;
                vertical-align: top;
                margin-top: 1.5px;
            }

            .tooltip-section {
                clear: both;
                overflow: auto;
                padding: 3px 10px;
                line-height: 18px;
            }

            .tooltip-section-title {
                float: left;
                margin: 0;
                font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif !important;
                font-size: 11px;
                font-weight: bold;
                text-shadow: none;

            }

            .tooltip-section-count {
                float: right;
                margin: 0;
                font-weight: bold;
                font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif !important;
                font-size: 11px;
                text-shadow: none;
            }

            .locked-tooltip {
                background-color: #666;
                background-image: linear-gradient(to bottom, #666, #444);
            }

            .apprentice-tooltip {
                background-color: #dd0093;
                background-image: linear-gradient(to bottom, #ff00aa, #b30077);
            }

            .guru-tooltip {
                background-color: #882d9e;
                background-image: linear-gradient(to bottom, #aa38c7, #662277);
            }

            .master-tooltip {
                background-color: #294ddb;
                background-image: linear-gradient(to bottom, #516ee1, #2142c4);
            }

            .enlightened-tooltip {
                background-color: #0093dd;
                background-image: linear-gradient(to bottom, #00aaff, #0077b3);
            }

            .burn-tooltip {
                background-color: #fbc042;
                background-image: linear-gradient(to bottom, #fbc550, #c88a04);
                color: #ffffff;
            }

            .total-tooltip {
                background-color: #efefef;
                background-image: linear-gradient(to bottom, #efefef, #cfcfcf);
                color: #000000;
                margin-bottom: 10px;
            }

            .level-block:hover .level-tooltip {
                visibility: visible;
            }

            .sitemap__pages--levels .sitemap__page--current-level a .level-block-container {
                border: medium solid black !important;
            }

            .sitemap__pages--levels .sitemap__page a {
                border-radius: 4px;
            }

            .sitemap__pages--levels .sitemap__page a .level-block-container:hover {
                background-color: rgba(255,255,255,0.5);
            }

            .sitemap__grouped-pages, .sitemap__expandable-chunk>*:first-child {
                overflow: visible !important;
            }

            .level-block-container {
                height: 100%;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                overflow: hidden;
                border-radius: 4px;
                border: thin solid black !important;
                box-sizing: border-box;
            }

            .level-block-complete {
                background-position: center !important;
                background-repeat: no-repeat !important;
                background-size: 34px !important;
                background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjM1Mi42MnB4IiBoZWlnaHQ9IjM1Mi42MnB4IiB2aWV3Qm94PSIwIDAgMzUyLjYyIDM1Mi42MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzUyLjYyIDM1Mi42MjsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9IiMwMDY2MDAiIHN0cm9rZT0iIzAwNjYwMCI+DQo8Zz4NCgk8cGF0aCBkPSJNMzM3LjIyMiwyMi45NTJjLTE1LjkxMi04LjU2OC0zMy42Niw3Ljk1Ni00NC4wNjQsMTcuNzQ4Yy0yMy44NjcsMjMuMjU2LTQ0LjA2Myw1MC4xODQtNjYuNzA4LDc0LjY2NA0KCQljLTI1LjA5MiwyNi45MjgtNDguMzQ4LDUzLjg1Ni03NC4wNTIsODAuMTczYy0xNC42ODgsMTQuNjg4LTMwLjYsMzAuNi00MC4zOTIsNDguOTZjLTIyLjAzMi0yMS40MjEtNDEuMDA0LTQ0LjY3Ny02NS40ODQtNjMuNjQ4DQoJCWMtMTcuNzQ4LTEzLjQ2NC00Ny4xMjQtMjMuMjU2LTQ2LjUxMiw5LjE4YzEuMjI0LDQyLjIyOSwzOC41NTYsODcuNTE3LDY2LjA5NiwxMTYuMjhjMTEuNjI4LDEyLjI0LDI2LjkyOCwyNS4wOTIsNDQuNjc2LDI1LjcwNA0KCQljMjEuNDIsMS4yMjQsNDMuNDUyLTI0LjQ4LDU2LjMwNC0zOC41NTZjMjIuNjQ1LTI0LjQ4LDQxLjAwNS01Mi4wMjEsNjEuODEyLTc3LjExMmMyNi45MjgtMzMuMDQ4LDU0LjQ2OC02NS40ODUsODAuNzg0LTk5LjE0NQ0KCQlDMzI2LjIwNiw5Ni4zOTIsMzc4LjIyNiw0NC45ODMsMzM3LjIyMiwyMi45NTJ6IE0yNi45MzcsMTg3LjU4MWMtMC42MTIsMC0xLjIyNCwwLTIuNDQ4LDAuNjExDQoJCWMtMi40NDgtMC42MTEtNC4yODQtMS4yMjQtNi43MzItMi40NDhsMCwwQzE5LjU5MywxODQuNTIsMjIuNjUzLDE4NS4xMzIsMjYuOTM3LDE4Ny41ODF6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==') !important;
            }

            .level-block-full-locked {
                background-position: center !important;
                background-repeat: no-repeat !important;
                background-size: 36px !important;
                background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjM0cHgiIGhlaWdodD0iMzRweCIgdmlld0JveD0iMCAwIDM0IDM0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzNCAzNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHN0cm9rZT0iIzY2NjY2NiIgZmlsbD0iIzY2NjY2NiI+DQo8Zz4NCgk8cGF0aCBkPSJNMjYuODMzLDEzLjMzM1Y5YzAtNC45NjItNC4wMzgtOS05LTloLTEuNjY2Yy00Ljk2MiwwLTksNC4wMzgtOSw5djQuMzMzSDQuMzMzVjM0aDI1LjMzNFYxMy4zMzNIMjYuODMzeiBNMTEuMTY3LDkNCgkJYzAtMi43NTcsMi4yNDMtNSw1LTVoMS42NjZjMi43NTcsMCw1LDIuMjQzLDUsNXY0LjMzM0gxMS4xNjdWOXoiLz4NCjwvZz4NCjwvc3ZnPg0K') !important;
            }

            .level-block-item {
                height: 100%;
                display: inline-block;
            }

            .level-block-locked {
                background-color: rgba(0, 0, 0, 0.3);
            }

            .level-block-apprentice {
                background-color: rgba(221, 0, 147, 0.4);
            }

            .level-block-guru {
                background-color: rgba(136, 45, 158, 0.4);
            }

            .level-block-master {
                background-color: rgba(41, 77, 219, 0.4);
            }

            .level-block-enlightened {
                background-color: rgba(0, 147, 221, 0.4);
            }

            .level-block-burn {
                background-color: rgba(251, 192, 66, 0.4);
            }
        `;
        document.head.append(styling);
        return Promise.resolve();
    }

    /**
     * log an error if any part of the wkof data request failed
     * @param {*} [e] - The error to log if it exists
     */
    function loadError (e) {
        console.error('Failed to load data from WKOF for "Wanikani Levels Overview Plus"', e);
    }
})();
