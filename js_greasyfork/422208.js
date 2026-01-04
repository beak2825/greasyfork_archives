// ==UserScript==
// @name         quora original answers only
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  quora default original answers only
// @author       ClaoDD
// @match        https://www.quora.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422208/quora%20original%20answers%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/422208/quora%20original%20answers%20only.meta.js
// ==/UserScript==

function clickLinks() {
  const links = Array.from(document.querySelectorAll('.qu-ellipsis, .qu-tapHighlight--white, .qu-dynamicFontSize--small'));

  // Clicca su "Recommended" inizialmente
  const recommendedLink = links.find(link => link.textContent === 'Recommended');
  if (recommendedLink) {
    recommendedLink.click();
  }

  // Dopo 1 secondo, clicca su "Recent"
  setTimeout(() => {
    const links2 = Array.from(document.querySelectorAll('.qu-ellipsis, .qu-tapHighlight--white, .qu-dynamicFontSize--small'));
    const recentLink = links2.find(link => link.textContent === 'Recent');
    if (recentLink) {
      recentLink.click();
    }
  }, 1650);
}

// Chiamare la funzione clickLinks all'avvio della pagina
clickLinks();