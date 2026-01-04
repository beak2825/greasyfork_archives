// ==UserScript==
// @name         GC Bilge Dice Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.2
// @description  Binds each die to a number and "keep" to Enter so you can play without a mouse.
// @author       sanjix
// @match        https://www.grundos.cafe/games/bilgedice/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483260/GC%20Bilge%20Dice%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/483260/GC%20Bilge%20Dice%20Keyboard%20Controls.meta.js
// ==/UserScript==

var dice = document.querySelectorAll("#bilge-dice-user-wrapper form .spacing-horizontal-dice label input");
var keep = document.querySelector(".bilge-dice-col input[value='Keep']");
var checkForWin = document.querySelector("input[value='See if you defeated those scallywags!!']");
var restart = document.querySelector("#bilge-dice-wrapper form input[type='submit']");
var newGame = document.querySelectorAll('form.mt-1 input.form-control[type="submit"]');
newGame = newGame[newGame.length - 1];
document.addEventListener("keydown", ((event) => {
	switch (event.keyCode) {
	case 49: //1
		{
			dice[0].click();
		}
		break;
	case 50: //2
		{
			if (dice.length >= 2) {
				dice[1].click();
			}
		}
		break;
	case 51: //3
		{
			if (dice.length >= 3) {
				dice[2].click();
			}
		}
		break;
	case 52: //4
		{
			if (dice.length >= 4) {
				dice[3].click();
			}
		}
		break;
	case 53: //5
		{
			if (dice.length >= 5) {
				dice[4].click();
			}
		}
		break;
	case 54: //6
		{
			if (dice.length == 6) {
				dice[5].click();
			}
		}
		break;
	case 13: //enter
		{
			if (keep != null) {
				keep.click();
			} else if (checkForWin != null) {
				checkForWin.click();
			} else if (newGame != null) {
				newGame.click();
			} else if (restart != null) {
                restart.click();
            }
		}
		break;
	}
}));