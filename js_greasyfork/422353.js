// ==UserScript==
// @name         Facebook - All "See more" buttons expanded
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Facebook - All the "See more" buttons expanded on scroll - support english, italian 'Altro...', español 'Ver más', français 'Afficher la suite', deutsch 'Mehr ansehen'
// @author       ClaoDD
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422353/Facebook%20-%20All%20%22See%20more%22%20buttons%20expanded.user.js
// @updateURL https://update.greasyfork.org/scripts/422353/Facebook%20-%20All%20%22See%20more%22%20buttons%20expanded.meta.js
// ==/UserScript==

(window.onscroll = function(){
const links = Array.from(document.querySelectorAll('.oajrlxb2'));
links.forEach((link) => {
  if (link.textContent === 'Altro...' || link.textContent === 'See more' || link.textContent === 'Ver más' || link.textContent === 'Afficher la suite' || link.textContent === 'Mehr ansehen')  {
    link.click();
  }
})
                             })();