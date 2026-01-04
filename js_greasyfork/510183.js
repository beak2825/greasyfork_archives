// ==UserScript==
// @name         GC Food Club Submit Bet Keyboard Control
// @namespace    https://greasyfork.org/en/users/1175371
// @version      0.1
// @description  Press enter to place a bet after clicking a bet link for GC's Food Club
// @author       sanjix
// @match        https://www.grundos.cafe/games/foodclub/bet/?bet*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510183/GC%20Food%20Club%20Submit%20Bet%20Keyboard%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/510183/GC%20Food%20Club%20Submit%20Bet%20Keyboard%20Control.meta.js
// ==/UserScript==

var betButton = document.querySelector('form[name="bet_form"] div.button-group input[value="Place this bet!"');
document.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
        betButton.click();
    }
});