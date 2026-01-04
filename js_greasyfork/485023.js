// @require https://code.jquery.com/jquery-3.6.4.min.js
// ==UserScript==
// @name        Modify Values
// @namespace   greasyfork.org
// @version     0.1
// @description Change specific values to 300
// @author      You
// @match       https://põe.com/*  // Substitua com o URL do seu site
// @icon        data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/485023/Modify%20Values.user.js
// @updateURL https://update.greasyfork.org/scripts/485023/Modify%20Values.meta.js
// ==/UserScript==

$(document).ready(function() {
  // Substitua com o seletor correto para o primeiro elemento alvo
  var targetElement1 = $("div#__next > div:nth-child(1) > div > main > div > div > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(9) > div > div > div:nth-child(1) > div:nth-child(2)");

  // Substitua com o seletor correto para o segundo elemento alvo
  var targetElement2 = $("div#__next > div:nth-child(1) > div > main > div > div > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(9) > div > div > div:nth-child(2) > div:nth-child(2)");

  // Substitua com os seletores corretos para os elementos de valor dentro dos elementos alvo
  var valueElement1 = targetElement1.find(".SettingsSubscriptionSection_subtitle__3fnw4");
  var valueElement2 = targetElement2.find(".SettingsSubscriptionSection_subtext__cZuI6");

  // Função para modificar os valores
  function modifyValues() {
    valueElement1.text("300");  // Define o valor desejado para o primeiro elemento
    valueElement2.text("300");  // Define o valor desejado para o segundo elemento
  }

  // Executa a função a cada 5 segundos
  setInterval(modifyValues, 5000);
});

