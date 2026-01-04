// ==UserScript==
// @name         bloomberg css
// @description  a
// @match        https://*.bloomberg.com/*
// @version 0.0.1.20251108193556
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/543300/bloomberg%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/543300/bloomberg%20css.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement('style');
  style.textContent = `
a {
color: revert !important;
}

a[data-component="newsletter-card"] {
    display: none !important;
}

a[data-component="audio-video-card"] {
    display: none !important;
}

div[class*='SummaryOnlyTakeaways_takeaways'] {
display: none !important;
}
  `;
  document.head.appendChild(style);
})();