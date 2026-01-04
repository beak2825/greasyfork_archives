// ==UserScript==
// @name         Soundpad MyInstant Importer
// @namespace    http://tampermonkey.net/
// @version      2025-06-17
// @description  Adiciona botão para abrir som no Soundpad a partir de MyInstants
// @author       Miguel
// @match        https://www.myinstants.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myinstants.com
// @grant        none
// @License      MIT
// @downloadURL https://update.greasyfork.org/scripts/539798/Soundpad%20MyInstant%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/539798/Soundpad%20MyInstant%20Importer.meta.js
// ==/UserScript==

(function () {
  function createSoundpadButton(mp3Url) {
    if (document.getElementById("soundpad-launcher")) return;

    const container = document.querySelector("#instant-page-extra-buttons-container");
    if (!container) {
      console.warn("Div de botões não encontrada.");
      return;
    }

    // Garante que não há barras duplicadas
    const baseUrl = window.location.origin.replace(/\/$/, '');
    const path = mp3Url.startsWith('/') ? mp3Url : '/' + mp3Url;
    const fullMp3Url = baseUrl + path;

    const soundpadUrl = `soundpad://sound/url/${fullMp3Url}`;

    const btn = document.createElement("a");
    btn.id = "soundpad-launcher";
    btn.className = "instant-page-extra-button btn btn-primary";
    btn.href = soundpadUrl;
    btn.style.marginLeft = "5px";
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    btn.innerHTML = `
      <img src="/media/images/icons/save.svg" width="20" height="20" class="instant-page-extra-button-icon" alt="Soundpad icon">
      Abrir no Soundpad
    `;

    container.appendChild(btn);
    console.log("✅ Botão 'Abrir no Soundpad' adicionado:", soundpadUrl);
  }

  function findDownloadLinkAndInsert() {
    const mp3Link = document.querySelector('#instant-page-extra-buttons-container a[download][href$=".mp3"]');
    if (mp3Link) {
      const mp3Url = mp3Link.getAttribute("href");
      console.log("🎵 MP3 encontrado:", mp3Url);
      createSoundpadButton(mp3Url);
      return true;
    }
    return false;
  }

  // Tentativa inicial e depois com observador para alterações dinâmicas
  if (!findDownloadLinkAndInsert()) {
    const observer = new MutationObserver(() => {
      if (findDownloadLinkAndInsert()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
