// ==UserScript==
// @name           Privacidade e Bloqueio de Câmera
// @description    Bloqueia o acesso de sites a sua localização, microfone e câmera automaticamente.
// @namespace      CowanPRIV
// @license        CowBas
// @version        1.0
// @author         Cowanbas
// @match          *://*/*
// @exclude        
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/525583/Privacidade%20e%20Bloqueio%20de%20C%C3%A2mera.user.js
// @updateURL https://update.greasyfork.org/scripts/525583/Privacidade%20e%20Bloqueio%20de%20C%C3%A2mera.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Script de Privacidade

  // Sobrescreve a função getCurrentPosition
  navigator.geolocation.getCurrentPosition = function (success, error, options) {
    if (error) {
      error({
        code: 1, // PERMISSÃO NEGADA
        message: "Localização Negada."
      });
    }
  };

  // Sobrescreve a função watchPosition
  navigator.geolocation.watchPosition = function (success, error, options) {
    if (error) {
      error({
        code: 1, // PERMISSÃO NEGADA
        message: "Localização Negada."
      });
    }
  };

  // Salva a função original para permitir acesso a outras mídias (como vídeo) se necessário
  navigator.mediaDevices.originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

  // Sobrescreve a função getUserMedia para bloquear o acesso ao microfone
  navigator.mediaDevices.getUserMedia = function (constraints) {
    return new Promise((resolve, reject) => {
      if (constraints && constraints.audio) {
        reject(new Error("Acesso ao microfone negado."));
      } else {
        // Se o pedido não for para usar o microfone, permite o acesso
        navigator.mediaDevices.originalGetUserMedia(constraints).then(resolve).catch(reject);
      }
    });
  };

  // Script de Bloqueio de Câmera

  // Sobrescreve a função navigator.mediaDevices.getUserMedia para bloquear o acesso à câmera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function (constraints) {
      if (constraints && constraints.video) {
        return Promise.reject(new Error('Acesso à câmera bloqueado.'));
      }
      return originalGetUserMedia(constraints);
    };
  }
})();