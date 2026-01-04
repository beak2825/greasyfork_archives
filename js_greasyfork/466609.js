// ==UserScript==
// @name        RED: collapse editions
// @namespace   userscript1
// @match       https://redacted.sh/torrents.php*id=*
// @grant       none
// @version     0.1.3
// @author      -
// @description Collapse editions on torrent pages.
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/466609/RED%3A%20collapse%20editions.user.js
// @updateURL https://update.greasyfork.org/scripts/466609/RED%3A%20collapse%20editions.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // only collapse if there's more than:
  const editionsAllowed = 1;

  // --- end configuration -- //


  // check we're on a torrent page
  if (!document.querySelector('div.box_albumart') )  { return; }

  const clickme = document.querySelectorAll('td.edition_info a.tooltip');
  if (clickme.length <= editionsAllowed) { return; }

  let evt = new MouseEvent('click', {
    bubbles: false,
    cancelable: true,
    view: window,
    ctrlKey: true,
  });
  
  clickme[0].dispatchEvent(evt);

})();