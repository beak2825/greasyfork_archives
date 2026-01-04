
// ==UserScript==
// @name       Cartas visíveis
// @version      0.3
// @description  Deixa as cartas visíveis no jogo de cartas
// @author       Bard
// @match        https://trucoxp.com/game
// @namespace https://greasyfork.org/users/1171795
// @downloadURL https://update.greasyfork.org/scripts/475473/Cartas%20vis%C3%ADveis.user.js
// @updateURL https://update.greasyfork.org/scripts/475473/Cartas%20vis%C3%ADveis.meta.js
// ==/UserScript==

(function() {
  // Seleciona o elemento que contém as cartas
  var cartas = document.querySelector("div#root > div:nth-child(2) > div > div:nth-child(1)");

  // Remove a classe "hidden" das cartas viradas para baixo
  cartas.querySelectorAll(".hand__card--flipped.hidden").forEach(function(carta) {
    carta.classList.remove("hidden");
  });
})();