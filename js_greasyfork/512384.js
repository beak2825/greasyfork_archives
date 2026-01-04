// ==UserScript==
// @name         NitroType leagues XP-races
// @namespace    http://tampermonkey.net/
// @version      v2
// @description  Script that shows how many races you need to beat player above you in league (approximately)
// @author       dphdmn
// @match        https://www.nitrotype.com/leagues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nitrotype.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512384/NitroType%20leagues%20XP-races.user.js
// @updateURL https://update.greasyfork.org/scripts/512384/NitroType%20leagues%20XP-races.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function intNum(input) {
        // Remove all commas using the replace method and parse the result as an integer
        const number = parseInt(input.replace(/,/g, ''), 10);
        return isNaN(number) ? null : number; // Return null if the input is not a valid number
    }
    // Function to get the text content of the "self" element
    function getSelfXP() {
        const selfElement = document.querySelector('tr.table-row.is-self td.table-cell.leagues--standings--experience');
        if (selfElement) {
            return intNum(selfElement.textContent.trim());
        } else {
            return null;
        }
    }
    function getSelfRaces() {
        const selfElement = document.querySelector('tr.table-row.is-self td.table-cell.leagues--standings--played');
         if (selfElement) {
            return intNum(selfElement.textContent.trim());
        } else {
            return null;
        }
    }

    // Function to get all elements that match the criteria
    function getAllElementsXP() {
        const elements = document.querySelectorAll('td.table-cell.leagues--standings--experience');
        return elements;
    }

    // Function to initialize after the page has fully loaded
    function initialize() {
        const interval = setInterval(() => {
            const selfXP = getSelfXP();
            const selfRaces = getSelfRaces()
            const allXP = getAllElementsXP();

            // Check if both the selfXP and allXP are non-empty
            if (selfXP && allXP.length > 0) {
                const xpRatio = selfXP/selfRaces;

                allXP.forEach((element, index) => {
                    const xpValue = intNum(element.textContent.trim());
                    const racesToMatch = Math.ceil(xpValue / xpRatio);
                    const racesDifference = racesToMatch - selfRaces;
                    if (selfXP != xpValue) {
                        if (selfXP > xpValue) {
                            element.innerHTML = element.textContent + "<br><span style=\"font-size: 14px; color: red;\">" + racesDifference + "</span>";
                        } else {
                            element.innerHTML = element.textContent + "<br><span style=\"font-size: 14px; color: cyan;\">+" + racesDifference + "</span>";
                        }
                    }
                });

                clearInterval(interval);
            }
        }, 100);
    }

    // Wait for the page to load before starting the interval check
    window.addEventListener('load', initialize);
    document.getElementById("showindividual").addEventListener('click', initialize);
    document.getElementById("showteam").addEventListener('click', initialize);


})();
