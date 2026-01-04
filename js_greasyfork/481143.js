// ==UserScript==
// @name        open in new tab
// @namespace   Violentmonkey Scripts
// @match       https://e-hentai.org/*
// @match       https://exhentai.org/*
// @grant       none
// @version     1.2
// @author      UglyOldLazyBastard
// @license     WTFPL http://www.wtfpl.net/faq/
// @description This Script makes all EH Galleries mangas open in a new tab

// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2

// @downloadURL https://update.greasyfork.org/scripts/481143/open%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/481143/open%20in%20new%20tab.meta.js
// ==/UserScript==
const elementList1 = document.querySelectorAll('.gl3t a');
const elementList2 = document.querySelectorAll('.gl1t > a');

// Function to add target="_blank" attribute
function addTargetBlank(node) {
  node.setAttribute('target', '_blank');
}

// Apply the function to elements in the first NodeList
elementList1.forEach(addTargetBlank);

// Apply the function to elements in the second NodeList
elementList2.forEach(addTargetBlank);