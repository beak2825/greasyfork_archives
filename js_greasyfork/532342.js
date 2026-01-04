// ==UserScript==
// @name         Neopets - Tyranu Evavu Autoplayer
// @version      1.3
// @namespace    https://greasyfork.org/en/users/1450608-dogwithglasses
// @description  Autoplays Tyranu Evavu
// @match        *://www.neopets.com/games/tyranuevavu.phtml*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532342/Neopets%20-%20Tyranu%20Evavu%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/532342/Neopets%20-%20Tyranu%20Evavu%20Autoplayer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fullDeck = (() => {
        const suits = ["hearts", "clubs", "diamonds", "spades"];
        const cards = [];
        for (let val = 2; val <= 14; val++) {
            for (let suit of suits) {
                cards.push(`${val}_${suit}`);
            }
        }
        return cards;
    })();

    const getCardList = () => JSON.parse(GM_getValue("cards", "[]"));
    const setCardList = (cards) => GM_setValue("cards", JSON.stringify(cards));

    function main() {
        const playBtn = document.querySelector('form input[type="submit"][value="Play Now!"]');
        const replayBtn = document.querySelector('input[type="submit"][value="Play Again"]');
        const cardImg = document.querySelector('img[src*="/games/cards/"]');

        const buttonsFound = playBtn || replayBtn || cardImg;

        if (!buttonsFound && !document.body.innerHTML.includes("I think that means you've played enough for today.")) {
            location.reload();
            return;
        }

        if (playBtn) {
            setCardList(fullDeck);
            playBtn.closest("form").submit();
        } else if (replayBtn) {
            GM_deleteValue("cards");
            replayBtn.closest("form").submit();
        } else if (cardImg) {
            const url = cardImg.src;
            const match = url.match(/cards\/(.+)\.gif/);
            if (match) {
                const currentCard = match[1];
                const deck = getCardList();
                const index = deck.indexOf(currentCard);
                const total = deck.length;
                if (index !== -1) deck.splice(index, 1);
                setCardList(deck);

                if (total > 1) {
                    const ratio = index / (total - 1);
                    const action = ratio > 0.5 ? "lower" : "higher";
                    const link = document.querySelector(`a[href*="action=${action}"]`);
                    if (link) {
                        link.click();
                    }
                }
            }
        }
    }

    setTimeout(main, Math.floor(Math.random() * 800) + 200);

})();