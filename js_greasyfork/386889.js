// ==UserScript==
// @name         MYTF1: À la poubelle l'auto-pause!
// @version      0.1
// @description  Empêche le lecteur vidéo de MYTF1 de se mettre en pause dès qu'on quitte la fenêtre
// @include      https://*.tf1.fr/*
// @grant        none
// @license      MIT
//
// @namespace https://greasyfork.org/users/313541
// @downloadURL https://update.greasyfork.org/scripts/386889/MYTF1%3A%20%C3%80%20la%20poubelle%20l%27auto-pause%21.user.js
// @updateURL https://update.greasyfork.org/scripts/386889/MYTF1%3A%20%C3%80%20la%20poubelle%20l%27auto-pause%21.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const stopBlurEvent = function (event) {
    // console.info('TF1: Blur event propagation stopped \o/')
    event.stopPropagation();
  };
  window.addEventListener('blur', stopBlurEvent, true);
    setInterval(function() {
      try {
        window.removeEventListener('blur', stopBlurEvent, true);
      } catch (err) {
        // console.error(err);
      } finally {
        window.addEventListener('blur', stopBlurEvent, true);
      }
    }, 1000);
})();
