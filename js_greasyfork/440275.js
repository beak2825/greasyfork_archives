// ==UserScript==
// @name         Add Wordle to NYT Games
// @namespace    https://www.nytimes.com/games/wordle
// @version      0.1
// @description  Add Wordle to the homepage of nyt games
// @author       You
// @match        https://www.nytimes.com/crosswords
// @icon         https://www.nytimes.com/games/wordle/images/NYT-Wordle-Icon-32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440275/Add%20Wordle%20to%20NYT%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/440275/Add%20Wordle%20to%20NYT%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("hub-our-games__content")[0].insertAdjacentHTML("beforeend",`<a class="hub-game-card wordle" href="/games/wordle"><div role="button" tabindex="0" class="js-hub-tracker" data-track-hub="Wordle" data-track-hub-context="wordle"><div class="hub-game-card__cover" style="background-color: #6AAA64;"><div class="hub-game-card__illustration" style="background-image: url('https://www.nytimes.com/games/wordle/images/NYT-Wordle-Icon-32.png')"></div><h4 class="hub-game-card__name">Wordle</h4></div><div class="hub-game-card__content"><p class="hub-game-card__description">Guess a five-letter word in six tries.</p><div class="hub-game-card__button">Play</div></div></div></a>`)
})();