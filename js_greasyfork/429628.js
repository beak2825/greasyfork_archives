// ==UserScript==
// @name         Reaperscans Remove Annoyances
// @namespace    https://theusaf.org/
// @version      1.0.0
// @description  Adds keypresses and context menus again!
// @author       theusaf
// @icon         https://reaperscans.com/favicon.ico
// @match        https://*.reaperscans.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429628/Reaperscans%20Remove%20Annoyances.user.js
// @updateURL https://update.greasyfork.org/scripts/429628/Reaperscans%20Remove%20Annoyances.meta.js
// ==/UserScript==

function fix() {
  if(window.nocontext) {
    window.nocontext = () => {console.log("FUCK YOU REAPERSCANS!");};
    window.dealWithPrintScrKey = () => {console.log("FUCK YOU REAPERSCANS!");};
    document.oncontextmenu = null;
    document.onkeyup = null;
    window.jQuery(document).unbind();
  } else {
    setTimeout(fix, 1e3);
  }
}
fix();