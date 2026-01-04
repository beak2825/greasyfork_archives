// ==UserScript==
// @name        MAL mobile view cleaner - better view.
// @namespace   https://kyoya.ga/mal
// @match       https://myanimelist.net/*
// @grant       none
// @version     1.3
// @author      kyoyacchi
// @description Removes annoying/unnecessary elements in MAL (mobile) website.
// @icon        https://myanimelist.net/favicon.ico
// @license     gpl-3.0
// @run-at    document-start
// @downloadURL https://update.greasyfork.org/scripts/456080/MAL%20mobile%20view%20cleaner%20-%20better%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/456080/MAL%20mobile%20view%20cleaner%20-%20better%20view.meta.js
// ==/UserScript==
function hideAll() {

try {
let head = document.head || document.getElementsByTagName("head")[0]
let style = document.createElement("style");
style.type = "text/css";
style.innerHTML = `
.icon-footer-social {
display: none !important;
}

 div.recommended.pt4.mt16.footer-divider,
div.footer-divider:nth-of-type(3),
ul.cle.footer-menu,
.footer-divider {
  display: none !important;
}

a[href="https://policies.google.com/privacy"],
a[href="https://policies.google.com/terms"] {
  pointer-events: none !important;
  cursor: default !important;
  text-decoration: none !important;
  `;
  head.appendChild(style);
} catch(e) {
  console.error(e)
}
}

hideAll()