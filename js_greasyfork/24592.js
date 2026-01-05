// ==UserScript==
// @name         AUR System
// @namespace    aur
// @version      0.1.0
// @description  AnimeUltima enRadiant Enhancement System
// @author       AU Programming Team
// @contributor  Mike32 (b-fuze) & TDN (Samu)
// @homepage     http://www.animeultima.io/forums/f118/welcome-au-programming-section-51711/
// @run-at       document-start
// @include      /^https?://([a-z\d]+\.)?animeultima.io(/+(?:index.php|login|register|search.html[^]*|watch-(?:live-action-)?anime(?:-movies)?|watch/+[^]+-english-subbed-dubbed-online(?:/+favorites)?|[^]+-episode-[\d\.]+(?:-[\d\.]+)?(?:-(?:english-[sd]ubbed|raw)(?:-video-mirror-\d+-[^]+)?)?)(?:/+)?|/+)?(\?[^#]*)?(#[^]*)?$/
// @grant        GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_download
// @connect auengine.com
// @connect mp4upload.com
// @connect videonest.net
// @downloadURL https://update.greasyfork.org/scripts/24592/AUR%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/24592/AUR%20System.meta.js
// ==/UserScript==

const AUR = "Awesomeness";

if (AUR in window) {
  alert("You're in good hands buddy.");
} else {
  initLongAndTediousInstallCycle();
}