// ==UserScript==
// @name          Wanikani Reorder Reviews by Leech Score
// @namespace     https://www.wanikani.com
// @description   Simple script to reorder all reviews by highest leech score first.
// @version       0.1.0
// @include       /^https://(www|preview).wanikani.com/review/session/
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/414912/Wanikani%20Reorder%20Reviews%20by%20Leech%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/414912/Wanikani%20Reorder%20Reviews%20by%20Leech%20Score.meta.js
// ==/UserScript==
// Author: gbates101

(function ($, wkof) {
    var script_name = 'Reorder By Leeches';
    if (!window.wkof) {
        if (confirm(script_name + ' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    function getLeechScore(item) {
        if (item.review_statistics === undefined) {
            return false;
        }
        let leechFormula = (incorrect, streak) => incorrect / Math.pow((streak || 0.5), 1.5);
        let reviewStats = item.review_statistics;
        let readingScore = leechFormula(reviewStats.reading_incorrect, reviewStats.reading_current_streak);
        let meaningScore = leechFormula(reviewStats.meaning_incorrect, reviewStats.meaning_current_streak);
        return Math.max(readingScore, meaningScore);
    }

    wkof.include('ItemData');
    let leech_lookup = {};
    var items_ready = wkof.ready('ItemData').then(function () {
        return wkof.ItemData.get_items("review_statistics").then(items => {
            items.forEach(val => { leech_lookup[val.id] = getLeechScore(val) })
        });
    });

    $('div[id*="loading"]:visible').on('hide', items_ready.then(function () {
        // Combine all reviews into a single sorted list.
        let queue = $.jStorage.get('reviewQueue')
            .concat($.jStorage.get('activeQueue'))
            .sort((a, b) => leech_lookup[a.id] - leech_lookup[b.id])

        // Put last 10 review items into active queue, highest leech score first.
        let active = queue.splice(queue.length - 10, 10).reverse()

        // Set current item to first active item.
        let current = active[0]

        $.jStorage.set('reviewQueue', queue)
        $.jStorage.set('activeQueue', active)
        $.jStorage.set('currentItem', current)
    }));
})(window.jQuery, window.wkof)
