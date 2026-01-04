// ==UserScript==
// @name         Geoguessr - Spacebar to advance to next round
// @version      0.0.1
// @description  This script allows you to press spacebar to advance to the next round or game in geoguessr, rather than hunting for buttons to click on.
// @match        https://www.geoguessr.com/*
// @author       Tyow#3742
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1011193
// @downloadURL https://update.greasyfork.org/scripts/459213/Geoguessr%20-%20Spacebar%20to%20advance%20to%20next%20round.user.js
// @updateURL https://update.greasyfork.org/scripts/459213/Geoguessr%20-%20Spacebar%20to%20advance%20to%20next%20round.meta.js
// ==/UserScript==


let SPACE_TO_ADVANCE_ENABLED = true;

function autoClick()
{
    let a = document.querySelector('div[class*=round-result_actions_] button');
    let c = document.querySelector('button[data-qa*=start-game-button]');
    let d = document.querySelector('div[data-qa*=function-lock] button');
    let e = document.querySelector('button[data-qa*=close-round-result]');
    let f = document.querySelector('button[data-qa*="play-again-button"]');
    let possible_buttons = [a,c,d,e,f];
    for (let possible_button of possible_buttons)
    {
        if (possible_button) possible_button.click();
    }
}

document.addEventListener('keypress', (f) => {
    console.log(f);
    switch (f.key) {
        case ' ': // press space to automatically press buttons that advance the game (next round, new game, etc)
            if (SPACE_TO_ADVANCE_ENABLED && (document.activeElement.tagName.toLowerCase() != 'input' && document.activeElement.tagName.toLowerCase() != 'textarea')) {
                autoClick();
                f.preventDefault();
            }
            break;
    };
});