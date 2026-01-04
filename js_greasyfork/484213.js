// ==UserScript==
// @name         GC - Gormball Click Image to Continue
// @namespace    https://greasyfork.org/en/users/1202961-twiggies
// @version      1.0
// @description  Clicking the image of the 'the gormball explodes on x' continues the game.
// @author       Twiggies
// @match        https://www.grundos.cafe/games/gormball/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484213/GC%20-%20Gormball%20Click%20Image%20to%20Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/484213/GC%20-%20Gormball%20Click%20Image%20to%20Continue.meta.js
// ==/UserScript==

const continueButton = document.querySelector('input[value="Continue!"],input[value="Play Again"]')

if (continueButton != null) {
    //Look for the image and attach the continue button onclick to it.
    const img = document.querySelector('#page_content > div.center > img');
    img.onclick = continueButton.onclick;
    img.style.cursor = 'pointer';
}