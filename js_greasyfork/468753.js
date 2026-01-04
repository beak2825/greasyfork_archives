// ==UserScript==
// @name         Geoguessr | text with trembling and rainbow effect
// @description  Im The Best
// @version      1.0
// @grant        none
// @match        https://www.geoguessr.com/*
// @license      MIT
// @namespace    https://greasyfork.org/it/users/1100610-pugliah
// @downloadURL https://update.greasyfork.org/scripts/468753/Geoguessr%20%7C%20text%20with%20trembling%20and%20rainbow%20effect.user.js
// @updateURL https://update.greasyfork.org/scripts/468753/Geoguessr%20%7C%20text%20with%20trembling%20and%20rainbow%20effect.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Seleziona gli elementi dei pulsanti
  var buttons = document.querySelectorAll('.game-menu-button_button__WPwVi');

  // Funzione per generare un numero casuale tra min e max
  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Funzione per aggiornare la posizione di un pulsante in modo casuale
  function shakeButton(button) {
    var xPos = getRandomNumber(-2, 2) + 'px';
    var yPos = getRandomNumber(-2, 2) + 'px';
    button.style.transform = 'translate(' + xPos + ', ' + yPos + ')';
  }

  // Funzione per generare un colore casuale dell'arcobaleno
  function getRandomRainbowColor() {
    var hue = Math.floor(Math.random() * 360);
    return 'hsl(' + hue + ', 100%, 50%)';
  }

  // Funzione per animare il colore dell'elemento
  function animateRainbowColor(element) {
    var hue = 0;
    var saturation = 100;
    var lightness = 50;
    setInterval(function() {
      hue = (hue + 1) % 360;
      var color = 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)';
      element.style.color = color;
    }, 10); // Regola la velocità dell'animazione cambiando il valore 10
  }

  // Funzione per avviare l'effetto di tremolio e colore arcobaleno per ogni pulsante
  function startShaking() {
    buttons.forEach(function(button) {
      shakeButton(button);
      animateRainbowColor(button);
      setInterval(function() {
        shakeButton(button);
      }, 100); // Regola la velocità del tremolio cambiando il valore 100
    });
  }

  // Avvia l'effetto di tremolio e colore arcobaleno quando la pagina è completamente caricata
  window.addEventListener('load', startShaking);
})();
