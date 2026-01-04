// ==UserScript==
// @name         Chess.com - Tier System
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replaces ranks with colored tiers!
// @author       SaberSpeed77
// @match        https://www.chess.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475389/Chesscom%20-%20Tier%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/475389/Chesscom%20-%20Tier%20System.meta.js
// ==/UserScript==

var observer = new MutationObserver((mutations) => {
    var ratings = document.querySelectorAll(".user-tagline-rating, .user-rating, .rating-score-rating, .cc-user-rating-white, .cc-user-rating-black, .cc-user-rating-default");
    ratings.forEach(r => {
        var text = parseInt(r.textContent.substring(r.textContent.indexOf("(") + 1, r.textContent.indexOf(")")));
        r.style.fontSize = "1px";
        r.style.width = "20px";
        r.style.height = "10px";

        if (text < 800) {
            r.style.color = "#998671";
            r.style.backgroundColor = "#998671";
        } else if (text <= 1100) {
            r.style.color = "#828181";
            r.style.backgroundColor = "#828181";
        } else if (text <= 1300) {
            r.style.color = "#bdbb53";
            r.style.backgroundColor = "#bdbb53";
        } else if (text <= 1600) {
            r.style.color = "#538bbd";
            r.style.backgroundColor = "#538bbd";
        } else if (text <= 2000) {
            r.style.color = "#5ed168";
            r.style.backgroundColor = "#5ed168";
        } else if (text <= 2300) {
            r.style.color = "#b85dc2";
            r.style.backgroundColor = "#b85dc2";
        } else {
            r.style.color = "#d15e64";
            r.style.backgroundColor = "#d15e64";
        }
    })

    var chatroom = document.querySelectorAll(".game-start-message-component, .game-over-message-component");
    chatroom.forEach(r => {
        r.style.visibility = "hidden";
    });
});

  observer.observe(document, {
    childList: true,
    subtree: true
  });

