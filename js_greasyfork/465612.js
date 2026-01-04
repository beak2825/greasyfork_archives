// ==UserScript==
// @name         Brainly Plus Brazil
// @version      1.3
// @description  Desbloqueie perguntas e respostas do Brainly. Full
// @author       Emersonxd
// @license      MIT
// @match        *://*brainly.com.br/*
// @namespace    https://greasyfork.org/pt-BR/users/305931-emerson-bardusco
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/465612/Brainly%20Plus%20Brazil.user.js
// @updateURL https://update.greasyfork.org/scripts/465612/Brainly%20Plus%20Brazil.meta.js
// ==/UserScript==

GM.addStyle(`
  .brn-expanded-bottom-banner,
  .brn-brainly-plus-box,
  .brn-fullscreen-toplayer {
    display: none;
  }
`);

(function() {
  'use strict';

  function hideElements() {
    const elements = [
      document.getElementsByClassName("brn-expanded-bottom-banner")[0],
      document.getElementsByClassName("brn-brainly-plus-box")[0],
      document.getElementsByClassName("brn-fullscreen-toplayer")[0]
    ];

    elements.forEach(element => {
      if (element) {
        element.style.display = "none";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    hideElements();
  });
})();