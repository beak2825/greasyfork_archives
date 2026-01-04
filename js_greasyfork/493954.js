// ==UserScript==
// @name         Fonbet na clienta
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Změní URL na clienta a otevře nové okno
// @author       Michal
// @match        https://www.fon.bet/sports/football/*
// @match        https://www.fon.bet/live/football/*
// @match        https://www.fonbet.com.cy/sports/football/*
// @match        https://www.fonbet.com.cy/live/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493954/Fonbet%20na%20clienta.user.js
// @updateURL https://update.greasyfork.org/scripts/493954/Fonbet%20na%20clienta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var originalURL = window.location.href;

    var match = originalURL.match(/\/(\d+)\/(\d+)\//);
    if (match && match[2]) {
        var eventId = match[2];

        var newURL = `https://clientsapi01w.bk6bba-resources.com/service-tv/mobile/mc?app_name=mobile_site&eventId=${eventId}&lang=en&sysId=2&page=events`;

        window.open(newURL, '_blank');

        var statsURL = `https://clientsapi02w.bk6bba-resources.com/service-tv/mobile/mc?app_name=mobile_site&eventId=${eventId}&lang=en&sysId=2&page=stats-1`;
        window.location.href = statsURL;
    }
})();