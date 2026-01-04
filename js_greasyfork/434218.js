// ==UserScript==
// @name        RED: show notification caught bys
// @namespace   userscript1
// @match       https://redacted.sh/torrents.php*
// @grant       none
// @version     0.1.9
// @description see the caught by artist(s) on notifications without hovering.
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/434218/RED%3A%20show%20notification%20caught%20bys.user.js
// @updateURL https://update.greasyfork.org/scripts/434218/RED%3A%20show%20notification%20caught%20bys.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (!window.location.search.includes('action=notify')) { return; }

  const insertPosition = 'afterbegin';

  for (let tr of document.querySelectorAll('tr.torrent_row.tooltip')) {
    let str    = tr.title.replace('Caught by filter for', '');
    let artist = tr.querySelector('a[href*="artist.php"')?.textContent;

    if (!artist || !str.toLowerCase().includes(artist.toLowerCase()) ) {
      tr.querySelector('.group_info').insertAdjacentHTML(insertPosition, `<div>${str}</div>`);
    }
  }

})();
