// ==UserScript==
// @name         Wordle Autocomplete
// @namespace    https://spin.rip/
// @version      1.0
// @description  Complete the current Wordle with just the click of a button
// @author       Spinfal
// @match        https://www.nytimes.com/games/wordle/index.html
// @icon         https://www.google.com/s2/favicons?domain=nytimes.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442389/Wordle%20Autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/442389/Wordle%20Autocomplete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const img = document.createElement("img");
    img.src = "https://cdn.spin.rip/r/cheat.png";
    img.setAttribute("style", "filter: invert(100%); width: 1.48em; height: 1.48em; padding-left: 0.4em; cursor: pointer;");
    img.setAttribute("aria-label", "Run Cheat");

    window.onload = () => {
        const solution = JSON.parse(localStorage.getItem('nyt-wordle-state')).solution.split("");

        document.querySelector("body > game-app").shadowRoot.querySelector("game-theme-manager > header > div.menu-right").appendChild(img);

        document.querySelector("body > game-app").shadowRoot.querySelector("game-theme-manager > header > div.menu-right > img").addEventListener("click", () => {
            document.querySelector("body > game-app").shadowRoot.querySelector("game-theme-manager > header > div.title").innerText = " Wordle owo ";
            solution.forEach(letter => {
                clickKey(letter);
            });
        });
    }

    function clickKey(data) {
        document.querySelector("body > game-app").shadowRoot.querySelector("#game > game-keyboard").shadowRoot.querySelector("#keyboard").querySelector(`[data-key=${data}]`).click();
    }
})();