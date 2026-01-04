// ==UserScript==
// @name        Hide "A privacy reminder from Google"
// @description Hide "A privacy reminder from Google" in Google homepage footer and above search results.
// @include     https://*.google.*
// @version     2017.01.02
// @grant       none
// @namespace https://greasyfork.org/users/2969
// @downloadURL https://update.greasyfork.org/scripts/36955/Hide%20%22A%20privacy%20reminder%20from%20Google%22.user.js
// @updateURL https://update.greasyfork.org/scripts/36955/Hide%20%22A%20privacy%20reminder%20from%20Google%22.meta.js
// ==/UserScript==

let s = document.createElement('style')
s.textContent = `

  [jsaction^="dg_dismissed"] ~ * ,
  [jsaction^="dismiss_warmup"] {
    display: none !important;
  }

`;

document.head.appendChild(s);
