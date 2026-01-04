// ==UserScript==
// @name         [GC] Tyranu Evavu Recs
// @namespace    https://greasyfork.org/en/users/1142431-guribot
// @version      0.4.2
// @description  Makes Uggsul and friends give recommendations based on cards seen and adds keyboard controls (modified for arrow keys and spacebar)
// @author       guribot
// @match        https://www.grundos.cafe/games/tyranuevavu/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/506706/%5BGC%5D%20Tyranu%20Evavu%20Recs.user.js
// @updateURL https://update.greasyfork.org/scripts/506706/%5BGC%5D%20Tyranu%20Evavu%20Recs.meta.js
// ==/UserScript==

// WARNING to anyone who knows anything about javascript and can see how
// messy this code is:
//
// sorry

// using an array is bad for readability but good for counting
//        card #:  X, X, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
var CARD_COUNTS = [0, 0, 4, 4, 4, 4, 4, 4, 4, 4,  4, 4, 4, 4, 4]
var currentCardCounts = []

var playNow = '.button-group input[value="Play Now!"]'
var playAgain = '.button-group input[value="Play Again"]'
var recommended = '.recommended';

document.addEventListener("keydown", (event) => {
    if (event.code == 'ArrowUp') {
        var tyranuButton = $('.te-buttons form').children('input[name="higher"]').eq(0);
        if (tyranuButton) {
            tyranuButton.click();
        }
    } else if (event.code == 'ArrowDown') {
        var evavuButton = $('.te-buttons form').children('input[name="lower"]').eq(0);
        if (evavuButton) {
            evavuButton.click();
        }
    } else if (event.code == 'Space') {
        if ($(playNow).length > 0) {
            $(playNow).click();
        } else if ($(playAgain).length > 0) {
            $(playAgain).click();
        }
    }
});

function sumLow(num) {
    var total = 0
    for (let i = 0; i < num; i++) {
        total += currentCardCounts[i]
    }
    return total
}

function sumHigh(num) {
    var total = 0
    for (let i = num + 1; i < currentCardCounts.length; i++) {
        total += currentCardCounts[i]
    }
    return total
}

(function() {
    // reset when a new game is started
    if ($('input[value="Play Now!"]').size() === 1) {
        console.log("resetting cardCounts")
        currentCardCounts = [...CARD_COUNTS]
        GM.setValue("tecardcounts", currentCardCounts)
    } else if ($('.te-card').size() != 1) {
        GM.getValue("tecardcounts").then((value) => {
            currentCardCounts = value
            console.log(`after retrieving cards ${currentCardCounts}`)

            var cardSrc = $('.te-cards').children().eq(0).attr('src')
            // regex i dont know her
            var cardNum = parseInt(cardSrc.replace("https://grundoscafe.b-cdn.net/games/php_games/tyranuevavu/", "")
                                   .replace("_hearts.gif", "")
                                   .replace("_spades.gif", "")
                                   .replace("_diamonds.gif", "")
                                   .replace("_clubs.gif", ""))
            console.log(`subtracting from element ${cardNum}`)
            currentCardCounts[cardNum]--
            console.log(currentCardCounts)
            GM.setValue("tecardcounts", currentCardCounts).then(() => {
                var highCount = sumHigh(cardNum)
                var lowCount = sumLow(cardNum)
                var message = ""
                var $button = null
                if (highCount > lowCount) {
                    message = `<strong>Tyranu!!</strong> (${highCount} higher cards and ${lowCount} lower)`
                    $button = $('.te-buttons form').children('input[name="higher"]').eq(0)
                } else if (lowCount > highCount) {
                    message = `<strong>Evavu!!</strong> (${highCount} higher cards and ${lowCount} lower)`
                    $button = $('.te-buttons form').children('input[name="lower"]').eq(0)
                } else {
                    message = `<strong>Whatever!!</strong> (${highCount} higher cards and ${lowCount} lower)`
                    $button = $('.te-buttons form').children('input[name="higher"]').eq(0)
                }
                $button.addClass("recommended")
                $button.css("width", "300px")
                $('div.center').children('p').eq(0).append(`<br><em>Translation:</em> ${message}`)
            })
        })
    }
})();