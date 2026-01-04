// ==UserScript==
// @name         Animepahe next/prev buttons on player
// @namespace    https://jinpark.net/
// @version      0.3.5
// @description  Adds next and prev buttons on the player on animepahe
// @author       Jin Park
// @match        https://animepahe.com/play/*
// @match        https://animepahe.org/play/*
// @match        https://animepahe.ru/play/*
// @icon         https://www.google.com/s2/favicons?domain=animepahe.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427045/Animepahe%20nextprev%20buttons%20on%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/427045/Animepahe%20nextprev%20buttons%20on%20player.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function() {
    'use strict';
const next = document.querySelector("[aria-labelledby='episodeMenu']").getElementsByClassName('active')[0].nextElementSibling;
const prev = document.querySelector("[aria-labelledby='episodeMenu']").getElementsByClassName('active')[0].previousElementSibling;

let nextButtonStr = `<button class="next-button" id="next-button" style="position: absolute;top: 50%;right: 2%;z-index: 9999999999;color: white;border: 0;padding: 0;background-color: transparent;"><i class="arrow right"></i></button>`;
let prevButtonStr = `<button class="prev-button" id="prev-button" style="position: absolute;top: 50%;left: 2%;z-index: 99999999999;color: white;border: 0;padding: 0;background-color: transparent;"><i class="arrow left"></i></button>`;

let buttonStyleStr = `<style>
.player:not(:hover) > .next-button, .player:not(:hover) > .prev-button {
    opacity: 0;
    transition: 1s;
}
.player:hover > .next-button, .player:hover > .prev-button {
    opacity: 1;
    transition: 1s;
}
.arrow {
    border: solid white;
    border-width: 0 8px 8px 0;
    display: inline-block;
    padding: 8px;
    opacity: 0.5;
  }
  
  .arrow:hover {
      opacity: 0.8;
  }
  .right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  
  .left {
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
  }
</style>`

const player = document.getElementsByClassName('player')[0]

const parser = new DOMParser();
const nextButton = parser.parseFromString(nextButtonStr, 'text/html').getElementsByTagName('button')[0];
const prevButton = parser.parseFromString(prevButtonStr, 'text/html').getElementsByTagName('button')[0];
const buttonStyle = parser.parseFromString(buttonStyleStr, 'text/html').getElementsByTagName('style')[0];

if (next) {
    player.appendChild(nextButton);
    document.getElementById("next-button").onclick = function () {
        location.href = next.href;
    };
}

if (prev) {
    player.appendChild(prevButton);
    document.getElementById("prev-button").onclick = function () {
        location.href = prev.href;
    };
}

document.body.appendChild(buttonStyle)
})();