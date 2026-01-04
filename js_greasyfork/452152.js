// ==UserScript==
// @name        Light theme - html.it
// @namespace   Violentmonkey Scripts
// @match       https://www.html.it/*
// @grant       none
// @version     1.0
// @author      Luca Frigenti
// @description 27/9/2022, 15:52:47
// @license MIT
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/452152/Light%20theme%20-%20htmlit.user.js
// @updateURL https://update.greasyfork.org/scripts/452152/Light%20theme%20-%20htmlit.meta.js
// ==/UserScript==
const disconnect = VM.observe(document.body, () => {
  for (item of document.getElementsByTagName('p')) { item.style.color = "#000" }
  for (item of document.getElementsByTagName('h1')) { item.style.color = "#000" }
  for (item of document.getElementsByTagName('div')) { item.style.color = "#000" }
  document.getElementsByClassName('main-wrapper')[0].style.background = "#f3f3f3";
  document.getElementsByClassName('main-container')[0].style.background = "#f3f3f3";
  disconnect();
});