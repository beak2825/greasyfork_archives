// ==UserScript==
// @name            Autofill workload
// @namespace  http://tampermonkey.net/
// @version         0.2
// @description  Autofill platform.levtech.jp worklog
// @author          topaz2
// @match          https://platform.levtech.jp/p/workreport/input/*
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/22836/Autofill%20workload.user.js
// @updateURL https://update.greasyfork.org/scripts/22836/Autofill%20workload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var year = $('p.reportTop__list__data__txtInput').text().replace(/[^\d]+/g, '').slice(0, 4),
        month = parseInt($('p.reportTop__list__data__txtInput').text().replace(/[^\d]+/g, '').slice(4, 6)),
        now = new Date(year, month - 1, 1), day, target,
        zeroPad = function(number, length){
        return (Array(length).join('0') + number).slice(-length);
    };

    for (var d in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]) {
        day = new Date(now.getFullYear(), now.getMonth(), d).getDay();
        if (day === 0 || day ===6) continue;
        target = '#' + now.getFullYear() + zeroPad((now.getMonth() + 1), 2) + zeroPad(d, 2);
        if ($(target + 'start_time').val() === '' && $(target + 'end_time').val() === '' && $(target + 'relax_time').val() === '') {
            $(target + 'start_time').val('10:00');
            $(target + 'end_time').val('19:00');
            $(target + 'relax_time').val('01:00');
        }
    }
})();