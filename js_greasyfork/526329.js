// ==UserScript==
// @name          Sem Som
// @description   Remove o som do sites que você quiser
// @namespace     CowanSOM
// @license       GPL-3.0
// @version       2.0
// @author        Cowanbas
// @match         (Coloque a URL do site desejado)
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/526329/Sem%20Som.user.js
// @updateURL https://update.greasyfork.org/scripts/526329/Sem%20Som.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Função para silenciar o áudio na guia atual
  function muteTab() {
    const videos = document.querySelectorAll('video');
    const audios = document.querySelectorAll('audio');

    videos.forEach(video => video.muted = true);
    audios.forEach(audio => audio.muted = true);
  }

  // Executa a função muteTab quando o script é carregado
  muteTab();

  // Opcionalmente, você também pode silenciar novos elementos de áudio adicionados ao DOM
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        muteTab();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();