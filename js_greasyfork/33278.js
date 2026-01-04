// ==UserScript==
// @name         Block ads on bitcointalk.
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  bitcointalk.org is filled with scammy ads. free yourself from the noise.
// @author       itsnotlupus
// @match        https://bitcointalk.org/*
// @downloadURL https://update.greasyfork.org/scripts/33278/Block%20ads%20on%20bitcointalk.user.js
// @updateURL https://update.greasyfork.org/scripts/33278/Block%20ads%20on%20bitcointalk.meta.js
// ==/UserScript==

/*jshint esversion:6 */

// On this forum, users are allowed to advertise for whatever scam they want, in their signatures, profile pic and profile byline.
// This is in addition to any site-level ads.
// This script aims to remove all of it.

const junk = [
  // ad and shitty signatures
  "table>tbody>tr>td>table>tbody>tr>td>div:not([id]):not(.post):not(.subject):not(.personalmessage):not(.smalltext)[class]",
  // ad disclaimer
  "form>table>tbody>tr>td>span",
  // extraneous <hr> tags
  "td.smalltext hr"
];

// remove the junk
junk.forEach(line => document.querySelectorAll(line).forEach(t => t.remove()));

// scrub poster info too, since it's filled with ads too nowadays.
document.querySelectorAll(".poster_info>.smalltext>div").forEach(poster => {
  let m, n = poster.nextSibling;
  // crawl through nodes found under a poster profile pic
  do {
      m = n.nextSibling;
      // custom text under a profile pic? that's almost always an ad.
      if (n instanceof Text) n.remove();
      // custom link? yes, probably an ad.
      if (n.href && !n.href.startsWith("https://bitcointalk.org/")) n.remove();
  } while (n = m);
  // and of course, remove the profile pic, because it's almost certainly an ad.
  poster.remove();
});

// avoid a JS error caused by their broken anti-adblock code.
window.detectabp = () => false;

// why are you even using this terrible forum? nostalgia? masochism?