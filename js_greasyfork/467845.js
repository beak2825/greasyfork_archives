// ==UserScript==
// @name        Better torrentgalaxy.to torrent title
// @namespace   Violentmonkey Scripts
// @match       https://torrentgalaxy.to/torrents-details.php
// @match       https://torrentgalaxy.to/torrent/*/*
// @grant       none
// @version     1.1
// @author      -
// @description Remove the "TGx:" prefix from the torrent title and replace periods with spaces - 6/4/2023, 3:57:19 AM
// @downloadURL https://update.greasyfork.org/scripts/467845/Better%20torrentgalaxyto%20torrent%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/467845/Better%20torrentgalaxyto%20torrent%20title.meta.js
// ==/UserScript==

t = document.title; // e.g. "TGx:Foobar.2023.720p.AMZN.WEBRip.800MB.x264-GalaxyRG"

if(t.startsWith("TGx:")) {
  t2 = t.replace(/^TGx:/, '').replace(/\./g, ' ');
  document.title = t2;
}