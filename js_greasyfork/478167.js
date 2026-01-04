// ==UserScript==
// @name         Fibalivestats - Odstranění nul
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Odstraní čísla 0
// @author       Michal
// @match        https://fibalivestats.dcd.shared.geniussports.com/u/*
// @icon         https://se-img.dcd-production.i.geniussports.com/374b83e9a0ba165f938625c90102a44eT1.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478167/Fibalivestats%20-%20Odstran%C4%9Bn%C3%AD%20nul.user.js
// @updateURL https://update.greasyfork.org/scripts/478167/Fibalivestats%20-%20Odstran%C4%9Bn%C3%AD%20nul.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';

    if (!localStorage.getItem('scriptExecuted')) {
        location.reload();
        localStorage.setItem('scriptExecuted', 'true');
    }

    const homeScores = document.querySelectorAll('.og-home-score');
    const awayScores = document.querySelectorAll('.og-away-score');

    homeScores.forEach(score => {
        score.textContent = score.textContent.replace(/0/g, '');
    });

    awayScores.forEach(score => {
        score.textContent = score.textContent.replace(/0/g, '');
    });
}, 2000);