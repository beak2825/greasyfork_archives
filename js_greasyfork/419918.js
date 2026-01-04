// ==UserScript==
// @name         Go! Go! Go! Autoplayer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically plays Go! Go! Go!
// @author       romboyz
// @include      http://www.neopets.com/prehistoric/gogogo*
// @downloadURL https://update.greasyfork.org/scripts/419918/Go%21%20Go%21%20Go%21%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/419918/Go%21%20Go%21%20Go%21%20Autoplayer.meta.js
// ==/UserScript==

//functional variables
var maxWait = 3000;
var minWait = 800;
var waitTime = Math.random() * (maxWait - minWait) + minWait;
var patt = new RegExp("\\d+"); //Get card value
var exists2 = false;
var selected = false;
var count2 = 0;
var selectedValue = 0;
var playFaceUp = false;
//TODO Play the lowest playable card in the faceup deck (Works for 2)

//individual elements
var startButton = document.querySelector("input[value='Go! Go! Go!']");
var playRoundButton = document.querySelector("input[value*='Play Round']");
var playAgainButton = document.querySelector("input[value*='Play Again!!!']");
var continueButton = document.querySelector("input[value='Continue...']");
var playCardsButton = document.querySelector("input[value='Play Cards']");
var pickUpPileButton = document.querySelector("input[value='Pick Up Pile']");
var cardsStack = document.querySelector("tr:nth-of-type(6)>td>table>tbody>tr:nth-of-type(2)>td:nth-of-type(1)>img");

//lists of card elements
var deck;
var fullSet;
var cardsHand = document.querySelectorAll("tr:nth-of-type(2)>td>table>tbody>tr>td>a>img:nth-of-type(1)");
var cardsFaceUp = document.querySelectorAll("tr:nth-of-type(4)>td:nth-of-type(2)>table>tbody>tr>td>a>img:nth-of-type(1)");
var cardsFaceDown = document.querySelector("tr:nth-of-type(4)>td:nth-of-type(1)>table>tbody>tr>td>a>img:nth-of-type(1)");

//Random timeout before any actions done
console.log("Waiting for " + waitTime/1000 + " seconds");
setTimeout(gogogo, waitTime);

function gogogo() {
    //If no game/game finished, press button to start game
    if (startButton != null) startButton.click(); //Go! Go! Go!
    if (playRoundButton != null) playRoundButton.click(); //Play Round #
    if (playAgainButton != null) playAgainButton.click(); //Play Again

    //Gameplay
    //If not your turn, press continue
    if (continueButton != null) continueButton.click(); //Continue...

    //If it's your turn...
    //Get value of top card in stack
    var active = parseInt(patt.exec(cardsStack.getAttribute("src")));
    console.log("Active card: " + active);

    //Determine which hand to work with
    if (cardsHand.length > 0) { //hand
        console.log("Playing from hand");
        deck = parseCards(cardsHand);
        fullSet = find4(cardsHand, active, deck);
        if (fullSet == null) playCard(cardsHand, active, deck);
        if (!selected && exists2) wildCardCheck(cardsHand, active);
    }
    else if (cardsFaceUp.length > 0) { //face up
        console.log("Playing from face up");
        playFaceUp = true;
        deck = parseCards(cardsFaceUp);
        playCard(cardsFaceUp, active, deck);
        if (!selected && exists2) wildCardCheck(cardsFaceUp, active);
    }
    else { //face down
        console.log("Playing from face down");
        cardsFaceDown.click();
        selected = true;
    }

    //Finish turn
    if (selected) {
        console.log("Card has been played");
        if (playCardsButton != null) playCardsButton.click();
    }
    else {
        console.log("Have to pick up pile");
        if (pickUpPileButton != null) pickUpPileButton.click();
    }
}

function wildCardCheck(hand, active) {
    if (count2 == hand.length && !playFaceUp) { //If the entire hand is just 2s, select all of them
        for (var i = 0; i < hand.length; i++) {
            hand[i].click();
            selected = true;
        }
    }
    else {
        for (var j = 0; j < hand.length; j++) { //Else only select the first one
            var card = parseInt(patt.exec(hand[j].getAttribute("src")));
            if (card == 2 && !selected) {
                hand[j].click();
                selected = true;
            }
        }
    }

}

function parseCards(hand) {
    var deck = [];
    for (var i = 0; i < hand.length; i++) {
        var card = parseInt(patt.exec(hand[i].getAttribute("src")));
        deck.push(card);
    }
    //deck.sort(function(a, b){return a-b});
    return deck;
}

function find4(hand, active, deck) { //If 4 of a playable number is found in the deck, return that number
    var num = 0;
    var occur = 0;
    for (var i = 0; i < deck.length; i++) {
        //If number changes, reset count and start counting new number
        if (deck[i] != num) {
            num = deck[i];
            occur = 1;
        }
        else { //Number hasn't changed and another occurence has been found
            occur++;
        }
        //If 4 occurrences found, check if the number is playable
        if (occur == 4) {
            if (Number.isInteger(active)) { //Active card on stack
                if (active <= num) {
                    if ((num % 2 == 0 && active != 3) || (num % 2 == 1 && active != 4)) {
                        selected = true;
                        selectedValue = num;
                        hand[i].click();
                        hand[i-1].click();
                        hand[i-2].click();
                        hand[i-3].click();
                        return num;
                    }
                }
            }
            else { //No card on stack
                selected = true;
                selectedValue = num;
                hand[i].click();
                hand[i-1].click();
                hand[i-2].click();
                hand[i-3].click();
                return num;
            }
        }
    }
    return null;
}

function playCard(hand, active, deck) {
    console.log(deck);
    for (var i = 0; i < hand.length; i++) {
        var card = deck[i];
        if (Number.isInteger(active)) { //Active card on stack
            if (card == 3 && active <= 3) {
                if (selectedValue == 0 || (selectedValue == 3 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 3;
                    hand[i].click();
                }
            }
            else if (card == 4 && active <= 4 && active != 3) {
                if (selectedValue == 0 || (selectedValue == 4 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 4;
                    hand[i].click();
                }
            }
            else if (card == 5 && active <= 5 && active != 4) {
                if (selectedValue == 0 || (selectedValue == 5 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 5;
                    hand[i].click();
                }
            }
            else if (card == 6 && active <= 6 && active != 3) {
                if (selectedValue == 0 || (selectedValue == 6 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 6;
                    hand[i].click();
                }
            }
            else if (card == 7 && active <= 7 && active != 4) {
                if (selectedValue == 0 || (selectedValue == 7 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 7;
                    hand[i].click();
                }
            }
            else if (card == 8 && active <= 8 && active != 3) {
                if (selectedValue == 0 || (selectedValue == 8 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 8;
                    hand[i].click();
                }
            }
            else if (card == 9 && active <= 9 && active != 4) {
                if (selectedValue == 0 || (selectedValue == 9 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 9;
                    hand[i].click();
                }
            }
            else if (card == 10 && active <= 10 && active != 3) {
                if (selectedValue == 0 || (selectedValue == 10 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 10;
                    hand[i].click();
                }
            }
            else if (card == 11 && active <= 11 && active != 4) { //Jack
                if (selectedValue == 0 || (selectedValue == 11 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 11;
                    hand[i].click();
                }
            }
            else if (card == 12 && active <= 12 && active != 3) { //Queen
                if (selectedValue == 0 || (selectedValue == 12 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 12;
                    hand[i].click();
                }
            }
            else if (card == 13 && active <= 13 && active != 4) { //King
                if (selectedValue == 0 || (selectedValue == 13 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 13;
                    hand[i].click();
                }
            }
            else if (card == 14 && active != 3) { //Ace
                if (selectedValue == 0 || (selectedValue == 14 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 14;
                    hand[i].click();
                }
            }
            else if (card == 2 && active != 3) {
                exists2 = true;
                count2++;
            }
        }
        else { //Stack is empty and any card can by played
            if (card == 3) {
                if (selectedValue == 0 || (selectedValue == 3 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 3;
                    hand[i].click();
                }
            }
            else if (card == 4) {
                if (selectedValue == 0 || (selectedValue == 4 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 4;
                    hand[i].click();
                }
            }
            else if (card == 5) {
                if (selectedValue == 0 || (selectedValue == 5 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 5;
                    hand[i].click();
                }
            }
            else if (card == 6) {
                if (selectedValue == 0 || (selectedValue == 6 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 6;
                    hand[i].click();
                }
            }
            else if (card == 7) {
                if (selectedValue == 0 || (selectedValue == 7 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 7;
                    hand[i].click();
                }
            }
            else if (card == 8) {
                if (selectedValue == 0 || (selectedValue == 8 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 8;
                    hand[i].click();
                }
            }
            else if (card == 9) {
                if (selectedValue == 0 || (selectedValue == 9 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 9;
                    hand[i].click();
                }
            }
            else if (card == 10) {
                if (selectedValue == 0 || (selectedValue == 10 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 10;
                    hand[i].click();
                }
            }
            else if (card == 11) { //Jack
                if (selectedValue == 0 || (selectedValue == 11 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 11;
                    hand[i].click();
                }
            }
            else if (card == 12) { //Queen
                if (selectedValue == 0 || (selectedValue == 12 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 12;
                    hand[i].click();
                }
            }
            else if (card == 13) { //King
                if (selectedValue == 0 || (selectedValue == 13 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 13;
                    hand[i].click();
                }
            }
            else if (card == 14) { //Ace
                if (selectedValue == 0 || (selectedValue == 14 && !playFaceUp)) {
                    selected = true;
                    selectedValue = 14;
                    hand[i].click();
                }
            }
            else if (card == 2) {
                exists2 = true;
                count2++;
            }
        }
    }
}