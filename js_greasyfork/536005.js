// ==UserScript==
// @name         Force UI Sans-Serif & Clear Text
// @description  Override every element’s font and smoothing settings
// @match        *://*/*
// @run-at       document-start
// @version 0.0.1.20250719144959
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/536005/Force%20UI%20Sans-Serif%20%20Clear%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/536005/Force%20UI%20Sans-Serif%20%20Clear%20Text.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement('style');
  style.textContent = `
    *:not(i):not([class*="fa-"]):not([class*="icon-"]):not([class*="material-"]):not([class*="fa"]):not([class*="icon"]):not([class*="material"]):not([data-anchorjs-icon]):not(.katex):not(.katex *) {
      font-family: ui-rounded, ui-sans-serif, system-ui, sans-serif !important;
      text-rendering: optimizeLegibility !important;
/*opacity: 1 !important;*/
    -webkit-line-clamp: revert !important;
    }
  `;
  document.documentElement.prepend(style);
})();
