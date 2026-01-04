// ==UserScript==
// @name         Southern Leagues
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Maže vadný div element, kvůli kterému nefunguje náklik.
// @author       MK
// @match        https://southern-football-league.co.uk/todays-fixtures/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=southern-football-league.co.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481628/Southern%20Leagues.user.js
// @updateURL https://update.greasyfork.org/scripts/481628/Southern%20Leagues.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';
document.querySelector('#qc-cmp2-container').remove();
},2500)();