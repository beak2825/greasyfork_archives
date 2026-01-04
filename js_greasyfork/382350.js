// ==UserScript==
// @name         pogdesign to bangumi
// @namespace    http://xuefer.win/
// @version      0.1
// @description  convert to bangumi
// @author       You
// @match        https://www.pogdesign.co.uk/cat/*
// @exclude      https://www.pogdesign.co.uk/cat/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382350/pogdesign%20to%20bangumi.user.js
// @updateURL https://update.greasyfork.org/scripts/382350/pogdesign%20to%20bangumi.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function zeroFill(number, padding) {
        number = number.toString();
        while (number.length < padding) {
            number = "0" + number;
        }
        return number;
    }
    var months = {
        "jan": 1,
        "feb": 2,
        "mar": 3,
        "apr": 4,
        "may": 5,
        "jun": 6,
        "jul": 7,
        "aug": 8,
        "sep": 9,
        "oct": 10,
        "nov": 11,
        "dec": 12,
    };
    var text = "";
    $("ul>li.ep[itemprop=\"episode\"]").each(function(i, row) {
        var title = $("a", row).text();
        var ep = $("span.pnumber", row).text();
        var date = $("span.datepub", row).text();
        var ds = date.replace(/ /g, "").match(/(\d+)(?:st|nd|rd|th)(...)'(\d\d)-(\d+):(\d+)(am|pm)?$/);
        var day = ds[1], month = ds[2], year = ds[3];
        var hour = ds[4], minute = ds[5], ampm = ds[6];
        month = months[month.toLowerCase()];
        date = "20" + year + "-" + zeroFill(month, 2) + "-" + zeroFill(day, 2);
        // var begin = new Date("1970-01-01 " + hour + ":" + minute + " " + ampm + " GMT").valueOf() / 1000;
        var duration = "";
        text += ep + "|" +  title + "||" + duration + "|" + date + "\r\n";
    });
    console.log(text);
    // Your code here...
})();
