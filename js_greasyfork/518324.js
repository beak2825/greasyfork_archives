// ==UserScript==
// @name         GGn Stickied Torrent Hider
// @namespace    https://greasyfork.org/users/1130260
// @version      1.0.1
// @description  Hides stickied torrents
// @author       Gazellion
// @match        https://gazellegames.net/torrents.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518324/GGn%20Stickied%20Torrent%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/518324/GGn%20Stickied%20Torrent%20Hider.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var stickiedTorrents = document.querySelectorAll('tr[class$="sticky"]');
  for (const stickiedTorrent of stickiedTorrents) {
      stickiedTorrent.classList.add("hidden");
  }
})();