// ==UserScript==
// @name         TrophyCleaner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Показывает уникальные Trophy
// @author       Wen
// @match        https://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479882/TrophyCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/479882/TrophyCleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const firstTrophySet = [
        "trophy-17", "trophy-23", "trophy-22", "trophy-24", "trophy-47",
        "trophy-56", "trophy-72", "trophy-85", "trophy-91", "trophy-96"
    ];

    const secondTrophySet = [
        "trophy-43", "trophy-44", "trophy-45", "trophy-46"
    ];

    const thirdTrophySet = [
        "trophy-37", "trophy-36", "trophy-38", "trophy-42", "trophy-66"
    ];

    const fourthTrophySet = [
        "trophy-57", "trophy-58", "trophy-59", "trophy-60", "trophy-61"
    ];

    const simpatia = [
        "trophy-18", "trophy-21", "trophy-26", "trophy-55", "trophy-79"
    ];

    const sms = [
        "trophy-53", "trophy-52", "trophy-28", "trophy-54"
    ];

    const active = [
        "trophy-31", "trophy-32"
    ];

    const Demon = [
        "trophy-35", "trophy-39", "trophy-41"
    ];

    function checkAndRemoveTrophies(trophySet) {
        let lastFoundIndex = -1;

        for (let i = 0; i < trophySet.length; i++) {
            if (document.getElementById(trophySet[i])) {
                lastFoundIndex = i;
            }
        }

        if (lastFoundIndex > -1) {
            for (let i = 0; i < lastFoundIndex; i++) {
                let trophyElement = document.querySelector(`li.trophy.DelayedTooltip#${trophySet[i]}`);
                if (trophyElement) {
                    trophyElement.remove();
                }
            }
        }
    }

    function updateTrophyCount() {
        const trophyElements = document.querySelectorAll('li.trophy.DelayedTooltip');
        const trophyCount = trophyElements.length;

        const countElement = document.querySelector('.counts_module a[href*="#trophies"] .count');
        if (countElement) {
            countElement.textContent = trophyCount;
        }
    }

    window.onload = function() {
        setTimeout(function() {
            checkAndRemoveTrophies(firstTrophySet);
            checkAndRemoveTrophies(secondTrophySet);
            checkAndRemoveTrophies(thirdTrophySet);
            checkAndRemoveTrophies(fourthTrophySet);
            checkAndRemoveTrophies(simpatia);
            checkAndRemoveTrophies(sms);
            checkAndRemoveTrophies(active);
            checkAndRemoveTrophies(Demon);
            updateTrophyCount();
        }, 1000);
    };
})();
