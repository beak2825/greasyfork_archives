// ==UserScript==
// @name         Tyranu Evavu AP
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-05-01
// @description  Auto plays Tyranu Evavu
// @author       AyBeCee
// @match        https://www.grundos.cafe/games/tyranuevavu/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @grant        GM_setValue
// @grant        GM_getValue
 // @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/535282/Tyranu%20Evavu%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/535282/Tyranu%20Evavu%20AP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }


    var playedCards = GM_getValue('playedCardsKey', []);
    console.log(playedCards);

    if ( $(`[value="Play Now!"]`).length > 0 ) {
        GM_setValue('playedCardsKey', []);
    }


    const TOTAL_PER_RANK = 4;

    function calculateProbabilities(played, shownCard) {
        let deck = {};
        for (let i = 2; i <= 14; i++) {
            deck[i] = TOTAL_PER_RANK;
        }

        // Subtract played cards
        played.forEach(card => {
            if (deck[card] > 0) deck[card]--;
        });

        // Subtract the shown card
        if (deck[shownCard] > 0) deck[shownCard]--;

        let lower = 0, higher = 0, equal = deck[shownCard], total = 0;

        for (let i = 2; i <= 14; i++) {
            total += deck[i];
            if (i < shownCard) lower += deck[i];
            else if (i > shownCard) higher += deck[i];
        }

        // Calculate percentages
        let lowerPct = (lower / total * 100);
        let equalPct = (equal / total * 100);
        let higherPct = (higher / total * 100);

        // Determine best guess
        let max = Math.max(lowerPct, equalPct, higherPct);
        let bestGuess = '';
        if (max === lowerPct) bestGuess = 'lower';
        else if (max === equalPct) bestGuess = 'equal';
        else bestGuess = 'higher';

        return {
            lower: lowerPct.toFixed(1),
            equal: equalPct.toFixed(1),
            higher: higherPct.toFixed(1),
            bestGuess: bestGuess
        };
    }
    var totalEarned = Number($(`p:contains((You have earned ) strong`).text().replace(",",""));
    if ( $(`p:contains((You have earned ) strong`).length > 0 && totalEarned < 20000) {
        setTimeout(function () {
             $(`[value="Play Now!"]`).click()
        }, getRandomInt(0, 2000));
    } else if ( $(`[value="Play Again"]`).length > 0 ) {
        setTimeout(function () {
            $(`[value="Play Again"]`).click()
        }, getRandomInt(0, 2000));
    } else {

        var card =    $(`.te-cards.flex.med-gap.justify-center img:first`).attr("src");
        card = Number(card.substring(
            card.indexOf("cards/") + 6,
            card.lastIndexOf("_")
        ));

        var shownCard = card;

        const played = playedCards.filter(x => x >= 2 && x <= 14);
        const result = calculateProbabilities(played, shownCard);

        var predictions = `
    <p><strong>Probability the hidden card is LOWER:</strong> ${result.lower}%</p>
    <p><strong>Probability it is EQUAL:</strong> ${result.equal}%</p>
    <p><strong>Probability it is HIGHER:</strong> ${result.higher}%</p>
        <p><strong>Best Guess:</strong> ${result.bestGuess}</p>
  `
    $('.center').append(predictions);
        console.log(predictions)

        console.log(result.bestGuess);

        setTimeout(function () {

            if ( result.bestGuess== "equal") {
                const random = Math.floor(Math.random() * 2) + 1;
                $(`.te-button:nth-child(${random})`).click();
            } else {
                $(`[value="${result.bestGuess}"]`).click();
            }
        }, getRandomInt(1000, 5000));


        playedCards.push(card);
        GM_setValue('playedCardsKey', playedCards);

    }

})();