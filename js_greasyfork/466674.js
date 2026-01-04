// ==UserScript==
// @name        RED: edition full row clickable
// @namespace   userscript1
// @match       https://redacted.sh/torrents.php
// @match       https://redacted.sh/artist.php
// @match       https://redacted.sh/collage.php
// @match       https://redacted.sh/collages.php
// @grant       none
// @version     0.1.6
// @author      -
// @description collapse/expand by clicking anywhere in the ediiton information row.
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/466674/RED%3A%20edition%20full%20row%20clickable.user.js
// @updateURL https://update.greasyfork.org/scripts/466674/RED%3A%20edition%20full%20row%20clickable.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.querySelectorAll('td.edition_info').forEach(elm => {
      elm.style.cursor = 'pointer';
      elm.addEventListener('click', editionClickHandler);
    });

  function editionClickHandler(evt) {
    if (evt.target.nodeName == 'A') { return; } // ignore click on existing expand/collapse link

    let new_event = new MouseEvent('click', {
      bubbles: false,
      cancelable: true,
      view: window,
      ctrlKey: evt.ctrlKey,
      metaKey: evt.metaKey,
    });

    this.querySelector('a.tooltip').dispatchEvent(new_event);
  }

})();