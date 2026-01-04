// ==UserScript==
// @name         Set all chesscom puzzles pieces to king
// @version      20220930
// @description  Show all puzzles as king
// @author       soup_steward
// @match        https://www.chess.com/*
// @match        https://chess.com/*
// @require http://code.jquery.com/jquery-latest.js
// @grant        none
// @license        MIT
// @inject-into content
// @namespace https://greasyfork.org/users/964951
// @downloadURL https://update.greasyfork.org/scripts/453611/Set%20all%20chesscom%20puzzles%20pieces%20to%20king.user.js
// @updateURL https://update.greasyfork.org/scripts/453611/Set%20all%20chesscom%20puzzles%20pieces%20to%20king.meta.js
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
    $(".bp").addClass("bk");
    $(".bn").addClass("bk");
    $(".bb").addClass("bk");
    $(".br").addClass("bk");
    $(".bq").addClass("bk");
    $(".bp").removeClass("bp");
    $(".bn").removeClass("bn");
    $(".bb").removeClass("bb");
    $(".br").removeClass("br");
    $(".bq").removeClass("bq");
    $(".wp").addClass("wk");
    $(".wn").addClass("wk");
    $(".wb").addClass("wk");
    $(".wr").addClass("wk");
    $(".wq").addClass("wk");
    $(".wp").removeClass("wp");
    $(".wn").removeClass("wn");
    $(".wb").removeClass("wb");
    $(".wr").removeClass("wr");
    $(".wq").removeClass("wq");
};

waitForElm('.streak-icon-square-x').then((elm) => {

setPuzzleStatus();

});

setPuzzleStatus();

$('#board-layout-sidebar').bind('DOMSubtreeModified', function(e) {
  setPuzzleStatus();
});