// ==UserScript==
// @name         TikTok Video Downloader
// @namespace    https://greasyfork.org/pt-BR/users/305931-emerson-bardusco
// @version      0.1
// @description  vídeos diretamente do tiktok sem logo e marca d'água com apenas um clique. Mais recursos em breve (B E T A)
// @author       Emerson bardusco
// @match        https://www.tiktok.com/@*
// @license       MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506511/TikTok%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/506511/TikTok%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let contagemK = 0;

  // Função para criar o botão de download
  function createDownloadButton() {
    // Criação do elemento <a>
    var linkElement = document.createElement('a');
    linkElement.setAttribute('href', '#');
    linkElement.setAttribute('class', 'linkTok');
    linkElement.setAttribute('target', '_blank');

    // Criação do elemento <button>
    var buttonElement = document.createElement('button');
    buttonElement.setAttribute('data-e2e', 'arrow-right');
    buttonElement.setAttribute('title', 'download magic');
    buttonElement.setAttribute('role', 'button');
    buttonElement.setAttribute('aria-label', 'Download Limpo');
    buttonElement.setAttribute('class', 'tiktokDL');

    // Criação do elemento <svg>
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('width', '26');
    svgElement.setAttribute('height', '26');
    svgElement.setAttribute('viewBox', '0 0 48 48');
    svgElement.setAttribute('fill', '#fff');
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('style', '--darkreader-inline-fill: #d7d5d1;');

    // Criação do elemento <path> dentro do <svg>
    var pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', 'M21.9 7.38v19.86l-6.73-6.73a.87.87 0 0 0-1.24 0l-1.73 1.73a.88.88 0 0 0 0 1.24l11.18 11.18c.34.35.9.35 1.24 0L35.8 23.48a.88.88 0 0 0 0-1.24l-1.73-1.73a.87.87 0 0 0-1.24 0l-6.73 6.73V7.38c0-.49-.4-.88-.87-.88h-2.45c-.49 0-.88.4-.88.88ZM10.88 37.13c-.49 0-.88.39-.88.87v2.63c0 .48.4.87.88.87h26.24c.49 0 .88-.4.88-.87V38c0-.48-.4-.87-.87-.87H10.86Z');

    svgElement.appendChild(pathElement);
    buttonElement.appendChild(svgElement);
    linkElement.appendChild(buttonElement);

    return linkElement;
  }

  // Função para adicionar o botão de download à página
  function addDownloadButton(videoUrl) {
    const button = createDownloadButton();
    const videoContainer = document.querySelector(".css-1s9jpf8-ButtonBasicButtonContainer-StyledVideoSwitch.e11s2kul11") || document.querySelector(".css-ty9aj4-DivVideoContainer.eqrezik7");
    videoContainer.insertAdjacentElement('afterend', button);
    button.addEventListener("click", () => {
      // Processo de download
      GM_setValue("statusVideo", true);
      setTimeout(() => {
        window.close();
      }, 1800);
    });
  }

  // Função para verificar se a página é uma página de vídeo do TikTok
  function isTikTokVideoPage() {
    return document.querySelector(".css-1s9jpf8-ButtonBasicButtonContainer-StyledVideoSwitch.e11s2kul11") !== null || document.querySelector(".css-ty9aj4-DivVideoContainer.eqrezik7") !== null;
  }

  // Função para monitorar alterações no último segmento da URL
  function monitorUrlChanges() {
    const currentUrl = window.location.pathname;
    const lastSegment = currentUrl.split("/").pop();
    if (lastSegment !== GM_getValue("lastSegment")) {
      GM_setValue("lastSegment", lastSegment);
      updateDownloadButton();
    }
  }

  // Função para atualizar o botão de download
  function updateDownloadButton() {
    const videoUrl = document.querySelector('video').src;
    if (videoUrl) {
      addDownloadButton(videoUrl);
    } else {
      console.error("Erro: vídeo não encontrado");
    }
  }

  // Inicialização do script
  if (isTikTokVideoPage()) {
    updateDownloadButton();
    window.addEventListener("hashchange", monitorUrlChanges);
  }
})();