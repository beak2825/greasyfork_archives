// ==UserScript==
// @name        AO3: Quality score (Adjusted Kudos/Hits ratio)
// @description Uses the kudos/hits ratio, number of chapters, and statistical evaluation to score and sort AO3 works.
// @namespace   https://greasyfork.org/scripts/3144-ao3-kudos-hits-ratio
// @author      cupkax
// @version     2.2
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/482730/AO3%3A%20Quality%20score%20%28Adjusted%20KudosHits%20ratio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482730/AO3%3A%20Quality%20score%20%28Adjusted%20KudosHits%20ratio%29.meta.js
// ==/UserScript==

// Configuration object: centralizes all settings for easier management
const CONFIG = {
    alwaysCount: true,      // count kudos/hits automatically
    alwaysSort: false,      // sort works on this page by kudos/hits ratio automatically
    hideHitcount: true,     // hide hitcount
    colourBackground: true, // colour background depending on percentage
    thresholds: {
        low: 4,   // percentage level separating red and yellow background
        high: 7   // percentage level separating yellow and green background
    },
    colors: {
        red: '#8b0000',    // background color for low scores
        yellow: '#994d00', // background color for medium scores
        green: '#006400'   // background color for high scores
    }
};

// Main function: wraps all code to avoid polluting global scope
(($) => {
    'use strict';  // Enables strict mode to catch common coding errors

    // Variables to track the state of the page
    let countable = false;  // true if kudos/hits can be counted on this page
    let sortable = false;   // true if works can be sorted on this page
    let statsPage = false;  // true if this is a statistics page

    // Load user settings from localStorage
    const loadUserSettings = () => {
        if (typeof Storage !== 'undefined') {
            CONFIG.alwaysCount = localStorage.getItem('alwaysCountLocal') !== 'no';
            CONFIG.alwaysSort = localStorage.getItem('alwaysSortLocal') === 'yes';
            CONFIG.hideHitcount = localStorage.getItem('hideHitcountLocal') !== 'no';
        }
    };

    // Check if it's a list of works or bookmarks, or header on work page
    const checkCountable = () => {
        const foundStats = $('dl.stats');

        if (foundStats.length) {
            if (foundStats.closest('li').is('.work') || foundStats.closest('li').is('.bookmark')) {
                countable = sortable = true;
                addRatioMenu();
            } else if (foundStats.parents('.statistics').length) {
                countable = sortable = statsPage = true;
                addRatioMenu();
            } else if (foundStats.parents('dl.work').length) {
                countable = true;
                addRatioMenu();
            }
        }
    };

    // Count the kudos/hits ratio for each work
    const countRatio = () => {
        if (!countable) return;

        $('dl.stats').each(function () {
            const $this = $(this);
            const $hitsValue = $this.find('dd.hits');
            const $kudosValue = $this.find('dd.kudos');
            const $chaptersValue = $this.find('dd.chapters');

            // Improved error handling
            try {
                const chaptersString = $chaptersValue.text().split("/")[0];
                if (!$hitsValue.length || !$kudosValue.length || !chaptersString) {
                    throw new Error("Missing required statistics");
                }

                const hitsCount = parseInt($hitsValue.text().replace(/,/g, ''));
                const kudosCount = parseInt($kudosValue.text().replace(/,/g, ''));
                const chaptersCount = parseInt(chaptersString);

                if (isNaN(hitsCount) || isNaN(kudosCount) || isNaN(chaptersCount)) {
                    throw new Error("Invalid numeric values");
                }

                const newHitsCount = hitsCount / Math.sqrt(chaptersCount);

                let percents = 100 * kudosCount / newHitsCount;
                if (kudosCount < 11) {
                    percents = 1;
                }
                const pValue = getPValue(newHitsCount, kudosCount, chaptersCount);
                if (pValue < 0.05) {
                    percents = 1;
                }

                const percents_print = percents.toFixed(1).replace(',', '.');

                // Add ratio stats
                const $ratioLabel = $('<dt class="kudoshits">').text('Score:');
                const $ratioValue = $('<dd class="kudoshits">').text(`${percents_print}`);
                $hitsValue.after($ratioLabel, $ratioValue);

                if (CONFIG.colourBackground) {
                    if (percents >= CONFIG.thresholds.high) {
                        $ratioValue.css('background-color', CONFIG.colors.green);
                    } else if (percents >= CONFIG.thresholds.low) {
                        $ratioValue.css('background-color', CONFIG.colors.yellow);
                    } else {
                        $ratioValue.css('background-color', CONFIG.colors.red);
                    }
                }

                if (CONFIG.hideHitcount && !statsPage) {
                    $this.find('.hits').hide();
                }

                $this.closest('li').attr('kudospercent', percents);
            } catch (error) {
                console.error(`Error processing work stats: ${error.message}`);
                $this.closest('li').attr('kudospercent', 0);
            }
        });
    };

    // Sort works by kudos/hits ratio
    const sortByRatio = (ascending = false) => {
        if (!sortable) return;

        $('dl.stats').closest('li').parent().each(function () {
            const $list = $(this);
            const listElements = $list.children('li').get();

            listElements.sort((a, b) => {
                const aPercent = parseFloat(a.getAttribute('kudospercent'));
                const bPercent = parseFloat(b.getAttribute('kudospercent'));
                return ascending ? aPercent - bPercent : bPercent - aPercent;
            });

            $list.append(listElements);
        });
    };

    // Statistical functions
    const nullHyp = 0.04;

    const getPValue = (hits, kudos, chapters) => {
        const testProp = kudos / hits;
        const zValue = (testProp - nullHyp) / Math.sqrt((nullHyp * (1 - nullHyp)) / hits);
        return normalcdf(0, -1 * zValue, 1);
    };

    const normalcdf = (mean, upperBound, standardDev) => {
        const z = (standardDev - mean) / Math.sqrt(2 * upperBound * upperBound);
        const t = 1 / (1 + 0.3275911 * Math.abs(z));
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
        const sign = z < 0 ? -1 : 1;
        return (1 / 2) * (1 + sign * erf);
    };

    // Add the ratio menu to the page
    const addRatioMenu = () => {
        const $headerMenu = $('ul.primary.navigation.actions');
        const $ratioMenu = $('<li class="dropdown">').html('<a>Kudos/hits</a>');
        $headerMenu.find('li.search').before($ratioMenu);

        const $dropMenu = $('<ul class="menu dropdown-menu">');
        $ratioMenu.append($dropMenu);

        const $buttonCount = $('<li>').html('<a>Count on this page</a>');
        $buttonCount.click(countRatio);

        $dropMenu.append($buttonCount);

        if (sortable) {
            const $buttonSort = $('<li>').html('<a>Sort on this page</a>');
            $buttonSort.click(() => sortByRatio());
            $dropMenu.append($buttonSort);
        }

        if (typeof Storage !== 'undefined') {
            const $buttonSettings = $('<li>').html('<a style="padding: 0.5em 0.5em 0.25em; text-align: center; font-weight: bold;">&mdash; Settings (click to change): &mdash;</a>');
            $dropMenu.append($buttonSettings);

            const createToggleButton = (text, storageKey, onState, offState) => {
                const $button = $('<li>').html(`<a>${text}: ${CONFIG[storageKey] ? 'YES' : 'NO'}</a>`);
                $button.click(function () {
                    CONFIG[storageKey] = !CONFIG[storageKey];
                    localStorage.setItem(storageKey + 'Local', CONFIG[storageKey] ? onState : offState);
                    $(this).find('a').text(`${text}: ${CONFIG[storageKey] ? 'YES' : 'NO'}`);
                    if (storageKey === 'hideHitcount') {
                        $('.stats .hits').toggle(!CONFIG.hideHitcount);
                    }
                });
                return $button;
            };

            $dropMenu.append(createToggleButton('Count automatically', 'alwaysCount', 'yes', 'no'));
            $dropMenu.append(createToggleButton('Sort automatically', 'alwaysSort', 'yes', 'no'));
            $dropMenu.append(createToggleButton('Hide hitcount', 'hideHitcount', 'yes', 'no'));
        }

        // Add button for statistics page
        if ($('#main').is('.stats-index')) {
            const $buttonSortStats = $('<li>').html('<a>↓&nbsp;Kudos/hits</a>');
            $buttonSortStats.click(function () {
                sortByRatio();
                $(this).after($buttonSortStatsAsc).detach();
            });

            const $buttonSortStatsAsc = $('<li>').html('<a>↑&nbsp;Kudos/hits</a>');
            $buttonSortStatsAsc.click(function () {
                sortByRatio(true);
                $(this).after($buttonSortStats).detach();
            });

            $('ul.sorting.actions li:nth-child(3)').after($buttonSortStats);
        }
    };

    // Main execution
    loadUserSettings();
    checkCountable();

    if (CONFIG.alwaysCount) {
        countRatio();
        if (CONFIG.alwaysSort) {
            sortByRatio();
        }
    }

})(jQuery); sc