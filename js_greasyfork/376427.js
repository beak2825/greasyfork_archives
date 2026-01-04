// ==UserScript==
// @name         GDQ Schedule Enhancements
// @namespace    https://github.com/willmtemple/
// @version      0.2
// @description  22nd-century schedule technology
// @author       Will Temple
// @match        https://gamesdonequick.com/schedule
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376427/GDQ%20Schedule%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/376427/GDQ%20Schedule%20Enhancements.meta.js
// ==/UserScript==

const __jQuery = window.$;

const _MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

function _hasClass(e, v) {
    for (var i = 0; i < e.classList.length; i++) {
        if (e.classList[i] === v) {
            return true;
        }
    }
    return false;
}

function _dayAndMonthNumber(s) {
    const split = s.split(' ');
    const d_i = parseInt(split[1]);
    for (var i = 0; i < _MONTHS.length; i++) {
        if (split[0] === _MONTHS[i]) {
            return [i, d_i];
        }
    }
    return [undefined, d_i];
}

function _hourMinute(s) {
    const time = s.split(' ');
    const hour_minute = time[0].split(':');
    const hInt = parseInt(hour_minute[0]);
    const mInt = parseInt(hour_minute[1]);
    var realHour = undefined;
    if (time[1] === "PM") {
        realHour = hInt === 12 ? 12 : hInt + 12;
    } else {
        realHour = hInt === 12 ? 0 : hInt;
    }
    return [realHour, mInt];
}

function _doHighlight() {
    var now = new Date();

    const cells = __jQuery('table#runTable tbody tr');

    const year = now.getFullYear();
    var day = undefined;
    var month = undefined;

    var prevPCell = undefined;
    var prevECell = undefined;
    var prevDRow = undefined;

    var clear = false;
    cells.each(function(i, tr) {
        if (clear) { return; }

        if (_hasClass(tr, 'day-split')) {
            const ss = tr.children[0].innerText.split(',')[1].trim();
            const day_month = _dayAndMonthNumber(ss);
            day = day_month[1];
            month = day_month[0];
            if (prevDRow) {
                prevDRow.remove();
            }
            prevDRow = tr;
        } else if (!_hasClass(tr, 'second-row')) {
            const time = tr.children[0].innerText;
            const hour_minute = _hourMinute(time);
            const hour = hour_minute[0];
            const minute = hour_minute[1];
            const cellTime = new Date(year, month, day, hour, minute);
            if ( cellTime > now) {
                clear = true;
                prevPCell.id = 'current-run';
                prevPCell.style['background-color'] = '#fffedd';
                prevECell.style['background-color'] = '#fffedd';
                window.location.hash = '#current-run';

                setTimeout(function() {
                    prevPCell.id = "";
                    prevPCell.style['background-color'] = "";
                    prevECell.style['background-color'] = "";
                    _doHighlight();
                }, cellTime.getTime() - now.getTime());
            } else {
                if (prevPCell !== undefined) {
                    prevPCell.remove();
                    prevECell.remove();
                }
                prevPCell = tr;
            }
        } else {
            prevECell = tr;
        }
    })
}

(function() {
    'use strict';
     __jQuery('div.container.text-center').remove();
    _doHighlight();
})();