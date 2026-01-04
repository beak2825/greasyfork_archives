// ==UserScript==
// @name         Grundo's Cafe Brain Tree
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Store and auto-populate answer info for Brain Tree daily quest.
// @author       baileyb (GC user bailey)
// @match        http*://grundos.cafe/halloween/braintree*
// @match        http*://grundos.cafe/halloween/esophagor*
// @match        http*://www.grundos.cafe/halloween/braintree*
// @match        http*://www.grundos.cafe/halloween/esophagor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/464946/Grundo%27s%20Cafe%20Brain%20Tree.user.js
// @updateURL https://update.greasyfork.org/scripts/464946/Grundo%27s%20Cafe%20Brain%20Tree.meta.js
// ==/UserScript==

const selectors = {
    answer: "#page_content strong u",
    submitButton: "#page_content input[type='submit']",
    placeInput: "input[name='place']",
    yearInput: "input[name='year']"
};

const elements = {
    answer: document.querySelector(selectors.answer),
    submitButton: document.querySelector(selectors.submitButton),
    placeInput: document.querySelector(selectors.placeInput),
    yearInput: document.querySelector(selectors.yearInput)
};

const currentDate = new Date();

/**
 * Compute if Daylight Savings Time is active.
 * @param {Object} date
 * @returns {Boolean}
 */
function isDaylightSavings(date) {
    let jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset()
    let jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset()
    return Math.max(jan, jul) !== date.getTimezoneOffset()
}

/**
 * Compute Date for midnight when dailies reset.
 * @param {Object} date
 * @returns {Object} date at midnight
 */
function getMidnight(date) {
    let midnightNumber = 0;

    if (isDaylightSavings(date)) {
        midnightNumber = date.setUTCHours(31,0,0,0);
    } else {
        midnightNumber = date.setUTCHours(32,0,0,0);
    }
    return new Date(midnightNumber);
}

/**
 * Handle locally stored answer value by clearing if expired, or populating input.
 * @param {String} answerType - 'year' or 'place'
 * @param {Object} date - current date
 */
function handleStoredAnswer(answerType, date) {
    const answer = GM_getValue(answerType);
    const answerExpires = new Date(GM_getValue(`${answerType}Expires`));

    if (!answer) {
        return;
    } else {
        if (answerExpires && date > answerExpires) {
            GM_deleteValue(answerType);
            GM_deleteValue(`${answerType}Expires`);
        } else {
            elements[`${answerType}Input`].value = answer;
        }
    }
}

/**
 * Store answer.
 * @param {String} answer
 */
function storeAnswer(answer) {
    const midnight = Date.parse(getMidnight(currentDate));

    if (answer.match(/[\d]+[\w]*/)) {
        GM_setValue('year', answer);
        GM_setValue('yearExpires', midnight);
    } else {
        GM_setValue('place', answer);
        GM_setValue('placeExpires', midnight);
    }
}

(function() {
    'use strict';

    if (window.location.href.includes('braintree')) {
        if (!elements.submitButton) {
            return;
        } else {
            handleStoredAnswer('year', currentDate);
            handleStoredAnswer('place', currentDate);
        }
    }

    if (window.location.href.includes('esophagor')) {
        if (!elements.answer) {
            return;
        } else {
            const answer = elements.answer.innerHTML;
            storeAnswer(answer);
        }
    }
})();