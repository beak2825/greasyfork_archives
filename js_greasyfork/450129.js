// ==UserScript==
// @name        Leboncoin liste de recherches
// @namespace   leboncoin-ameliorations
// @match     https://www.leboncoin.fr/mes-recherches
// @version     1.2
// @license MIT
// @grant       none
// @description réorganise la liste des recherches sauvegardées en plaçant les recherches incluant de nouveaux résultats en top de liste
// @downloadURL https://update.greasyfork.org/scripts/450129/Leboncoin%20liste%20de%20recherches.user.js
// @updateURL https://update.greasyfork.org/scripts/450129/Leboncoin%20liste%20de%20recherches.meta.js
// ==/UserScript==


let handler;
handler = (e) => {
  if (null != document.querySelector('[class*="InlineNotificationsToggler"]')) {
    // document.querySelector('#mainContent').removeEventListener('DOMNodeInserted', handler);
    var startOffset = -1;
    document.querySelectorAll('[class*=styles_count]').forEach((elt, index) => {
      const ordered = elt.closest('div[style]');
      ordered.setAttribute('style', `order: ${startOffset--}`);
    });
  }
};
  
document.querySelector('#mainContent').addEventListener('DOMNodeInserted', handler, false);
window.addEventListener('popstate', handler, false);