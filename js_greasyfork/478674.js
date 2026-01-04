// ==UserScript==
// @name         GC Larger Dice-A-Roo Buttons
// @version      0.1
// @description  Easier to click Dice-A-Roo buttons so you can chill and idly tap a nice large target. Applies to the 'Roll Again' when playing, 'Press Me' when game over, and 'Lets Play!' when at the main menu buttons.
// @author       Twiggies
// @match        https://www.grundos.cafe/games/play_dicearoo/
// @match        https://www.grundos.cafe/games/dicearoo/
// @icon         https://i.imgur.com/zGP1hIH.png
// @namespace    https://github.com/13ulbasaur/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478674/GC%20Larger%20Dice-A-Roo%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/478674/GC%20Larger%20Dice-A-Roo%20Buttons.meta.js
// ==/UserScript==

const rollAgainButton = document.querySelector('#dice-a-roo > input, input[value="Roll Again"], input[value="Press Me"], input[value="Lets Play!"]');


if (rollAgainButton) {
    rollAgainButton. style.height = "250px";
}