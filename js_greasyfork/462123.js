// ==UserScript==
// @name         Archidekt: Show cards count in current view
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  This script adds a small counter to Archidekt, which shows you how many cards are currently displayed.
// @author       JoschiGrey
// @match        https://archidekt.com/decks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archidekt.com
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/462123/Archidekt%3A%20Show%20cards%20count%20in%20current%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/462123/Archidekt%3A%20Show%20cards%20count%20in%20current%20view.meta.js
// ==/UserScript==
const LOGGING_ENABLED = false; // Set to false to disable logging
let CurrentObserver = undefined;

(function() {
    'use strict';
    setInterval(initializeScript, 1000)
})();

function initializeScript(){
    if(!document.getElementById("inSideBoardCounter")){
        if(CurrentObserver){
            CurrentObserver.disconnect()
        }

        runWhenReady("inner_stack_container", setUpObserver);
        runWhenReadyJQuery("div[class*=deckFilters_group]", insertHTML);
    }
}


function log(message) {
    if (LOGGING_ENABLED) {
        console.log(message);
    }
}

function setUpObserver() {
    log("Trying to set up observer")
    const inDeckContainer = document.getElementById("inner_stack_container")
    const inSideBoardContainer = document.getElementById("side_stack_container")
    let attempts = 0
    function tryNow() {
        if (attempts > 34) {
            console.warn("Failed to set up observer after 34 tries")
            return
        }
        if (!inDeckContainer || !inSideBoardContainer){
            attempts++
            setTimeout(tryNow, 250 * Math.pow(1.1, attempts));
            return;
        }
        const config = { subtree: true, characterData:true };
        if(!CurrentObserver){
            CurrentObserver = new MutationObserver(observerCallback)
        }

        CurrentObserver.observe(inDeckContainer, config)
        CurrentObserver.observe(inSideBoardContainer, config)
        log("Observer set up successfully.");
    }
    tryNow();
}

function insertHTML() {
    log("Setting up HTML")
    const j = jQuery.noConflict();
    const deckFilters = j("div[class*=deckFilters_group]")[0]
    const newDiv = document.createElement('div');
    newDiv.style.display = "flex"
    newDiv.style.alignSelf = "end"
    newDiv.style.flexDirection = "column"


    newDiv.appendChild(createDisplay("Currently Displayed (Deck): ", "inDeckCounter"))
    newDiv.appendChild(createDisplay("Currently Displayed (Side Board): ", "inSideBoardCounter"))
    deckFilters.appendChild(newDiv)

    observerCallback()
}

function createDisplay(innerText, id){
    const parent = document.createElement('span');
    parent.textContent = innerText

    const counterSpan = document.createElement('span');
    counterSpan.id = id
    parent.appendChild(counterSpan)

    return parent
}

function observerCallback(mutationList, observer){
    if(mutationList){
        for (const mutationRecord of mutationList) {
            if (!mutationRecord.target.wholeText.includes("(")){
                return
            }
        }
    }
    const j = jQuery.noConflict();
    log("Observer Callback ran")

    const inDeck = j('#inner_stack_container div[class*=stack_stackName]')
    const inDeckCounterElement = document.getElementById("inDeckCounter")
    if(inDeckCounterElement){
        inDeckCounterElement.textContent = countShownCards(inDeck)
    } else {
        insertHTML()
    }

    const inSideBoard = j('#side_stack_container div[class*=stack_stackName]')
    const inSideBoardElement = document.getElementById("inSideBoardCounter")
    if(inSideBoardElement){
        inSideBoardElement.textContent = countShownCards(inSideBoard)
    } else {
        insertHTML()
    }
}


function countShownCards(elements){
    let sumOfCards = 0
    for (const element of elements) {
        sumOfCards += extractNumber(element.textContent)
    }
    log("Total number of cards displayed: " + sumOfCards);
    return sumOfCards + ""
}

function extractNumber(str) {
    const match = str.match(/\((\d+)\)/); // match a number enclosed in parentheses
    if (match) {
        return parseInt(match[1]); // convert the matched number to an integer and return it
    } else {
        return null; // no number found, return null
    }
}


// Convenience function to execute your callback only after an element matching readySelector has been added to the page.
// Example: runWhenReady('.search-result', augmentSearchResults);
// Gives up after 1 minute.
function runWhenReady(readySelector, callback) {
    let numAttempts = 0;
    let tryNow = function() {
        let elem = document.getElementById(readySelector)
        if (elem) {
            callback();
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


// Convenience function to execute your callback only after an element matching readySelector has been added to the page.
// Example: runWhenReady('.search-result', augmentSearchResults);
// Gives up after 1 minute.
function runWhenReadyJQuery(readySelector, callback) {
    const j = jQuery.noConflict();
    let numAttempts = 0;
    let tryNow = function() {
        let elem = j(readySelector)[0]
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