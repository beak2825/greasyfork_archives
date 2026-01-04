// ==UserScript==
// @name        Udemy Affiliation link removal
// @namespace   userscript@htnguyen.fr
// @description Udemy link fixed
// @include     https://www.udemy.com/*/?couponCode=*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30316/Udemy%20Affiliation%20link%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/30316/Udemy%20Affiliation%20link%20removal.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
let currentURL = window.location.href;
console.log("Udemy link detected: ", currentURL);
if (currentURL.substring(currentURL.indexOf("couponCode=")).includes("?")) {
  let replaceURL = currentURL.match(/(.+couponCode=[^?]+)(?:\?)/)[1];
  console.log("? detected, replaced by: ", replaceURL);
  window.location.replace(replaceURL);
}