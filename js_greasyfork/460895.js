// ==UserScript==
// @name         Facebook SEE MORE
// @namespace    http://tampermonkey.net/
// @version      0.30228
// @description  Facebook - All the "See more" buttons expanded on scroll - support english, italian 'Altro...', español 'Ver más', français 'Afficher la suite', deutsch 'Mehr ansehen'
// @author       ClaoDD
// @match        https://m.facebook.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460895/Facebook%20SEE%20MORE.user.js
// @updateURL https://update.greasyfork.org/scripts/460895/Facebook%20SEE%20MORE.meta.js
// ==/UserScript==

(window.onscroll = function(){
const links = Array.from(document.querySelectorAll('.story_body_container'));
links.forEach((link) => {
   let linkObj = $(link).find('span[data-sigil="more"]')
   let textContent = linkObj.text()
  if (textContent === 'More' || textContent === '展开' || textContent === 'Altro...' || textContent === 'See more' || textContent === 'Ver más' || textContent === 'Afficher la suite' || textContent === 'Mehr ansehen')  {
    //link.click();
    linkObj.trigger('click');
  }
})
                             })();