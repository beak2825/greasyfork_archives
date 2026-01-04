// ==UserScript==
// @name         Trophy Manager: Current Team Balance
// @namespace    https://example.com/
// @version      1
// @description  Shows the current balance for any team in Trophy Manager game.
// @author       Your name
// @match        https://trophymanager.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466295/Trophy%20Manager%3A%20Current%20Team%20Balance.user.js
// @updateURL https://update.greasyfork.org/scripts/466295/Trophy%20Manager%3A%20Current%20Team%20Balance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const teamId = 301327; // Replace with the team ID you want to get the balance for

    fetch(`https://api.trophymanager.com/v2/teams/${teamId}/finance`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-TM-LOGIN-TOKEN': window.tmtoken
        }
    })
    .then(response => response.json())
    .then(data => {
        const balance = data.finance.balance;
        console.log(`Team balance: ${balance}`);
        // Do whatever you want with the balance, such as displaying it on the page
    })
    .catch(error => console.error('Error:', error));
})();
