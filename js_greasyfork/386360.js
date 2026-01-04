// ==UserScript==
// @name     Blocker for Autosurf
// @description Prevents autosurf websites from opening websites specified (by you) in blocklist
// @license MIT
// @version  1
// @include  *
// @grant    GM_setValue
// @namespace https://greasyfork.org/users/310316
// @downloadURL https://update.greasyfork.org/scripts/386360/Blocker%20for%20Autosurf.user.js
// @updateURL https://update.greasyfork.org/scripts/386360/Blocker%20for%20Autosurf.meta.js
// ==/UserScript==

blocklist = ["tadbirmail.ir", "qodsna.com", "eheyat.com", "www.mersadnews.ir", "sbnews.ir", "fater24.com", "eheyat.com", "salehintehran.ir", "www.mazandrooz.ir", "qodsna.com", "sorooshekhabar.ir", "ofoghetaze.com", "sorooshnews.com", "uromnews.ir", "www.sorooshekhabar.ir", "q27.ir", "goftarname.ir", "shabestan.ir", "tadbiretazenews.com", "usfacts.ir"];

for (var i = 0; i < blocklist.length; i++) {
  if (document.body.textContent.indexOf(blocklist[i]) != -1) {
    unsafeWindow.open = function () {
      return null;
    };
    console.log("********blocked***********");
  }

}
