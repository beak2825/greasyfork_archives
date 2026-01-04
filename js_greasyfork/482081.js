// ==UserScript==
// @name         GC - Neggsweeper Mines Remaining
// @namespace    https://greasyfork.org/en/users/1202961-twiggies
// @version      2023-12-13
// @description  Shows how many mines are left in a neggsweeper game, assuming that you flagged mines correctly.
// @author       You
// @match        https://www.grundos.cafe/games/neggsweeper/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482081/GC%20-%20Neggsweeper%20Mines%20Remaining.user.js
// @updateURL https://update.greasyfork.org/scripts/482081/GC%20-%20Neggsweeper%20Mines%20Remaining.meta.js
// ==/UserScript==

'use strict';
const neggGrid = document.querySelector('#neggsweeper_grid')
if (neggGrid != undefined) {
    const statusGrid = document.querySelector('#neggsweeper_status');
    const remainingDiv = statusGrid.querySelector('div:nth-of-type(4)');
    const remaining = Number(remainingDiv.textContent);
    //Remaining number of unmarked, unrevealed neggs.
    const neggsLeft = neggGrid.querySelectorAll('img[src="https://grundoscafe.b-cdn.net/games/php_games/neggsweeper/negg.gif"]').length;

    console.log(`Mines: ${neggsLeft - remaining}`);
    statusGrid.querySelector('div:nth-of-type(1)').insertAdjacentHTML('afterend','<div class="bg-gold">Mines</div>')
    remainingDiv.insertAdjacentHTML('afterend',`<div>${neggsLeft - remaining}</div>`)
    statusGrid.style.gridTemplateColumns = "30% 20% 20% 30%"

}