// ==UserScript==
// @name         Zero margin on all websites
// @description  Sets margin to 0 on all elements
// @match        *://*/*
// @version 0.0.1.20250611073010
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/539085/Zero%20margin%20on%20all%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/539085/Zero%20margin%20on%20all%20websites.meta.js
// ==/UserScript==

(function() {
  const style = document.createElement('style');
  style.textContent = `* {margin: 0 !important;}`;
  document.documentElement.appendChild(style);
})();