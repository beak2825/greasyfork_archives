// ==UserScript==
// @name         CrashlyticsTweaks
// @namespace    http://tampermonkey.net/
// @version      2024-02-27
// @description  Add percentages next to the numbers of crashed users
// @author       fujifruity
// @match        https://console.firebase.google.com/u/2/project/*/crashlytics/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488454/CrashlyticsTweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/488454/CrashlyticsTweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setTimeout(() => {
        // Add user percentage
        const crashFreeUsersRatio = parseFloat(document.querySelector('fire-big-tab-scorecard-subtitle').innerText.match(/\d+\.\d+/)[0]) / 100
        console.log('crashFreeUsersRatio', crashFreeUsersRatio)
        const usersText = document.querySelectorAll('.value.ng-star-inserted')[1].innerText
        console.log('usersText', usersText)
        const crashedUsers = parseFloat(usersText.match(/\d+\.?\d*/)) * (usersText.endsWith('K') ? 1000 : 1)
        console.log('crashedUsers', crashedUsers)
        const allUsers = crashedUsers / (1 - crashFreeUsersRatio)
        console.log('allUsers', allUsers)
        const users = Array.from(document.querySelectorAll('.data-row')).map(e => e.querySelector('.users'))
        console.log('users', users)
        users.forEach(e => e.innerText += `  (${(parseInt(e.innerText) / allUsers * 100).toFixed(1)}%)`)
    }, 6000)
})();