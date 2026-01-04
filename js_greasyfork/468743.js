// ==UserScript==
// @name         MLB Stats
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Vytváří ID elementy u jednotlivých statistik v boxscore.
// @author       Martin Kaprál
// @match        https://www.mlb.com/gameday/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mlb.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468743/MLB%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/468743/MLB%20Stats.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';
    let awaybase = document.querySelector('.away-r3'); let awayrow = awaybase.querySelectorAll('div > div > div > div > span:nth-child(1)'); for (let i = 0; i < awayrow.length; i++) {let awaystat = awayrow[i].textContent; let awayid = awaystat.replace(" ", "-"); awayrow[i].parentElement.setAttribute('id', "away-stat-" + awayid)}
    let homebase = document.querySelector('.home-r3'); let homerow = homebase.querySelectorAll('div > div > div > div > span:nth-child(1)'); for (let i = 0; i < homerow.length; i++) {let homestat = homerow[i].textContent; let homeid = homestat.replace(" ", "-"); homerow[i].parentElement.setAttribute('id', "home-stat-" + homeid)}
}, 2000)();