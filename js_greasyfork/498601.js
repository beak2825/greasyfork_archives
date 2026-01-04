// ==UserScript==
// @name         I HATE AD TIMERS
// @namespace    http://tampermonkey.net/
// @version      2024-06-22
// @description  Simple remove ad timer to get download link
// @author       QUDRA
// @match        https://good.tartugi.net/search-torrents/download/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tartugi.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498601/I%20HATE%20AD%20TIMERS.user.js
// @updateURL https://update.greasyfork.org/scripts/498601/I%20HATE%20AD%20TIMERS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function modifyLink() {
        var holder = document.getElementById("search_time_torrent");
        if (holder) {
            var newUrl = window.location.href + '/start';
            holder.innerHTML = `<a href="${newUrl}" rel="nofollow"><h3>Скачать торрент</h3></a>`;
        }
    }
    document.addEventListener('DOMContentLoaded', modifyLink);
})();
