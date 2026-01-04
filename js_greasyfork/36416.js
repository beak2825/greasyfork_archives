// ==UserScript==
// @name         Re-direct to main game website (IOGames.space) - Updated for 2025
// @version      2.2.0
// @description  Re-directs games from iogames.space to their main website.
// @author       TigerYT
// @match        *://iogames.space/*
// @icon         https://iogames.space/images/app/favicon-48.png
// @grant        none
// @run-at       context-menu
// @namespace    https://greasyfork.org/users/137913
// @downloadURL https://update.greasyfork.org/scripts/36416/Re-direct%20to%20main%20game%20website%20%28IOGamesspace%29%20-%20Updated%20for%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/36416/Re-direct%20to%20main%20game%20website%20%28IOGamesspace%29%20-%20Updated%20for%202025.meta.js
// ==/UserScript==

document.querySelector(".GamePlayer__Overlay .GamePlayer__Overlay button")?.click();

const observer = new MutationObserver(() => {
  const button = document.querySelector(".GamePlayer__Overlay .GamePlayer__Overlay button");
  if (button) button.click();

  const objectElement = document.getElementsByTagName('object')[0];
  if (objectElement && objectElement.data) window.location.replace(objectElement.data);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});