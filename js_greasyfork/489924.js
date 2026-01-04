// ==UserScript==
// @name         GC Guess the Card Keyboard Controls Test
// @namespace    https://greasyfork.org/en/users/1175371
// @version      0.4
// @description  Adds keyboard controls to GC's Guess the Card
// @author       sanjix
// @match        https://www.grundos.cafe/games/psychoanalysis/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489924/GC%20Guess%20the%20Card%20Keyboard%20Controls%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/489924/GC%20Guess%20the%20Card%20Keyboard%20Controls%20Test.meta.js
// ==/UserScript==

var cards = document.querySelectorAll('main form button[name="card"]');
var buttons = document.querySelector('#page_content main .button-group button.form-control');

function guessRandomCard(cards) {
    var randomizer = Math.floor(Math.random() * 5)
    return cards[randomizer]
}

document.addEventListener('keydown', (event) => {
    console.log(event.key);
    if (event.key == 'Enter') {
        if (cards.length > 0) {
            guessRandomCard(cards).click();
        } else if (buttons != null) {
            buttons.click();
        }
    }
})