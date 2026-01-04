// @ts-check
// ==UserScript==
// @name         Monospace All Sites
// @version      0.2
// @description  Monospace everything. Keep things simple.
// @match        *://*/*
// @grant        none
// @run-at       document-body
// @license      MIT
// @namespace    MEMIJE.IO
// @author       MEMIJE.IO
// @downloadURL https://update.greasyfork.org/scripts/463454/Monospace%20All%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/463454/Monospace%20All%20Sites.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.innerHTML = `
*:not([class*="icon"], [class*="symbol"] , i) {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace !important;
}
       `;
  document.getElementsByTagName('head')[0].appendChild(style);
})();
