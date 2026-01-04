// ==UserScript==
// @name        RED: dim non-freeload
// @namespace   userscript1
// @match       https://redacted.sh/*
// @grant       none
// @version     0.1.2
// @description dim non-freeload torrents
// @downloadURL https://update.greasyfork.org/scripts/437665/RED%3A%20dim%20non-freeload.user.js
// @updateURL https://update.greasyfork.org/scripts/437665/RED%3A%20dim%20non-freeload.meta.js
// ==/UserScript==

(function() {

  'use strict';

  document.querySelectorAll('tr.torrent_row, tr.group_torrent').forEach(a => chk(a));

  function chk(a) {
    if (a.querySelector(".edition_info")) return;
    
    //if (a.textContent.includes("/ Freeload!") && a.textContent.includes("FLAC / Lossless")) {
    if (a.textContent.includes("/ Freeload!")) {
        return;
    }
    
    a.style.opacity = 0.5;
  }
  
})();