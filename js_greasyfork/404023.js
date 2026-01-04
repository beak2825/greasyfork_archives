// ==UserScript==
// @name         www.volksfreund.de: Anmelde-Wall entfernen
// @description  Entfernt das Overlay, was einen zwingen will sich anzumelden. Ermöglicht es die Artikel ohne Anmeldung zu lesen.
// @namespace    https://greasyfork.org/de/users/571550-finomosec
// @version      0.1
// @author       Finomosec
// @match        https://www.volksfreund.de/*
// @grant        none
// @locale       de
// @license      GPLv2
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/404023/wwwvolksfreundde%3A%20Anmelde-Wall%20entfernen.user.js
// @updateURL https://update.greasyfork.org/scripts/404023/wwwvolksfreundde%3A%20Anmelde-Wall%20entfernen.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.innerHTML = `
  .text, .text_ohne_einzug {
  color: black;
  }
  html, body {
  overflow: auto !important;
  }
  #osc-paywall-frame, #park-webtrekk-paywall-hook {
  display: none !important;
  }
`;
document.head.appendChild(style);
console.log('added style');
