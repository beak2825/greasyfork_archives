// ==UserScript==
// @name           Desativar Microfone
// @description    Desativa o acesso ao microfone aos sites.
// @namespace      CowanSEMVOZ
// @license        CowBas
// @version        1.0
// @author         Cowanbas
// @match          *://*/*
// @exclude        https://discord.com/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/525279/Desativar%20Microfone.user.js
// @updateURL https://update.greasyfork.org/scripts/525279/Desativar%20Microfone.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Sobrescreve a função getUserMedia
  navigator.mediaDevices.getUserMedia = function (constraints) {
    return new Promise((resolve, reject) => {
      if (constraints && constraints.audio) {
        reject(new Error("Acesso negado."));
      } else {
        // Se o pedido não for para o usar o microfone, permite o acesso
        navigator.mediaDevices.originalGetUserMedia(constraints).then(resolve).catch(reject);
      }
    });
  };

  // Salva a função original para permitir acesso a outras mídias (como vídeo) se necessário
  navigator.mediaDevices.originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
})();