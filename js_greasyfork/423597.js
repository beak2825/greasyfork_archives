// ==UserScript==
// @name        PTP Personal Encode Icons
// @description Replaces checked torrent icon with encoder icon for personal rips 
// @author      pyrophobia
// @version     0.2
// @match       https://passthepopcorn.me/torrents*
// @grant       none
// @namespace   https://greasyfork.org/users/749254
// @downloadURL https://update.greasyfork.org/scripts/423597/PTP%20Personal%20Encode%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/423597/PTP%20Personal%20Encode%20Icons.meta.js
// ==/UserScript==

const torrents = document.getElementsByClassName("group_torrent_header");
let i = 0;
for (; i < torrents.length; i++) {
  const torrent = document.getElementById("torrent_" + torrents[i].id.split("header_")[1]);
  if (torrent.getElementsByClassName("torrent_quick_edit_ignore")[0].innerHTML.indexOf("Ripped") != -1) {
    switch (torrents[i].querySelectorAll("img")[0].src) {
      case "https://passthepopcorn.me/static/common/check.png":
        torrents[i].querySelectorAll("img")[0].setAttribute("src", "https://ptpimg.me/yv8o54.png");
        break;
      case "https://passthepopcorn.me/static/common/quality.gif":
        torrents[i].querySelectorAll("img")[0].setAttribute("src", "https://ptpimg.me/wscv2u.png");
        break;
      default:
    }
    torrents[i].querySelectorAll("img")[0].setAttribute("title", "Personally ripped torrent");
  }
}