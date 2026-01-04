// ==UserScript==
// @name         Staff Title Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  We know it's true.
// @author       SleepingGiant
// @match        https://gazellegames.net/staff.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520723/Staff%20Title%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/520723/Staff%20Title%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARDED_STAFF = [
        'sataris',
        'Aqua_Hoshino',
        'tongakas_1',
        'dyno',
        'tesnonwan',
        'Sharkendon',
        'Wealth',
        'SleepingGiant',
        'weet',
        'ingts',
        'thegame',
        'Forza',
        'lepik',
        'Dieslrae',
    ];

    const HALF_MILK_GANGERS = [
        'tongakas_1',
        'forthewin',
        'Forza',
        'SneedVN',
    ];

    const MILK_GANG = [
        'aernys',
    ];

    const TITLES = [
        'Retard',
        'Chromosome Collector',
        'Window Licker',
    ];

    const RAINBOW_COLORS = ["red", "orange", "yellow", "lightgreen", "lightblue", "plum", "lavender"];

    const rows = document.querySelectorAll('tr');

    //TODO: Not this (literally a dupe of above but with the milk emoji and no rainbow) but I am too lazy right now.
    // The tard comes second so I don't have to fight with style text colors being reset.
    rows.forEach(row => {
        const usernameCell = row.querySelector('a.username');
        if (usernameCell && HALF_MILK_GANGERS.includes(usernameCell.textContent.trim())) {
            const remark = row.querySelectorAll('td.nobr')[2];
            let additionalText = '🍦';

            if (remark.textContent.includes('&')) {
                remark.textContent = remark.textContent + ' & ' + additionalText;
            } else if (remark.textContent.includes('|')) {
                remark.textContent = remark.textContent + ' | ' + additionalText;
            } else if (remark.textContent.trim().length === 0) {
                remark.textContent = ' ' + additionalText;
            } else {
                remark.textContent = remark.textContent + ' | ' + additionalText;
            }
        }
    });

    rows.forEach(row => {
        const usernameCell = row.querySelector('a.username');
        if (usernameCell && MILK_GANG.includes(usernameCell.textContent.trim())) {
            const remark = row.querySelectorAll('td.nobr')[2];
            let additionalText = '🥛';

            if (remark.textContent.includes('&')) {
                remark.textContent = remark.textContent + ' & ' + additionalText;
            } else if (remark.textContent.includes('|')) {
                remark.textContent = remark.textContent + ' | ' + additionalText;
            } else if (remark.textContent.trim().length === 0) {
                remark.textContent = ' ' + additionalText;
            } else {
                remark.textContent = remark.textContent + ' | ' + additionalText;
            }
        }
    });

    rows.forEach(row => {
        const usernameCell = row.querySelector('a.username');
        if (usernameCell && TARDED_STAFF.includes(usernameCell.textContent.trim())) {
            const remark = row.querySelectorAll('td.nobr')[2];
            let additionalText = TITLES[Math.floor(Math.random() * TITLES.length)];

            if (remark.textContent.includes('&')) {
                remark.textContent = remark.textContent + ' & ' + additionalText;
            } else if (remark.textContent.includes('|')) {
                remark.textContent = remark.textContent + ' | ' + additionalText;
            } else if (remark.textContent.trim().length === 0) {
                remark.textContent = ' ' + additionalText;
            } else {
                remark.textContent = remark.textContent + ' | ' + additionalText;
            }

            const styledAdditionalText = additionalText
                .split("")
                .map((char, index) => `<span style="font-weight: bold; color: ${RAINBOW_COLORS[index % RAINBOW_COLORS.length]}">${char}</span>`)
                .join("");

            remark.innerHTML = remark.innerHTML.replace(additionalText, styledAdditionalText);
        }
    });
})();