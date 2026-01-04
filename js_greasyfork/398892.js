// ==UserScript==

// @name                TorrentGalaxy - Filter 1080p Releases in IMDb Search
// @description         Keeps only the 1080p releases on the TorrentGalaxy IMDb search page.
// @version             1.0

// @namespace           io.github.ni554n
// @match               http*://torrentgalaxy.*/torrents.php?*search=tt*
// @match               http*://tgx.*/torrents.php?*search=tt*

// @supportURL          https://github.com/ni554n/userscripts/issues
// @license             MIT

// @author              Nissan Ahmed
// @homepageURL         https://anissan.com
// @contributionURL     https://paypal.me/ni554n

// @downloadURL https://update.greasyfork.org/scripts/470768/TorrentGalaxy%20-%20Filter%201080p%20Releases%20in%20IMDb%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/470768/TorrentGalaxy%20-%20Filter%201080p%20Releases%20in%20IMDb%20Search.meta.js
// ==/UserScript==

const releaseTableRows = document.getElementsByClassName("tgxtablerow");

for (const row of releaseTableRows) {
  const releaseName = row.innerText.toLowerCase();

  if (!releaseName.includes("1080p")) {
    row.style.display = "none";
  }
}
