// ==UserScript==
// @name             Sem Logs
// @description      Remove os logs do navegador
// @namespace        CowanLOGS
// @license          GPL-3.0
// @version          2.0
// @author           Cowanbas
// @match            *://*/*
// @run-at           document-start
// @downloadURL https://update.greasyfork.org/scripts/524453/Sem%20Logs.user.js
// @updateURL https://update.greasyfork.org/scripts/524453/Sem%20Logs.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const noop = function () { }; // Alterar as funções dos logs para "Noop"

  // Adiciona a função "Noop" No console
  console.log = noop;
  console.warn = noop;
  console.error = noop;
  console.info = noop;
  console.debug = noop;
  console.trace = noop;

  // Altera as propriedades do console com a função noop
  for (let method in console) {
    if (typeof console[method] === 'function') {
      console[method] = noop;
    }
  }

})();