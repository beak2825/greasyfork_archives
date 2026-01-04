// ==UserScript==
// @name        RED: better.php FLAC only
// @namespace   Violentmonkey Scripts
// @match       https://redacted.sh/better.php*
// @grant       none
// @version     0.1.2
// @author      -
// @description -
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/496680/RED%3A%20betterphp%20FLAC%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/496680/RED%3A%20betterphp%20FLAC%20only.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const run_on = ['tags', 'folders', 'files', 'custom'];

  const params = new URLSearchParams(location.search);
  if ( !run_on.includes(params.get('method')) ) {
    return;
  }

  document.querySelectorAll('.torrent_table tr').forEach(r => {
      if (!r.textContent.includes('FLAC') ) {
          r.style.display = 'none';
      }
  });


})();