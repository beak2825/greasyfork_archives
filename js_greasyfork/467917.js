// ==UserScript==
// @name         Alterar atributo action do formulário
// @namespace    http://exemplo.com
// @version      1.0
// @description  Altera o valor do atributo action do formulário #tsf
// @match        https://oldgoogle.neocities.org/2011/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467917/Alterar%20atributo%20action%20do%20formul%C3%A1rio.user.js
// @updateURL https://update.greasyfork.org/scripts/467917/Alterar%20atributo%20action%20do%20formul%C3%A1rio.meta.js
// ==/UserScript==

(function() {
    'use strict';

  function changeAction() {
    const form = document.querySelector('#tsf');

     if (form) {
            // Altera o valor do atributo action para "/2013/search"
            form.action = '/2013/search';
            clearInterval(formF)
        }
  }

  const formF = setInterval(changeAction, 1000)
})();