// ==UserScript==
// @name         Zoso BOR Remover
// @namespace    http://tampermonkey.net/
// @version      0.666
// @description  This script removes anti-abortion propaganda by the Romanian Orthodox Church (BOR) for a propaganda-free browsing
// @author       Bogdan Constantinescu <bogdan@bogdanconstantinescu.com>
// @match        https://zoso.ro/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zoso.ro
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470597/Zoso%20BOR%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/470597/Zoso%20BOR%20Remover.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const thePosts = document.getElementsByClassName('listingpost');

  for(let i = 0; i < thePosts.length; i++) {
    const thePost = thePosts.item(i);
    const theAuthor = thePost?.querySelector("[itemprop=author]").getElementsByTagName('span')[0].innerHTML ?? undefined;
    if (theAuthor === 'Eftimie') {
      thePost?.remove();
    }
  }
})();