// ==UserScript==
// @name Automatically enter blocked sites
// @description Automatically enter blocked sites.
// @match *://*/*notify-Samsung*
// @match *://*/*notify-Notice_*
// @match *://*/*notify-Notice_*
// @version 0.0.1.20200204062933
// @namespace https://greasyfork.org/users/397149
// @downloadURL https://update.greasyfork.org/scripts/392296/Automatically%20enter%20blocked%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/392296/Automatically%20enter%20blocked%20sites.meta.js
// ==/UserScript==
document.querySelectorAll("a").forEach(el => {
  var href = el.getAttribute("href");
  if (href.includes("accepted-Samsung") || href.includes("accepted-Notice_")) {
    el.click();
  }
});