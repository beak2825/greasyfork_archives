// ==UserScript==
// @name        Replace Fandom with Fextralife Wiki
// @namespace   Violentmonkey Scripts
// @match       https://eldenring.tclark.io/
// @grant       none
// @version     1.0
// @namespace   Catsnax3000
// @description Replaces the Fandom URLs with FextraLife URLs instead.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/501577/Replace%20Fandom%20with%20Fextralife%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/501577/Replace%20Fandom%20with%20Fextralife%20Wiki.meta.js
// ==/UserScript==

for (let a of document.getElementsByTagName('a')) {
  if(a.href.includes("eldenring.fandom.com")) {
    let newHref = a.href
      .replaceAll('eldenring.fandom.com/wiki', 'eldenring.wiki.fextralife.com')
      .replaceAll(' ', '+')
      .replaceAll('_', '+');
    a.href = newHref;
  }
}
