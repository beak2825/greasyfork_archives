// ==UserScript==
// @name         Rusko Bandy
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přesměrování do správné live url
// @author       Michal
// @match        http://www.rusbandy.ru/game/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480680/Rusko%20Bandy.user.js
// @updateURL https://update.greasyfork.org/scripts/480680/Rusko%20Bandy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentURL = window.location.href;

    var gameIDPart = currentURL.match(/http:\/\/www.rusbandy.ru\/game\/(\d+)\/*/);

    if (gameIDPart && gameIDPart.length > 1) {
        var gameID = gameIDPart[1];
        var liveURL = "http://www.rusbandy.ru/game/" + gameID + "/online/";
        if (currentURL !== liveURL) {
            window.location.href = liveURL;
        }
    }
})();