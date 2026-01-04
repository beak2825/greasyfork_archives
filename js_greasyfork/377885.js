// ==UserScript==
// @name         Anichart box highlights
// @version      0.1
// @description  brings back the old glowy style highlights for Anichart airing schedule.
// @author       Kryomaani
// @match        http://anichart.net/*
// @match        https://anichart.net/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/248098
// @downloadURL https://update.greasyfork.org/scripts/377885/Anichart%20box%20highlights.user.js
// @updateURL https://update.greasyfork.org/scripts/377885/Anichart%20box%20highlights.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.airing-card.green.green { box-shadow: 0px 0px 10px 5px rgb(var(--color-green)); border-right: initial !important; }');
    GM_addStyle('.airing-card.yellow.yellow { box-shadow: 0px 0px 10px 5px rgb(var(--color-yellow)); border-right: initial !important; }');
    GM_addStyle('.airing-card.red.red { box-shadow: 0px 0px 10px 5px rgb(var(--color-red)); border-right: initial !important; }');
    // Your code here...
})();