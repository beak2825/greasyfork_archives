// ==UserScript==
// @name         GC - Buy Snow Blumaroo from Snowball Fight Prize Shop
// @namespace    https://www.grundos.cafe/
// @version      1.0
// @description  Add keyboard controls so you can buy Snow Blumaroo pressing Enter
// @author       Teffy
// @match        https://www.grundos.cafe/winter/snowball_fight/prizes/
// @match        https://grundos.cafe/winter/snowball_fight/prizes/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485472/GC%20-%20Buy%20Snow%20Blumaroo%20from%20Snowball%20Fight%20Prize%20Shop.user.js
// @updateURL https://update.greasyfork.org/scripts/485472/GC%20-%20Buy%20Snow%20Blumaroo%20from%20Snowball%20Fight%20Prize%20Shop.meta.js
// ==/UserScript==
          
// Find the Snow Blumaro
const blumaroo = document.querySelector('form input[src="https://grundoscafe.b-cdn.net/items/snowman_blum.gif"]');

document.addEventListener("keydown", (event) => {
    // Check if the pressed key is Enter
    if (event.keyCode === 13 && blumaroo) {
        // If the blumaroo element exists, click it
        blumaroo.click();
    }
});
