// ==UserScript==
// @name           Bloquear Camera
// @description    Bloqueia o acesso de sites a camera do computador automaticamente.
// @namespace      CowanCAM
// @license        CowBas
// @version        1.0
// @author         Cowanbas
// @match          *://*/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/525353/Bloquear%20Camera.user.js
// @updateURL https://update.greasyfork.org/scripts/525353/Bloquear%20Camera.meta.js
// ==/UserScript==

(function () {
  'use strict';

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