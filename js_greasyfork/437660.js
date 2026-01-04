// ==UserScript==
// @name        RED: hide non-freeload
// @namespace   userscript1
// @match       https://redacted.sh/*
// @grant       none
// @version     0.1.3
// @description hide non-freeload torrents
// @downloadURL https://update.greasyfork.org/scripts/437660/RED%3A%20hide%20non-freeload.user.js
// @updateURL https://update.greasyfork.org/scripts/437660/RED%3A%20hide%20non-freeload.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // change to true to show only 16bit FLAC Freeload:
  const lossless_16bit_only = false;




  document.querySelectorAll('tr.torrent_row, tr.group_torrent').forEach(a => chk(a));

  function chk(a) {
    if (a.querySelector(".edition_info")) return;

    if (lossless_16bit_only) {
       if (a.textContent.includes("/ Freeload!") && a.textContent.includes("FLAC / Lossless")) {
         return;
       }
    } else {
      if (a.textContent.includes("/ Freeload!")) {
          return;
      }
    }

    a.parentNode.removeChild(a);
  }

})();