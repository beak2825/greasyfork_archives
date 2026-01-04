// ==UserScript==
// @name         Set all chesscom puzzles in rush as failed
// @namespace    http://tampermonkey.net/
// @version      20220930
// @description  Show all puzzles as incorrect
// @author       soup_steward
// @match        https://www.chess.com/*
// @match        https://chess.com/*
// @require http://code.jquery.com/jquery-latest.js
// @grant        none
// @license        MIT
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/452268/Set%20all%20chesscom%20puzzles%20in%20rush%20as%20failed.user.js
// @updateURL https://update.greasyfork.org/scripts/452268/Set%20all%20chesscom%20puzzles%20in%20rush%20as%20failed.meta.js
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
    $(".streak-icon-square-checkmark").addClass("streak-icon-square-x");
    $(".streak-icon-square-checkmark").removeClass("streak-icon-square-checkmark");

    $(".streak-indicator-correct").addClass("streak-indicator-incorrect");
    $(".streak-indicator-correct").removeClass("streak-indicator-correct");
};

waitForElm('.streak-icon-square-x').then((elm) => {

setPuzzleStatus();

});

setPuzzleStatus();

$('#board-layout-sidebar').bind('DOMSubtreeModified', function(e) {
  setPuzzleStatus();
});