// ==UserScript==
// @name         Monaca Redmine Gantt Fix
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Show Jananese national holidays and apply some changes in Monaca Redmine Gantt
// @author       Naoki Matagawa
// @match        https://redmine.monaca.io/*/gantt*
// @require       https://unpkg.com/japanese-holidays@1.0.6/lib/japanese-holidays.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382977/Monaca%20Redmine%20Gantt%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/382977/Monaca%20Redmine%20Gantt%20Fix.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const scriptName = 'Monaca Redmine Gantt Fix';

    {
        let customCss = `
/*#sidebar {
    display: none;
}

#content {
    width: 100%;
}*/



.gantt_subjects_column {
    width: 550px !important;
}

.gantt_subjects_container {
    width: 550px !important;
}

.gantt_subjects_container > .gantt_hdr {
    width: 550px !important;
    right: unset !important;
}

.gantt_hdr.nwday {
    border-color: #c0c0c0;
    background-color: #c0c0c0;
    border-color: black;
    background-color: black;
    opacity: 0.4;
    z-index: 1;
}

.task.parent.task_todo,
.task.parent.task_done,
.task.parent.task_late {
    background: #ccc !important;
    border: none;
}

.task.parent.label {
    display: none;
}

.issue-subject {
    width: 500px !important;
}

.issue {
    display: inline-block;
    width: 8px;
    margin-bottom: -2px;
    font-size: 0;
    overflow: hidden;
    background-color: #ffffff !important;
    opacity: 0.4;
}

.issue:hover {
    background-color: #169 !important;
}
`;
        $('<style></style>').appendTo('head').html(customCss);
    }

    // from https://gist.github.com/chrisjhoughton/7890303
    var waitForEl = function(selector, callback) {
        if (jQuery(selector).length) {
            callback();
        } else {
            setTimeout(function() {
                waitForEl(selector, callback);
            }, 100);
        }
    };

    console.log(`Initializing "${scriptName}"...`);

    waitForEl('#gantt_area', function() {
        console.log(`Running "${scriptName}"...`);
        const start = new Date($('#gantt_area > div.gantt_hdr > a')[0].title);

        // Remove nwday class from date columns
        $('#gantt_area > div.gantt_hdr')
        .filter((i, e) => e.style['font-size'] === '0.7em' && /[0-9]/.test(e.innerText))
        .each((i, e) => {
            e.classList.remove('nwday');
        });

        // Process day columns
        $('#gantt_area > div.gantt_hdr')
        .filter((i, e) => e.style['font-size'] === '0.7em' && /[A-Z]/.test(e.innerText))
        .each((i, e) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const isBeforeSpecialHoliday = (d.getFullYear() === 2019 && d.getMonth() === 4-1 && d.getDate() === 30);
            const isSpecialHoliday = (d.getFullYear() === 2019 && d.getMonth() === 5-1 && d.getDate() === 1);
            const isAfterSpecialHoliday = (d.getFullYear() === 2019 && d.getMonth() === 5-1 && d.getDate() === 2);
            const isNotHoliday = (d.getFullYear() >= 2019 && d.getMonth() === 12-1 && d.getDate() === 23); // 2019/12/23 以降は天皇誕生日ではない
            if ((JapaneseHolidays.isHoliday(d) || isBeforeSpecialHoliday || isSpecialHoliday || isAfterSpecialHoliday) && !isNotHoliday) {
                console.log(`[${i}] ` + d + 'は祝日！');
                e.classList.add('nwday');
            }
        });
    });
})();