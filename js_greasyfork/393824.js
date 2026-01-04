// ==UserScript==
// @name         BTN: The 2500 Bitsu Bleps Of Christmas
// @version      0.5
// @description  On the first day of Christmas, Katara gave to me...
// @author       mrpoot
// @match        https://broadcasthe.net/advent.php*
// @grant        none
// @namespace    https://greasyfork.org/users/148773
// @downloadURL https://update.greasyfork.org/scripts/393824/BTN%3A%20The%202500%20Bitsu%20Bleps%20Of%20Christmas.user.js
// @updateURL https://update.greasyfork.org/scripts/393824/BTN%3A%20The%202500%20Bitsu%20Bleps%20Of%20Christmas.meta.js
// ==/UserScript==

(() => {
  const blepify = (query) => {
    const el = document.querySelector(query);
    if (!el) return;
    el.innerText = el.innerText
      .replace(/(\d+) Bonus Points/g, '$1 Bitsu Bleps')
      .replace(/(\d+) BP/g, '$1 BB')
      .replace(/GB Upload(?: Credit)?/g, 'GB Upbleps');
  };

  [
    '#general+br+br+h2+br+br+h1',
    '#content li:nth-child(3)',
    '#content li:nth-child(4)',
    '#content li:last-child'
  ].forEach(blepify);
})();