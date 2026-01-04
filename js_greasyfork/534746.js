// ==UserScript==
// @name         Ukrywanie komentarzy (wyborcza.pl)
// @namespace    https://github.com/Mr-GatoX/WyborczaBlockedComments
// @version      1.0
// @description  Automatycznie ukrywa komentarze wskazanych uzytkownikow na wyborcza.pl
// @author       MrGato
// @license      GNU GPLv3
// @match        https://wyborcza.pl/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534746/Ukrywanie%20komentarzy%20%28wyborczapl%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534746/Ukrywanie%20komentarzy%20%28wyborczapl%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

  const blockedAuthors = [
    'SebixPro',
    'Tuńczyk',
    'otto'
  ];

  function hideBlockedComments() {
    document
      .querySelectorAll('div[itemtype="http://schema.org/Comment"]')
      .forEach(div => {
        const authorSpan = div.querySelector('span.cName[itemprop="name"]');
        if (authorSpan) {
          const name = authorSpan.textContent.trim();
          if (blockedAuthors.includes(name)) {
            div.style.display = 'none';
          }
        }
      });
  }

  document.addEventListener('DOMContentLoaded', hideBlockedComments);

  document
    .querySelector('a[data-action="loadAllComments"]')
    ?.addEventListener('click', () => {
      setTimeout(hideBlockedComments, 300);
    });

  const observer = new MutationObserver(hideBlockedComments);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();