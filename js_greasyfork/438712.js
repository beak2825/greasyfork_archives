// ==UserScript==
// @name         RARBG Porn Remover
// @version      1.0
// @description  Permanently removes pornography torrents for those of you who would rather not see it.
// @author       Adam J Frost
// @license      MIT
// @include      /(https?:)?\/\/(www\.)?(proxy|unblocked)?rarbg((2018|2019|2020|2021)?|access(ed)?|cdn|core|data|enter|get|go|index|mirror(ed)?|p2p|prox(ied|ies|y)|prx|to(r|rrents)?|unblock(ed)?|way|web)\.(to|com|org|is)\/((index\d{2}|torrents)\.php.*|torrent|catalog\/.*|s\/.*|tv\/.*|top10)/
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/662702
// @downloadURL https://update.greasyfork.org/scripts/438712/RARBG%20Porn%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/438712/RARBG%20Porn%20Remover.meta.js
// ==/UserScript==

// Removes the xxx (18+) tag from search dropdown box.
let pornSearchTag = document.querySelector('[href="/torrents.php?category[]=4"]');
if (pornSearchTag) {
	pornSearchTag.parentElement.remove();
}

// Removes all porn elements from the search results.
let pornElements = document.querySelectorAll('[href="/torrents.php?category=4"]');
for (let i = 0; i < pornElements.length; i++) {
	let allPornElements = pornElements[i];
  
  if (pornElements) {
    allPornElements.parentElement.parentElement.remove();
    console.log(pornElements.length + " Porn Torrents Found! Removing...");
  }
}