// ==UserScript==
// @name         AWBW Hide Buttons
// @namespace    https://awbw.amarriner.com/
// @version      1.1
// @description  Avoid accidentally activating powers or ending turn. Not recommended for live play!
// @author       Vincent
// @match        https://awbw.amarriner.com/game.php*
// @icon         https://cdn.discordapp.com/emojis/1059238674597957642.webp
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497051/AWBW%20Hide%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/497051/AWBW%20Hide%20Buttons.meta.js
// ==/UserScript==


let powerButtons = document.getElementsByClassName('power-buttons');
Array.prototype.forEach.call(powerButtons, function(container) {
    container.style.display = 'none';
});

/**
let copButton = document.getElementsByClassName('cop-button');
Array.prototype.forEach.call(copButton, function(container) {
    container.style.display = 'none';
});
**/

/**
let scopButton = document.getElementsByClassName('scop-button');
Array.prototype.forEach.call(scopButton, function(container) {
    container.style.display = 'none';
});
**/

document.querySelector("#end-turn").style.display = 'none';

document.querySelector("#tag-co").style.display = 'none';
