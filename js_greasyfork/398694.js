// ==UserScript==
// @name           Révèle-Téléphone sur LeBonCoin
// @namespace      https://openuserjs.org/users/clemente
// @match          https://www.leboncoin.fr/*
// @grant          none
// @version        1.2
// @author         clemente
// @license        MIT
// @description    Affiche le numéro de téléphone lié à une annonce quand il est disponible
// @icon           https://static-rav.leboncoin.fr/favicon-apple-touch.png
// @inject-into    content
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/398694/R%C3%A9v%C3%A8le-T%C3%A9l%C3%A9phone%20sur%20LeBonCoin.user.js
// @updateURL https://update.greasyfork.org/scripts/398694/R%C3%A9v%C3%A8le-T%C3%A9l%C3%A9phone%20sur%20LeBonCoin.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const phoneButtons = document.querySelectorAll('button[title="voir le numéro"]');

if (phoneButtons) {
  const delay = Math.floor(2000 + Math.random() * 1000); // Random delay between 2 et 3 seconds
  setTimeout(() => phoneButtons.forEach(button => button.click()), delay);
}