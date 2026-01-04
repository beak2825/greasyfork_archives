// ==UserScript==
// @name:en     Article unlocker
// @name     Odomknutie článku
// @namespace   Violentmonkey Scripts
// @match       https://www.hlavnespravy.sk/*
// @grant       none
// @version     1.0
// @author      Pysta
// @description Odomkne článok po načítaní stránky
// @description:en Unlocks article after loading page
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467464/Odomknutie%20%C4%8Dl%C3%A1nku.user.js
// @updateURL https://update.greasyfork.org/scripts/467464/Odomknutie%20%C4%8Dl%C3%A1nku.meta.js
// ==/UserScript==
window.addEventListener("load", (event) => {
  unlockArticle();
});
