// ==UserScript==
// @name Auto allow HTTPS sites
// @description Allow HTTPS sites automatically.
// @match *://*/*
// @namespace https://greasyfork.org/users/135360
// @version 0.0.1.20210503043630
// @downloadURL https://update.greasyfork.org/scripts/390199/Auto%20allow%20HTTPS%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/390199/Auto%20allow%20HTTPS%20sites.meta.js
// ==/UserScript==
document.querySelectorAll("a").forEach(el => {
  if (el.getAttribute("href").includes("accepted-")) {
    el.click();
  }
});