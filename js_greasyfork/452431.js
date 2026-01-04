// ==UserScript==
// @name         MoxfieldZoneCountRepositions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Repositions The Library, Graveyard, Hand and Exile Dropdowns to the top of the page
// @author       JoschiGrey
// @match        https://www.moxfield.com/decks/*/goldfish
// @icon         https://www.moxfield.com/favicon.png
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/452431/MoxfieldZoneCountRepositions.user.js
// @updateURL https://update.greasyfork.org/scripts/452431/MoxfieldZoneCountRepositions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    runWhenReady('.board', changeSite);

})();

function changeSite(){
    let newDiv = insertDiv()
    let dropDowns = getDropDowns()

    for (const dropDown of dropDowns) {
        newDiv.appendChild(dropDown)
    }
}



/**
 * @return {HTMLDivElement}
 */
function insertDiv(){
    let newDiv = document.createElement("div")
    newDiv.id = "TopZones"
    const style = newDiv.style
    style.display = "flex"


    const board = document.getElementsByClassName("board")[0]
    const parent = board.parentElement
    parent.insertBefore(newDiv, board)

    return newDiv
}

/**
 * @return {Array<HTMLDivElement>}
 */
function getDropDowns(){
    const dropDowns = document.getElementsByClassName("dropdown")

    let relevantDropDowns = []

    for (const dropDown of dropDowns) {
        if (dropDown.parentElement.className.includes("zone") && dropDown.innerHTML.includes("(")){
            dropDown.style.margin = "0px 7px"
            relevantDropDowns.push(dropDown)
        }
    }
    return relevantDropDowns
}

// Convenience function to execute your callback only after an element matching readySelector has been added to the page.
// Example: runWhenReady('.search-result', augmentSearchResults);
// Gives up after 1 minute.
function runWhenReady(readySelector, callback) {
    let numAttempts = 0;
    let tryNow = function() {
        let elem = document.querySelector(readySelector);
        if (elem) {
            callback(elem);
        } else {
            numAttempts++;
            if (numAttempts >= 34) {
                console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
            } else {
                setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
            }
        }
    };
    tryNow();
}