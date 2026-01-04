// ==UserScript==
// @name           Bloqueador de localização
// @description    Bloqueia o acesso de sites a sua localização automaticamente
// @namespace      CowanLOCALIZAÇÃO 
// @license        CowBas
// @version        1.0
// @author         Cowanbas
// @match          *://*/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/525189/Bloqueador%20de%20localiza%C3%A7%C3%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/525189/Bloqueador%20de%20localiza%C3%A7%C3%A3o.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Sobrescreve a função getCurrentPosition
  navigator.geolocation.getCurrentPosition = function (success, error, options) {
    if (error) {
      error({
        code: 1, // PERMISÃO NEGADA
        message: "localização Negada."
      });
    }
  };

  // Sobrescreve a função watchPosition
  navigator.geolocation.watchPosition = function (success, error, options) {
    if (error) {
      error({
        code: 1, // PERMISÃO NEGADA
        message: "localização Negada."
      });
    }
  };

})();