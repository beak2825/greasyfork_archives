// ==UserScript==
// @name         Pétition AN, auto-actualisation
// @description  Actualise au bout de 5 seconde – Licence = WTFPL
// @match        https://petitions.assemblee-nationale.fr/initiatives/i-*
// @namespace    https://petitions.assemblee-nationale.fr
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @version      0.1
// @license      CC0 / WTFPL
// @downloadURL https://update.greasyfork.org/scripts/424176/P%C3%A9tition%20AN%2C%20auto-actualisation.user.js
// @updateURL https://update.greasyfork.org/scripts/424176/P%C3%A9tition%20AN%2C%20auto-actualisation.meta.js
// ==/UserScript==

// Fonction anonyme directement dans setInterval
setInterval(function () {
  $.ajax({
      url: window.location, //Requête Ajax sur même URL
      success: //Appel en cas de succès de la requête Ajax
          function(retour){
          let parser = new DOMParser();
          let html_retour = parser.parseFromString(retour, 'text/html'); //On parse le retour de la requête Ajax en HTML

          ancien = $('.progress__bar__number')[0].innerHTML; // Ancienne valeure du compteur
          nouveau = html_retour.getElementsByClassName("progress__bar__number")[0].innerHTML; // Nouvelle valeure du compteur
          console.log("actualisation : de " + ancien + " à " + nouveau + " / 100 000"); // On log dans la console -> Pas forcément utile
          $('.progress__bar__number')[0].innerHTML = nouveau; // On met la nouvelle valeure du compteur à la place de l’ancienne
      } //Fin de la fonction appelé par "success"
    }) //Fin de la requête Ajax
}, 5000); // Fin de la fonction à intervale ; Intervale de 5000ms => 5s