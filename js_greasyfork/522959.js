// ==UserScript==
// @name            Advent of Code Day Navigation Links
// @namespace       Violentmonkey Scripts
// @match           https://adventofcode.com/*/day/*
// @grant           none
// @version         1.0
// @author          -
// @description     This adds forward and backwards links to each day's page.
// @author          josh
// @namespace       https://gitlab.com/userscript4/advent-of-code-day-nav
// @supportURL      https://gitlab.com/userscript4/advent-of-code-day-nav/-/issues
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/522959/Advent%20of%20Code%20Day%20Navigation%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/522959/Advent%20of%20Code%20Day%20Navigation%20Links.meta.js
// ==/UserScript==

/**
 * Return the url of the requested day.
 * If less than 1 or greater than 25 provide a url to the overview page.
 * @param {number} day
 * @returns {string} A url to the requested day
 */
function makeURL(day) {
    if (day < 1 || day > 25) {
        return window.location.href.replace(/\/day\/.*/, '');
    }
    return window.location.href.replace(/(?<=\/day\/).*/, day);
}

/**
 * Create an anchor tag.
 * @param {number} day 
 * @param {string} text 
 * @returns {HTMLAnchorElement}
 */
function makeAnchor(day, text) {
    const anchor = document.createElement('a');
    anchor.href = makeURL(day);
    anchor.textContent = text;
    return anchor
}

/**
 * Find the title, extract the day number, replace the `---` with links.
 */
function addNavigationLinks() {
    const title = document.querySelector('article.day-desc > h2');
    const currentDay = parseInt(title.textContent.match(/(?<=Day )[0-9]+(?=:)/)[0]);
    title.textContent = title.textContent.match(/^--- (.*?) ---$/)[1];
    title.prepend(makeAnchor(currentDay - 1, '<-- '));
    title.append(makeAnchor(currentDay + 1, ' -->'));
}

addNavigationLinks();
