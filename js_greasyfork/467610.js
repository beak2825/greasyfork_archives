// ==UserScript==
// @name           Check hCaptcha and click the button
// @name:pt-BR     Verificar hCaptcha e clicar no botão
// @namespace      https://seu-website.com
// @version        1.0
// @description    Checks if the hCaptcha has been resolved and click the button
// @description:pt-BR    Verifica se o hCaptcha foi resolvido e clica no botão
// @match          http*://freebitco.in/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=freebitco.in
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/467610/Check%20hCaptcha%20and%20click%20the%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/467610/Check%20hCaptcha%20and%20click%20the%20button.meta.js
// ==/UserScript==

(function() {
  function verificarhCaptcha() {
    if (typeof window.hcaptcha !== 'undefined') {
      if (window.hcaptcha.getResponse().length > 0) {
        var botao = document.getElementById('free_play_form_button');
        if (botao) {
          botao.click();
        }
      } else {
        setTimeout(verificarhCaptcha, 1000);
      }
    }
  }
  window.addEventListener('load', verificarhCaptcha);
})();

