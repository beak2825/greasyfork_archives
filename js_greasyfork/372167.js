// ==UserScript==
// @name              Myanimelist date format
// @description     Myanimelist连载日期中国化
// @author            zelricx
// @namespace    https://greasyfork.org/users/212360
// @version           0.14
// @date               2019.03.19
// @match            https://myanimelist.net/manga/*
// @require           http://code.jquery.com/jquery-2.1.1.min.js
// @icon                https://myanimelist.net/images/faviconv5.ico
// @encoding        utf-8
// @downloadURL https://update.greasyfork.org/scripts/372167/Myanimelist%20date%20format.user.js
// @updateURL https://update.greasyfork.org/scripts/372167/Myanimelist%20date%20format.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var month = {
        jan: '01',
        feb: '02',
        mar: '03',
        apr: '04',
        may: '05',
        jun: '06',
        jul: '07',
        aug: '08',
        sep: '09',
        oct: '10',
        nov: '11',
        dec: '12'
    };

    console.clear();
    var dateDiv = $('.dark_text:contains("Published:")').parent();
    var dateStr = dateDiv.text();
    var dateRange = [];
    var dateRangeCn = [];
    if (dateStr) {
        dateStr = dateStr.replace('Published: ', '');
        dateRange = dateStr.split(' to ');
    }

    if (dateRange.length > 0) {
        $.each(dateRange, function(i, v) {
            var dateCn = '';
            var dateEn = v.split(',');
            if ((dateEn.length > 1) && dateEn[0] && (dateEn[0] != '?')) {
                dateCn = dateEn[1] + '年';
                var dateEnDate = dateEn[0].split('  ');
                dateCn += month[dateEnDate[0].toLowerCase()] + '月';
                if (dateEnDate[1]) {
                    var day = (dateEnDate[1].length == 1) ? ('0' + dateEnDate[1]) : dateEnDate[1];
                    dateCn += day + '日';
                }
            }
            dateRangeCn.push(dateCn);
        });
    }

    if (dateRangeCn.length > 0) {
        $.each(dateRangeCn, function(i, v) {
            dateDiv.append('<div style="text-align: center;"> ' + v + '</div>');
        });
    }

})();