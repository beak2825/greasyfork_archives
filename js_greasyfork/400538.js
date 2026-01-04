// ==UserScript==
// @name          Wanikani Level SRS Details
// @namespace     Mercieral
// @description   Improves the levels details page with specific item SRS statuses
// @license MIT
// @include       /^https:\/\/(www|preview)\.wanikani\.com\/level\/\d+$/
// @version       1.0.1
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/400538/Wanikani%20Level%20SRS%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/400538/Wanikani%20Level%20SRS%20Details.meta.js
// ==/UserScript==

(function() {
    // Require the WK open resource
    if (!window.wkof) {
        alert('"Wanikani Level SRS Details" script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }

    let level, levelItems = [];
    let items = new Map();

    let styles = {
        locked: {
            light: '#666',
            dark: '#444'
        },
        apprentice: {
            light: '#ff00aa',
            dark: '#b30077'
        },
        guru: {
            light: '#aa38c7',
            dark: '#662277'
        },
        master: {
            light: '#516ee1',
            dark: '#2142c4'
        },
        enlightened: {
            light: '#00aaff',
            dark: '#0077b3'
        },
        burned: {
            light: '#fbc550',
            dark: '#c88a04'
        }
    }

    let legend = document.querySelector('.subject-legend__items');
    legend.innerHTML =`<p style='text-align: center'>Loading Level SRS Details...</p>`;

    Promise.all([getItemData(), initCSS(), getIDs()])
        .then(updateElements)
        .then(sortItems)
        .then(updateLegend)
    .catch(loadError);

    function getIDs () {
        // Get the level number from the page title
        level = document.title.match(/\d+/)[0];
        ["radical", "kanji", "vocabulary"].forEach((itemType) => {
            // Get references to the actual HTML element for each item to be used later
            let elements = Array.from(document.getElementsByClassName(`character-grid__item--${itemType}`));
            elements.forEach((element, i) => {
                const linkElement = element.getElementsByTagName('a')[0];
                items.set(linkElement.href, {
                    element: element,
                    linkElement: linkElement
                });
            });
        });
        return Promise.resolve();
    }

    function getItemData () {
        window.wkof.include('ItemData');
        return new Promise(function (resolve, reject) {
            // Load the WKOF itemData module
            window.wkof.ready('ItemData').then(function () {
                if (window.wkof.ItemData == null) {
                    reject();
                    return;
                }
                const config = {
                    wk_items: {
                        options: {assignments: true},
                        filters: {level: level}
                    }
                };
                // Load each item's data for this level using the WKOF module
                window.wkof.ItemData.get_items(config).then(function (wkofResults) {
                    levelItems = wkofResults;
                    resolve();
                }).catch(function (e) {
                    reject(e);
                });
            }).catch(function (e) {
                reject(e);
            });
        });
    }

    function updateElements () {
        // Loop through each item element crossreferencing with the WKOF data to update styling based on SRS level
        levelItems.forEach((levelItemData) => {
            let mapRes = items.get(levelItemData.data.document_url);
            let itemElement = mapRes && mapRes.element;
            let linkElement = mapRes && mapRes.linkElement;
            if (linkElement) {
                linkElement.classList.add('updated-item-element');
                let srsLevel = levelItemData && levelItemData.assignments && levelItemData.assignments.srs_stage;
                if (srsLevel == null) {
                    // locked
                    linkElement.classList.add('locked-item');
                    srsLevel = -1;
                }
                else if (srsLevel === 0) {
                    // unlocked
                    linkElement.classList.add('locked-item');
                } else if (srsLevel < 5) {
                    // apprentice
                    linkElement.classList.add('apprentice-item');
                    let characterSpan = itemElement.getElementsByClassName('character-item__characters').item(0);
                    if (characterSpan.length != 0) {
                        let subLevelDiv = document.createElement('div');
                        subLevelDiv.classList.add('sublevel-container');
                        subLevelDiv.innerHTML = `
                            <div class='sublevel-box ${srsLevel >= 1 ? 'sublevel-checked' : 'sublevel-unchecked'}'></div>
                            <div class='sublevel-box ${srsLevel >= 2 ? 'sublevel-checked' : 'sublevel-unchecked'}'></div>
                            <div class='sublevel-box ${srsLevel >= 3 ? 'sublevel-checked' : 'sublevel-unchecked'}'></div>
                            <div class='sublevel-box ${srsLevel >= 4 ? 'sublevel-checked' : 'sublevel-unchecked'}'></div>
                        `;
                        characterSpan.after(subLevelDiv);
                    }
                } else if (srsLevel < 7) {
                    // guru
                    linkElement.classList.add('guru-item');
                    let characterSpan = itemElement.getElementsByClassName('character-item__characters').item(0);
                    if (characterSpan.length != 0) {
                        let subLevelDiv = document.createElement('div');
                        subLevelDiv.classList.add('sublevel-container');
                        subLevelDiv.innerHTML = `
                            <div class='sublevel-box ${srsLevel >= 5 ? 'sublevel-checked' : 'sublevel-unchecked'}'></div>
                            <div class='sublevel-box ${srsLevel >= 6 ? 'sublevel-checked' : 'sublevel-unchecked'}'></div>
                        `;
                        characterSpan.after(subLevelDiv);
                    }
                } else if (srsLevel === 7) {
                    // master
                    linkElement.classList.add('master-item');
                } else if (srsLevel === 8) {
                    // enlightened
                    linkElement.classList.add('enlightened-item');
                } else if (srsLevel === 9) {
                    // burned!
                    linkElement.classList.add('burned-item');
                    linkElement.classList.remove("character-item--burned");
                } else {
                    // locked....?
                    srsLevel = -1;
                    linkElement.classList.add('locked-item');
                }
                itemElement.setAttribute("level", srsLevel);
            } else {
                console.log('missing element for: ', levelItemData);
            }
        });
        return Promise.resolve();
    }

    function sortItems() {
        const sections = Array.from(document.getElementsByClassName(`character-grid__items`));
        sections.forEach((ul) => {
            let items = Array.from(ul.children);
            items = items.sort(function(a, b) {
                var aLevel = parseInt(a.getAttribute('level'));
                var bLevel = parseInt(b.getAttribute('level'));
                if (aLevel > bLevel) return 1;
                else if (aLevel < bLevel) return -1;
                else return 0;
            });
            items.forEach(node=>ul.appendChild(node));
        });
        return Promise.resolve();
    }

    function updateLegend () {
       // <li title="Locked" style="width:16%;">
        legend.innerHTML = `
            <li class="subject-legend__item" title="Locked" style="flex: 0 0 16%;">
                <span lang="ja" class="subject-legend__item-badge--recently-unlocked" style="background-color: ${styles.locked.light};">字</span>
                <div class="subject-legend__item-title">Locked</div>
            </li>
            <li class="subject-legend__item" title="Apprentice" style="flex: 0 0 16%;">
                <span lang="ja" class="subject-legend__item-badge--recently-unlocked" style="background-color: ${styles.apprentice.light};">字</span>
                <div class="subject-legend__item-title">Apprentice</div>
            </li>
            <li class="subject-legend__item" title="Guru" style="flex: 0 0 16%;">
                <span lang="ja" class="subject-legend__item-badge--recently-unlocked" style="background-color: ${styles.guru.light};">字</span>
                <div class="subject-legend__item-title">Guru</div>
            </li>
            <li class="subject-legend__item" title="Master" style="flex: 0 0 16%;">
                <span lang="ja" class="subject-legend__item-badge--recently-unlocked" style="background-color: ${styles.master.light};">字</span>
                <div class="subject-legend__item-title">Master</div>
            </li>
            <li class="subject-legend__item" title="Enlightened" style="flex: 0 0 16%;">
                <span lang="ja" class="subject-legend__item-badge--recently-unlocked" style="background-color: ${styles.enlightened.light};">字</span>
                <div class="subject-legend__item-title">Enlightened</div>
            </li>
            <li class="subject-legend__item" title="Burned" style="flex: 0 0 16%;">
                <span lang="ja" class="subject-legend__item-badge--recently-unlocked" style="background-color: ${styles.burned.light};">字</span>
                <div class="subject-legend__item-title">Burned</div>
            </li>
        `;
        return Promise.resolve();
    }

    function initCSS () {
        const styling = document.createElement('style');
        styling.innerHTML = `
            .updated-item-element {
                border-bottom-width: 0 !important;
                border-right-width: 0 !important;
                box-shadow: 0 0 0 rgba(0,0,0,0.4) inset !important;
                -webkit-box-shadow: 0 0 0 rgba(0,0,0,0.4) inset !important;
            }

            .multi-character-grid .updated-item-element {
                border-left: none !important;
            }

            .locked-item {
                background-image: linear-gradient(to bottom, ${styles.locked.light}, ${styles.locked.dark}) !important;
                border-top-color: ${styles.locked.dark} !important;
                border-left-color: ${styles.locked.dark} !important;
                background-color: ${styles.locked.dark} !important;
            }

            .apprentice-item {
                background-image: linear-gradient(to bottom, ${styles.apprentice.light}, ${styles.apprentice.dark}) !important;
                border-top-color: ${styles.apprentice.dark} !important;
                border-left-color: ${styles.apprentice.dark} !important;
                background-color: ${styles.apprentice.dark} !important;
            }

            .guru-item {
                background-image: linear-gradient(to bottom, ${styles.guru.light}, ${styles.guru.dark}) !important;
                border-top-color: ${styles.guru.dark} !important;
                border-left-color: ${styles.guru.dark} !important;
                background-color: ${styles.guru.dark} !important;
            }

            .master-item {
                background-image: linear-gradient(to bottom, ${styles.master.light}, ${styles.master.dark}) !important;
                border-top-color: ${styles.master.dark} !important;
                border-left-color: ${styles.master.dark} !important;
                background-color: ${styles.master.dark} !important;
            }

            .enlightened-item {
                background-image: linear-gradient(to bottom, ${styles.enlightened.light}, ${styles.enlightened.dark}) !important;
                border-top-color: ${styles.enlightened.dark} !important;
                border-left-color: ${styles.enlightened.dark} !important;
                background-color: ${styles.enlightened.dark} !important;
            }

            .burned-item {
                background-image: linear-gradient(to bottom, ${styles.burned.light}, ${styles.burned.dark}) !important;
                border-top-color: ${styles.burned.dark} !important;
                border-left-color: ${styles.burned.dark} !important;
                background-color: ${styles.burned.dark} !important;
            }

            .character-item--radical .sublevel-container, .character-item--kanji .sublevel-container {
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: center;
                height: 0;
                top: -12px;
            }

            .character-item--vocabulary .sublevel-container {
                width: 0;
                display: inline-block;
            }

            .sublevel-box {
                width: 8px;
                height: 5px;
                border: 1px solid black;
                margin-left: 2px;
            }

            .multi-character-grid .sublevel-box {
                margin-left: 0px;
                margin-top: 2px;
            }

            .sublevel-checked {
                background-color: #069e56;
            }

            .sublevel-unchecked {
                background-color: #e5e5e5;
            }

            @media (max-width: 767px) {
                .single-character-grid .updated-item-element {
                    border-left: none !important;
                }

                .single-character-grid .sublevel-container {
                    height: auto;
                    top: 0;
                    width: 0;
                    display: inline-block;
                }

                .single-character-grid .sublevel-box {
                    margin-left: 0px;
                    margin-top: 2px;
                }
            }
        `
        document.head.append(styling);
        return Promise.resolve();
    }

    /**
     * log an error if any part of the wkof data request failed
     * @param {*} [e] - The error to log if it exists
     */
    function loadError (e) {
        console.error('Failed to load data from WKOF for "Wanikani Level SRS Details"', e);
    }
})();