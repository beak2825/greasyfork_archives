// ==UserScript==
// @name          WaniKani Leech Be Gone
// @namespace     https://www.wanikani.com
// @description   Shows top leeches on dashboard (replaces critical items) and all leeches on a dedicated page (replaces critical items).
// @author        Chikuhitsu
// @license       http://www.apache.org/licenses/LICENSE-2.0
// @version       1.7.5
// @require       https://code.jquery.com/jquery-3.3.1.min.js#sha256=FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=
// @include       https://www.wanikani.com/dashboard
// @include       https://www.wanikani.com/
// @include       https://www.wanikani.com/critical-items
// @grant         none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/389802/WaniKani%20Leech%20Be%20Gone.user.js
// @updateURL https://update.greasyfork.org/scripts/389802/WaniKani%20Leech%20Be%20Gone.meta.js
// ==/UserScript==

/*
jshint esversion: 6
*/

(async function () {
    'use strict';

    let dom = {};
    dom.$ = jQuery.noConflict(true);

    if (!window.wkof) {
        let response = confirm('WaniKani Leech Be Gone script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }

        return;
    }

    //default settings
    const defaults = {
        method: 'combined',
        weights: 3,
        leech_threshold: 0.6,
        steepness: 0.5,
        ebi: false,
    };

    const weightsMap = {
        1: {
            label: "4:1",
            weight1: 4,
            weight2: 1,
        },
        2: {
            label: "2:1",
            weight1: 2,
            weight2: 1,
        },
        3: {
            label: "1:1",
            weight1: 1,
            weight2: 1,
        },
        4: {
            label: "1:2",
            weight1: 1,
            weight2: 2,
            },
        5: {
            label: "1:4",
            weight1: 1,
            weight2: 4,
        },
    };

    window.wkof.include('Menu,Settings');
    await window.wkof.ready('Menu,Settings')
        .then(install_menu)
        .then(load_settings);

    let s = window.wkof.settings.leech_be_gone.steepness;
    let leechThreshold = window.wkof.settings.leech_be_gone.leech_threshold;
    let method = window.wkof.settings.leech_be_gone.method;
    let weights = window.wkof.settings.leech_be_gone.weights;

    window.wkof.include('Apiv2');
    await window.wkof.ready('Apiv2');
    const userLevel = window.wkof.user.level;

    //item filter
    const config = {
        wk_items: {
            options: {
                review_statistics: true,
                assignments: true
            },
            filters: {
                level: '1..+0',
                srs: '1,2,3,4,5,6,7,8'
            }
        }
    };

    window.wkof.include('ItemData');
    window.wkof.ready('ItemData')
        .then(getItems)
        .then(determineLeeches)
        .then(updatePage);

    function getItems() {
        return window.wkof.ItemData.get_items(config);
    }

    function determineLeeches(items) {
        return items.filter(item => isLeech(item));
    }

    function isLeech(item) {
        if (item.review_statistics === undefined) {
            return false;
        }

        let reviewStats = item.review_statistics;

        let c_meaning = Math.min(reviewStats.meaning_current_streak, 7.0);
        let c_reading = Math.min(reviewStats.reading_current_streak, 7.0);

        let c = Math.min(c_meaning, c_reading);

        let itemLevel = item.data.level;
        let l = userLevel - itemLevel;

        if (l > 0) {
            let score;
            if (method === 'streak') {
                score = computeLeechScore(s, l, c);
            } else if (method === 'srs') {
                score = computeLeechScore(s, l, Math.min(item.assignments.srs_stage, 7));
            } else {
                let w = weightsMap[weights];
                let srs_score = Math.min(item.assignments.srs_stage, 7);
                let streak_score = c;
                let weightsSum = w.weight1 + w.weight2;
                let combined = (srs_score * w.weight1 + streak_score * w.weight2) / weightsSum;
                score = computeLeechScore(s, l, combined);
            }

            item.leech_score = computeDisplayScore(score, leechThreshold);

            if (c === c_meaning && c === c_reading) {
                item.leech_kind = 'both';
            } else if (c === c_meaning) {
                item.leech_kind = 'meaning';
            } else {
                item.leech_kind = 'reading';
            }

            return score >= leechThreshold;
        } else if (itemLevel === 60) {
            //different logic for level 60, because we don't have a level difference in that case
            let meaning_current_streak = reviewStats.meaning_current_streak;
            let meaning_max_streak = reviewStats.meaning_max_streak;
            let reading_current_streak = reviewStats.reading_current_streak;
            let reading_max_streak = reviewStats.reading_max_streak;

            let score_meaning = 1 - meaning_current_streak / meaning_max_streak;
            let score_reading = 1 - reading_current_streak / reading_max_streak;

            let score = Math.max(score_meaning, score_reading);
            item.leech_score = computeDisplayScore(score, leechThreshold);

            if (score === score_meaning && c === score_reading) {
                item.leech_kind = 'both';
            } else if (score === score_meaning) {
                item.leech_kind = 'meaning';
            } else {
                item.leech_kind = 'reading';
            }

            return score >= leechThreshold;
        } else {
            return false;
        }
    }

    function computeDisplayScore(leechScore, leechThreshold) {
        return 10 * (leechScore - leechThreshold + 0.1);
    }

    function computeLeechScore(s, l, c) {
        return 2 * (1.0 / (1.0 + Math.exp(-1.0 * s * l * (7.0 / c - 1))) - 0.5);
    }

    function updatePage(items) {

        let is_dashboard = window.location.pathname !== "/critical-items";

        if (is_dashboard) {
            items = items.sort((a, b) => b.leech_score - a.leech_score).slice(0, 10);
        } else {
            items = items.sort((a, b) => b.leech_score - a.leech_score);
        }

        console.log(items);

        makeLeechList(items, is_dashboard);
    }

    function round(number, decimals) {
        return +(Math.round(number + "e+" + decimals) + "e-" + decimals);
    }

    function makeLeechList(items, for_dashboard) {
        let rows = "";

        items.forEach(item => {
            let type = item.assignments.subject_type;
            //use slug by default (for kanji and vocab)
            let representation = item.data.slug;

            //The slug of a radical just has its name, we want the actual symbol.
            if (type === 'radical') {
                if (item.data.characters) {
                    //use characters for radicals when possible
                    representation = item.data.characters;
                } else if (item.data.character_images) {
                    //use SVG image for scalability
                    let image_data = item.data.character_images.find(x => x.content_type === "image/svg+xml" && x.metadata.inline_styles);
                    if (image_data) {
                        representation = `<img style="height: 1em; width: 1em; filter: invert(100%);" src="${image_data.url}"  alt="${item.data.slug}"/>`;
                    }
                }
            }

            rows += `<tr class="${type}"><td><a href="${item.data.document_url}" style="display:flex; justify-content:space-between;"><span lang="ja" style="flex-basis:33.3%;">${representation}</span><span style="flex-basis:33.3%; text-align:center;">(${item.leech_kind})</span><span class="pull-right" style="flex-basis:33.3%; text-align:right;">${round(item.leech_score, 2)}</span></a></td></tr>`;
        });

        let sectionContent = `<h3 class="small-caps">${for_dashboard ? 'Top ' : ''}Leeches</h3>
                              <table>
                                <tbody style="display: table-row-group;">
                                  ${rows}
                                </tbody>
                              </table>
                              <div class="see-more">
                                <a class="small-caps" ${for_dashboard ? 'href="critical-items"' : ''}>${for_dashboard ? 'See More Leeches...' : items.length + ' leeches total'}</a>
                              </div>`;
        dom.$('.low-percentage').html(sectionContent);

        if (window.wkof.user.username === 'Ryouki' || window.wkof.settings.leech_be_gone.ebi) {
        dom.$(`<div class="alert alert-success alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert">
    <span aria-hidden="true">×</span>
</button>
    <h1>Ebi is the best!</h1>
</div>`).prependTo('body');
        }
    }

    function install_menu() {
        window.wkof.Menu.insert_script_link({
            name: 'leech_be_gone_settings',
            submenu: 'Settings',
            title: 'Leech Be Gone',
            on_click: open_settings
        });
    }

    function open_settings() {
        let config = {
            script_id: 'leech_be_gone',
            title: 'Leech Be Gone v 1.7.5',
            content: {
                section_config: {
                    type: 'section',
                    label: 'Settings',
                },
                method: {
                    type: 'dropdown',
                    label: 'Method',
                    hover_tip: 'The method used to calculate leech score. "Streak" uses the current streak value of an item, "SRS" uses the SRS level of an item. "Combined" uses the average of the two other methods.',
                    default: 'srs',
                    content: {
                        streak: 'Streak',
                        srs: 'SRS',
                        combined: 'Combined',
                    }
                },
                weights: {
                    type: 'dropdown',
                    label: 'Weights for combined scoring',
                    hover_tip: 'format: SRS:Streak (so 2:1 would give the SRS based score double the weight of the streak based score)',
                    default: 3,
                    content: {
                        1: "4:1",
                        2: "2:1",
                        3: "1:1",
                        4: "1:2",
                        5: "1:4",
                    },
                },
                ebi: {
                    type: 'checkbox',
                    label: 'I love Ebi',
                    default: false,
                },
                section_advanced: {
                    type: 'section',
                    label: 'Advanced Settings',
                },
                leech_threshold: {
                    type: 'number',
                    label: 'Leech Threshold',
                    default: 0.6,
                    min: 0.0,
                    max: 1.0,
                    hover_tip: 'The minimum leech score for items to be considered leeches. Recommended value: 0.6',
                },
                steepness: {
                    type: 'number',
                    label: 'Steepness',
                    default: 0.5,
                    min: 0.45,
                    max: 1.0,
                    hover_tip: 'The steepness value for the calculation. Sensible values range from 0.45 to 1.0. Higher values lead to the leech score going up faster. Recommended value: 0.5',
                },
            },
        };
        let dialog = new window.wkof.Settings(config);
        dialog.open();
    }

    function load_settings() {
        return window.wkof.ready('Settings').then(() => window.wkof.Settings.load('leech_be_gone', defaults));
    }

})();
