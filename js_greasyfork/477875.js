// ==UserScript==
// @name         GMify
// @version      20231020-3
// @description  Pretend to be GM
// @author       soup_steward
// @match        https://www.chess.com/*
// @match        https://chess.com/*
// @require http://code.jquery.com/jquery-latest.js
// @grant        none
// @license        MIT
// @inject-into content
// @namespace https://greasyfork.org/users/964951
// @downloadURL https://update.greasyfork.org/scripts/477875/GMify.user.js
// @updateURL https://update.greasyfork.org/scripts/477875/GMify.meta.js
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

function setGmStatus(){



    $('#board-layout-player-bottom > div > div.player-tagline > div.player-game-over-component > div > span.rating-score-rating').html(
  parseInt($('#board-layout-player-bottom > div > div.player-tagline > div.player-game-over-component > div > span.rating-score-rating').html()) +2000
    );


    $('.user-tagline-rating').html(
  parseInt($('.user-tagline-rating').html().replace("(","").replace(")","")) +2000
    );

  $('#board-layout-player-bottom > div > div.player-tagline > div.user-tagline-component').prepend('<a href="/members/titled-players" target="_blank" class="user-chess-title-component" data-tooltip-target="10">GM</a>');



};

waitForElm('.rating-score-rating').then((elm) => {

setGmStatus();
  setElo();

});


waitForElm('#board-layout-player-bottom > div > div.player-tagline > div > span').then((elm) => {

setGmStatus();
  setElo();

});



$('#board-layout-player-bottom > div > div.player-tagline > div.player-game-over-component > div > span.rating-score-rating').bind('DOMSubtreeModified', function(e) {
  setGmStatus();
  //setElo();
});

