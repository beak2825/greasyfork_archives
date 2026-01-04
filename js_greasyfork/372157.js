// ==UserScript==
// @name          WaniKani Dashboard Leech List
// @namespace     https://www.wanikani.com
// @description   Shows top leeches on dashboard (replaces critical items) and all leeches on a dedicated page (replaces critical items)
// @author        ukebox
// @version       1.2.3
// @require       https://code.jquery.com/jquery-3.3.1.min.js#sha256=FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=
// @include       https://www.wanikani.com/dashboard
// @include       https://www.wanikani.com/
// @include       https://www.wanikani.com/critical-items
// @grant         none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/372157/WaniKani%20Dashboard%20Leech%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/372157/WaniKani%20Dashboard%20Leech%20List.meta.js
// ==/UserScript==

/*
jshint esversion: 6
*/

(function() {
    'use strict';

    let dom = {};
    dom.$ = jQuery.noConflict(true);

    if (!window.wkof) {
        let response = confirm('WaniKani Dashboard Leech List script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }

        return;
    }

    const leechThreshold = 1;
    const config = {
        wk_items: {
            options: {
                review_statistics: true,
                assignments: true
            },
            filter: {
                level: '1..+0',
                srs: '1..8'
            }
        }
    };

    window.wkof.include('ItemData');
    window.wkof.ready('ItemData').then(getItems).then(determineLeeches).then(updatePage);

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
        let meaningScore = computeLeechScore(reviewStats.meaning_incorrect, reviewStats.meaning_current_streak);
        let readingScore = computeLeechScore(reviewStats.reading_incorrect, reviewStats.reading_current_streak);

        item.leech_score = Math.max(meaningScore, readingScore);

        return meaningScore >= leechThreshold || readingScore >= leechThreshold;
    }

    function computeLeechScore(incorrect, currentStreak) {
        return incorrect / Math.pow((currentStreak || 0.5), 1.5);
    }

    function updatePage(items) {

        let is_dashboard = window.location.pathname !== "/critical-items";

        if (is_dashboard) {
            items = items.sort((a, b) => b.leech_score - a.leech_score).slice(0,10);
        } else {
            items = items.sort((a, b) => b.leech_score - a.leech_score);
        }

        console.log(items);

        makeLeechList(items, is_dashboard);
    }

    function round(number, decimals)
    {
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
                        representation = `<img style="height: 1em; width: 1em; filter: invert(100%);" src="${image_data.url}" />`;
                    }
                }
            }

            rows+=`<tr class="${type}"><td><a href="${item.data.document_url}"><span lang="ja">${representation}</span><span class="pull-right">${round(item.leech_score, 2)}</span></a></td></tr>`;
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
    }

})();