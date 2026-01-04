// ==UserScript==
// @name         GC Tyranu Evavu Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.7
// @description  Adds keyboard controls so you can play Tyranu Evavu on GC without a mouse.
// @author       sanjix
// @match        https://www.grundos.cafe/games/tyranuevavu/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475552/GC%20Tyranu%20Evavu%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/475552/GC%20Tyranu%20Evavu%20Keyboard%20Controls.meta.js
// ==/UserScript==

var tyranu = document.querySelector("form input[value='higher']");
var evavu = document.querySelector("form input[value='lower']");
var restart = document.querySelector("input[value='Play Again']");
var newGame = document.querySelector("form input[value='Play Now!']");
	document.addEventListener("keydown", ((event) => {
        if (event.keyCode == 84) //t
        {
            tyranu.click();
        }
        if (event.keyCode == 69) //e
        {
            evavu.click();
        }
        if (event.keyCode == 82) //r
        {
            if (restart === null) {
                newGame.click();
            } else {
            restart.click();
            }
        }
	}));