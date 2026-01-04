// ==UserScript==
// @name         AWBW - More create game option
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Change starting fund, income, unit limit
// @author       new1234
// @match        https://awbw.amarriner.com/create.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amarriner.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544911/AWBW%20-%20More%20create%20game%20option.user.js
// @updateURL https://update.greasyfork.org/scripts/544911/AWBW%20-%20More%20create%20game%20option.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        const selectIncome = document.querySelector('select[name="funds"]');
        if (!selectIncome) return;

        // Create a new number input field
        const inputIncome = document.createElement('input');
        inputIncome.type = 'number';
        inputIncome.name = 'funds';
        inputIncome.min = 0;
        inputIncome.step = 1;
        inputIncome.placeholder = 'Enter custom funds';
        inputIncome.value = selectIncome.value;

        // Replace the select with input + submit button
        selectIncome.replaceWith(inputIncome);

        const selectStartingFunds = document.querySelector('select[name="starting_funds"]');
        if (!selectStartingFunds) return;

        // Create a new number input field
        const inputStartingFunds = document.createElement('input');
        inputStartingFunds.type = 'number';
        inputStartingFunds.name = 'starting funds';
        inputStartingFunds.min = 0;
        inputStartingFunds.step = 1;
        inputStartingFunds.placeholder = 'Enter custom starting funds';
        inputStartingFunds.value = selectStartingFunds.value;

        // Replace the select with input + submit button
        selectStartingFunds.replaceWith(inputStartingFunds);

        const selectUnitLimit = document.querySelector('select[name="unit_limit"]');
        if (!selectUnitLimit) return;

        // Create a new number input field
        const inputUnitLimit = document.createElement('input');
        inputUnitLimit.type = 'number';
        inputUnitLimit.name = 'unit limit';
        inputUnitLimit.min = 0;
        inputUnitLimit.step = 1;
        inputUnitLimit.placeholder = 'Enter custom unit limit';
        inputUnitLimit.value = selectUnitLimit.value;

        // Replace the select with input + submit button
        selectUnitLimit.replaceWith(inputUnitLimit);
  });
})();