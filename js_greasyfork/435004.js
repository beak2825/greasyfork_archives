// ==UserScript==
// @name         WaniKani - Better Progress Bar
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Change out kanji passed to srs stages beaten
// @author       Gorbit99
// @match        https://www.wanikani.com
// @match        https://www.wanikani.com/dashboard
// @match        https://preview.wanikani.com
// @match        https://preview.wanikani.com/dashboard
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435004/WaniKani%20-%20Better%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/435004/WaniKani%20-%20Better%20Progress%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* global wkof */

    if (!window.wkof) {
        alert('Better Progress Bar requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }
    wkof.include("ItemData");

    wkof.ready("ItemData").then(do_query);

})();

function do_query() {
    wkof.ItemData.get_items({
        wk_items: {
            options: {
                assignments: true,
            },
            filters: {
                item_type: ["rad", "kan"],
                level: '+0',
            }
        }
    }).then(handle_items);
}

function handle_items(items) {
    let srsStages = items.filter(item => item.assignments !== undefined)
        .map(item =>
            item.assignments.passed_at !== null
                ? 5
                : Math.min(item.assignments.srs_stage, 5));

    if (srsStages.length < 0) {
        return 0;
    }

    let max = srsStages.length * 5;
    let actual = srsStages.reduce((sum, x) => sum + x, 0);

    let progressBarFill = document.querySelector(".level-progress-bar__progress");
    const calculatedWidth = actual / max * 100;
    progressBarFill.style.width = `${calculatedWidth}%`;

    let progressBarLabel = document.querySelector('.level-progress-bar__label');
    if (progressBarLabel && !progressBarLabel.classList.contains('level-progress-bar__label--inside') && calculatedWidth > 50) {
        progressBarLabel.classList.add('level-progress-bar__label--inside');
        progressBarFill.prepend(progressBarLabel);
    }
    progressBarLabel.innerText = `${actual} of ${max} SRS stages`;
}
