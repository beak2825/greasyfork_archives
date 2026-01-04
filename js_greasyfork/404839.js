// ==UserScript==
// @name         Whatsapp Native Dark Theme
// @namespace    http://web.whatsapp.com/
// @version      1.00
// @description  Adds "dark" class to the Whatsapp Web document to enable its native dark theme
// @author       Jair Jaramillo
// @match        *://web.whatsapp.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/404839/Whatsapp%20Native%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/404839/Whatsapp%20Native%20Dark%20Theme.meta.js
// ==/UserScript==

window.addEventListener ("load", pageFullyLoaded);

function pageFullyLoaded () {
  document.getElementsByTagName("body")[0].classList.add('dark');
}