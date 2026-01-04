// ==UserScript==
// @name         GC Bilge Dice Tracker
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.4
// @description  Tracks your current Bilge Dice streak. Does not work across multiple devices.
// @author       sanjix
// @match        https://www.grundos.cafe/games/bilgedice/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483033/GC%20Bilge%20Dice%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/483033/GC%20Bilge%20Dice%20Tracker.meta.js
// ==/UserScript==

var streakCount = JSON.parse(localStorage.getItem('BilgeDiceStreakCounter')) || 0;
var log = JSON.parse(localStorage.getItem('BilgeDiceLog')) || [];

var game = document.querySelector('#bilge-dice-wrapper');
var counterValue = document.createElement('p');
var headerText = document.createElement('h4');

const WIN = 0;
const TIE = 1;
const LOSE = 2;

headerText.textContent = 'Current Streak:';
headerText.classList.add('bilgeTracker');
counterValue.textContent = streakCount;
counterValue.classList.add('bilgeTracker');
headerText.style.marginBottom = '5px';
counterValue.style.marginTop = '5px';


game.after(counterValue);
counterValue.before(headerText);

function updateCounter(gameState) {
    if (gameState == WIN) {
        streakCount += 1;
        log.push('win');
    } else {
        streakCount = 0;
        log = [];
    }
    // } else if (gameState == TIE) {
    //     if (log[log.length - 1] == 'tie') { // if this is the second consecutive tie, reset streak
    //         streakCount = 0;
    //         log = [];
    //     } else {
    //         log.push('tie'); // else add a tie to the log but do not alter streak
    //     }
    // }
    counterValue.textContent = streakCount;
    localStorage.setItem('BilgeDiceStreakCounter', JSON.stringify(streakCount));
    localStorage.setItem('BilgeDiceLog', JSON.stringify(log));
}


if (document.evaluate(
    "count(//div[@id='bilge-dice-wrapper']//p[contains(.,'You won!')]) > 0",
    document,
    null,
    XPathResult.BOOLEAN_TYPE,
    null
).booleanValue) {
    updateCounter(WIN);
} else if (document.evaluate(
    "count(//div[@id='bilge-dice-wrapper']//p[contains(.,'You tied.')]) > 0",
    document,
    null,
    XPathResult.BOOLEAN_TYPE,
    null
).booleanValue) {
    updateCounter(TIE);
} else if (document.evaluate(
    "count(//div[@id='bilge-dice-wrapper']//p[contains(., 'Oh no!')]) > 0",
    document,
    null,
    XPathResult.BOOLEAN_TYPE,
    null
).booleanValue) {
    updateCounter(LOSE);
} else if (document.evaluate(
    "count(//div[@id='bilge-dice-wrapper']//p[contains(., 'lose')]) > 0",
    document,
    null,
    XPathResult.BOOLEAN_TYPE,
    null
    ).booleanValue) {
    updateCounter(LOSE);
}

console.log(log);