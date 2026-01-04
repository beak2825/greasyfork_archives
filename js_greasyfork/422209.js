// ==UserScript==
// @name         Quora expand all more buttons
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Quora more buttons automatically clicked on scroll or at pages opening
// @author       ClaoDD
// @match        https://www.quora.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422209/Quora%20expand%20all%20more%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/422209/Quora%20expand%20all%20more%20buttons.meta.js
// ==/UserScript==

(window.onscroll = function(){
const links = Array.from(document.querySelectorAll('.qu-fontFamily--sans'));
links.forEach((link) => {
  if (link.textContent === '(more)' || link.textContent.includes('view more')) {
    link.click();
  }
})
                             })();