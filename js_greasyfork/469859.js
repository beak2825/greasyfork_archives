// ==UserScript==
// @name         Add th hover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Esse script adiciona um background no hover dos itens do taskweb
// @author       Pedro Barbiero <pedro.barbiero@db1.com.br>
// @match        https://taskweb.db1group.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=db1group.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469859/Add%20th%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/469859/Add%20th%20hover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const extraSheet = new CSSStyleSheet();
    const rule = `
tr:hover {
  background-color: lightgray !important;
 }
    `.trim();

    extraSheet.insertRule(rule);

    document.adoptedStyleSheets.push(extraSheet);
})();