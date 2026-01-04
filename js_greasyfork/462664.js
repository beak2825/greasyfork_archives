// ==UserScript==
// @name         AutoGoombler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  An automatic blackjack bot for rDrama.net. You will still lose money, but it's kind of cool and maybe you just want to have a bunch of bets on your screen or something.
// @author       Broble64/Konkey_Dongle64
// @match        https://rdrama.net/casino/blackjack
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462664/AutoGoombler.user.js
// @updateURL https://update.greasyfork.org/scripts/462664/AutoGoombler.meta.js
// ==/UserScript==



var fullAutobutton=document.createElement("input");
fullAutobutton.setAttribute("style", "font-size:18px;position:absolute;top:120px;left:400px;");
fullAutobutton.type="button";
fullAutobutton.value="FULL AUTO";
fullAutobutton.onclick = fullAuto;
document.body.appendChild(fullAutobutton);

function timetodeal(){
    var casinoResult = document.getElementById('casinoGameResult');
    var resulttext = casinoResult.innerText.toLowerCase();
    if (resulttext.includes("lost")){
        return 1;
    }
    if (resulttext.includes("pushed")){
        return 1;
    }
    if (resulttext.includes("won")){
        return 1;
    }
    if (resulttext.includes("blackjack")){
        return 1;
    }
    else return 0;
}

function calculateHand() {
    var HandArray = document.getElementsByClassName('blackjack-cardset')[1].getElementsByClassName("playing-card_large");
    var newArray = [].slice.call(HandArray);
    newArray.splice(newArray.length, 2);
    var cards = newArray;

    let total = 0;
    let aceCount = 0;
    for (let card of cards) {
        card = card.innerText.slice(0, -2);
        if (card === "A") {
            aceCount++;
            total += 11;
        } else if (card === "K" || card === "Q" || card === "J") {
            total += 10;
        } else {
            total += parseInt(card);
        }

    }
    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }
    if (aceCount > 0) {
        return [total, "soft"];
    } else {

        return [total, "hard"];
    }
}

function DealerHand(){
    var DealArray = document.getElementsByClassName('blackjack-cardset')[0].getElementsByClassName("playing-card_large");
    var newArray = [].slice.call(DealArray);
    newArray.splice(newArray.length, 2);
    var cards = newArray;
    var dealerCard = cards[0].innerText.slice(0, -2);
    if (dealerCard === "K" || dealerCard === "Q" || dealerCard === "J") {
        dealerCard = "10"
    }
    if (dealerCard === "A") {
        dealerCard = "11"
    }
    return(parseInt(dealerCard));
}

function fullAuto() {
    var i = 1;
    function doIteration() {
        i = 1;
        if (i >= 1000) {
            return;
        }
        var dealinput = document.getElementById("twentyone-DEAL");
        var moneyinput = document.getElementById("wagerAmount");
        moneyinput.value = 5;
        if (timetodeal() === 1) {
            dealinput.click();
            setTimeout(doIteration, 2000); // wait for 2 seconds before next iteration
            return;
        }
        if (timetodeal() === 0) {
            var playerValue = calculateHand()[0];
            var dealerValue = DealerHand();
            var isHard = calculateHand()[1];
            console.log(playerValue);
            console.log(dealerValue);
            console.log(isHard);
            console.log(shouldHit(playerValue, dealerValue, isHard));
            if (shouldHit(playerValue, dealerValue, isHard)) {
                var hitinput = document.getElementById("twentyone-HIT");
                hitinput.click();
            } else {
                var stayinput = document.getElementById("twentyone-STAY");
                stayinput.click();
            }
        }
        setTimeout(doIteration, 2000); // wait for 2 seconds before next iteration
    }
    setTimeout(doIteration, 2000); // wait for 2 seconds before starting the loop
}

function shouldHit(playerValue, dealerValue, isHard) {
    if (isHard == "hard") {
        switch(playerValue) {
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
                return 1;
            case 12:
                return dealerValue >= 3 && dealerValue <= 6 ? 0 : 1;
            case 13:
            case 14:
            case 15:
            case 16:
                return dealerValue <= 6 ? 0 : 1;
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
                return 0;
            default:
                return null;
        }
    } else {
        switch(playerValue) {
            case 13:
            case 14:
            case 15:
            case 16:
                return 1;
            case 17:
                return dealerValue <= 8 ? 1 : 0;
            case 18:
            case 19:
            case 20:
            case 21:
                return 0;
            default:
                return null;
        }
    }
}