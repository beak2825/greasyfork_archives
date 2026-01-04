// ==UserScript==
// @name         Pelando Modo Escuro
// @version      0.1.1
// @description  try to take over the world!
// @author       lucassilvas1
// @match        https://www.pelando.com.br/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/846945
// @downloadURL https://update.greasyfork.org/scripts/437918/Pelando%20Modo%20Escuro.user.js
// @updateURL https://update.greasyfork.org/scripts/437918/Pelando%20Modo%20Escuro.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const body = document.body;
  body.dataset.theme = "DARK";

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (body.dataset.theme != "DARK") {
        body.dataset.theme = "DARK";
        //observer.disconnect();
      }
    });
  });

  observer.observe(body, { attributeFilter: ["data-theme"] });
})();
