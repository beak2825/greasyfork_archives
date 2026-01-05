// ==UserScript==
// @name        Voat Archive
// @description Mirror links on archive.is for Voat submission links
// @namespace   https://voat.co/user/InsistentCooperative
// @match       *://*.voat.co/*
// @version     1.1
// @grant       none
// @license     MIT
// @license     WTFPL
// @license     Public Domain
// @downloadURL https://update.greasyfork.org/scripts/21094/Voat%20Archive.user.js
// @updateURL https://update.greasyfork.org/scripts/21094/Voat%20Archive.meta.js
// ==/UserScript==

for (let hold of document.querySelectorAll('.submission:not(.self) a.title[href]:not([href*="://archive.is/"]) ~ .domain')) {
  let orig = hold.parentNode.querySelector('a.title');
  let href = 'https://archive.is/?run=1&url=' + encodeURIComponent(orig.href); // from their bookmarklet
  hold.innerHTML += ' <span class="_gm_voat_archive">[<a href="' + href + '" class="_gm_voat_archive">archive</a>]</span>';
}
