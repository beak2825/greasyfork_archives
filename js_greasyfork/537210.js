// ==UserScript==
// @name         Bing Images CSS Modifier
// @description  Minimal script to change CSS on Bing Images
// @match        https://www.bing.com/images*
// @version 0.0.1.20250525133407
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/537210/Bing%20Images%20CSS%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/537210/Bing%20Images%20CSS%20Modifier.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement('style');
  style.textContent = `
* {
    min-width: unset !important;
    margin: unset !important;
    padding: unset !important;
    max-width: 290px !important;
}

ul {
    white-space: unset !important;
}

img {
    height: unset !important;
}
  `;
  document.head.appendChild(style);
})();
