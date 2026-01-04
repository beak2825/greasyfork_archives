// ==UserScript==
// @name         Přesměrování Japonsko volejbal
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Změna URL pro japonský volejbal
// @author       LM
// @match        https://www.svleague.jp/ja/match/detail/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523139/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20Japonsko%20volejbal.user.js
// @updateURL https://update.greasyfork.org/scripts/523139/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20Japonsko%20volejbal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Get the current URL
    var currentUrl = window.location.href;
    // Extract the number after the last "/"
    var lastIndex = currentUrl.lastIndexOf("/");
    var numberAfterLastSlash = currentUrl.substring(lastIndex + 1);
    // Replace the part before the last "/" with the new URL
    var newUrl = "https://www.svleague.jp/ja/livescore/v/" + numberAfterLastSlash;
    // Redirect to the new URL
    window.location.replace(newUrl);
})();