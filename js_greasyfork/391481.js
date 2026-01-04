// ==UserScript==
// @name         TORN: High/Low Helper
// @version      1.3.4
// @description  Only display the 'best' choice for high/low.
// @author       DeKleineKobini
// @namespace    DeKleineKobini [2114440]
// @run-at       document-end
// @license      MIT
// @match        https://www.torn.com/page.php?sid=highlow
// @downloadURL https://update.greasyfork.org/scripts/391481/TORN%3A%20HighLow%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/391481/TORN%3A%20HighLow%20Helper.meta.js
// ==/UserScript==

var debug = false;

$(document).ajaxComplete((event, jqXHR, ajaxObj) => {
    if (jqXHR.responseText) {
        handle(jqXHR.responseText)
    }
})

var cards = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];

function logDebug(message) {
    if (!debug) return;

    console.log("[High\Low Helper] " + message);
}

function shuffleCards() {
    cards = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
}

function getCardsLower(card) {
    let index = card - 2;
    let amount = 0;

    for (let i = 0; i < index; i++) {
        amount = amount + cards[i];
    }
    return amount;
}

function getCardsHigher(card) {
    let index = card - 2;
    let amount = 0;

    for (let i = index + 1; i < cards.length; i++) {
        amount = amount + cards[i];
    }
    return amount;
}

function handle(responseText) {
    var json = JSON.parse(responseText);
    if (json.DB && json.DB.deckShuffled) shuffleCards();

    var currentText;
    var current;
    if (json.status == "startGame") {
        $(".actions-wrap")[0].style = "display: block";
        $(".actions")[0].appendChild($(".startGame")[0])
        $(".startGame")[0].style = "display:inline-block";
        $(".low")[0].style = "display: none";
        $(".high")[0].style = "display: none";
        $(".continue")[0].style = "display: none";
    } else if (json.status == "gameStarted" || json.status == "makeChoice") {
        if (json.status == "gameStarted" && json.currentGame[0].result != "Incorrect")
            currentText = json.currentGame[0].dealerCardInfo.nameShort;
        else
            currentText = json.currentGame[0].playerCardInfo.nameShort;

        current = getValue(currentText);
        cards[current - 2] = cards[current - 2] - 1;

        logDebug("Removed card: " + currentText + " (" + current + ")");
        logDebug(cards);

        if (json.status == "gameStarted") {
            if (json.currentGame[0].result == "Incorrect") return;

            if (getCardsLower(current) >= getCardsHigher(current)) {
                $(".high")[0].style = "display: none";
                $(".low")[0].style = "display: inline-block";
            } else {
                $(".low")[0].style = "display: none";
                $(".high")[0].style = "display: inline-block";
            }
            $(".startGame")[0].style = "display: none";
        }
    }
}

function getValue(text) {
    var value;

    if (text == "J") value = 11;
    else if (text == "Q") value = 12;
    else if (text == "K") value = 13;
    else if (text == "A") value = 14;
    else value = parseInt(text);

    return value;
}