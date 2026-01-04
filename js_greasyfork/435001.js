// ==UserScript==
// @name        Auto-close tabs
// @namespace   kandelabr
// @match       https://*/*
// @grant       window.close
// @version     1.1
// @author      -
// @description Closes tabs automatically - set waste_of_bits below to hostnames you do not want to visit
// @downloadURL https://update.greasyfork.org/scripts/435001/Auto-close%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/435001/Auto-close%20tabs.meta.js
// ==/UserScript==


let waste_of_bits = ['whatever_hosnames']

re = new RegExp(waste_of_bits.join('|'), "i");
if (re.test(document.location.host)) {
  window.close();
}