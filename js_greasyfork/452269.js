// ==UserScript==
// @name         Set all chesscom puzzles in rush as correct
// @namespace    http://tampermonkey.net/
// @version      20220930.2
// @description  Show all puzzles as correct
// @author       soup_steward
// @match        https://www.chess.com/*
// @match        https://chess.com/*
// @require http://code.jquery.com/jquery-latest.js
// @grant        none
// @license        MIT
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/452269/Set%20all%20chesscom%20puzzles%20in%20rush%20as%20correct.user.js
// @updateURL https://update.greasyfork.org/scripts/452269/Set%20all%20chesscom%20puzzles%20in%20rush%20as%20correct.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function setPuzzleStatus(){
    $(".streak-icon-square-x").addClass("streak-icon-square-checkmark");
    $(".streak-icon-square-x").removeClass("streak-icon-square-x");

    $(".streak-indicator-incorrect").addClass("streak-indicator-correct");
    $(".streak-indicator-incorrect").removeClass("streak-indicator-incorrect");
};

waitForElm('.streak-icon-square-x').then((elm) => {

setPuzzleStatus();

});

setPuzzleStatus();

$('#board-layout-sidebar').bind('DOMSubtreeModified', function(e) {
  setPuzzleStatus();
});