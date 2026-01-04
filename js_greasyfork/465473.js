// ==UserScript==
// @name         YouTube HD
// @namespace    youtubeHD
// @description  Automatically sets YouTube video resolution to highest available based on player size and network speed.
// @version      1.3
// @author       EmersonxD
// @grant        none
// @license      MIT
// @match        https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/465473/YouTube%20HD.user.js
// @updateURL https://update.greasyfork.org/scripts/465473/YouTube%20HD.meta.js
// ==/UserScript==

(function() {
  "use strict";

  // Define as resoluções disponíveis como constantes
  const RESOLUCOES_DISPONIVEIS = ["highres", "hd2880", "hd2160", "hd1440", "hd1080", "hd720", "large", "medium", "small", "tiny"];
  const TAMANHOS_RESOLUCOES = [4320, 2880, 2160, 1440, 1080, 720, 480, 360, 270, 270];

  // Define as variáveis globais como constantes
  const PLAYER_SIZE = "";
  let VIDEO_ID_ANTERIOR = 0;

  // Adiciona um estilo para mudar a cor de fundo da página
  const style = document.createElement("style");
  style.innerHTML = `
    body {
      background-color: #ff4d4d !important;
    }
  `;
  document.head.appendChild(style);

  // Define a função getVideoId para extrair o ID do vídeo de uma URL do YouTube
  function getVideoId(e) {
    const match = /(?:v=)([\w\-]+)/.exec(e.getVideoUrl());
    return match ? match[1] : "ERROR: idMatch failed; youtube changed something";
  }

  // Define a função setResolution para definir a resolução do vídeo
  function setResolution(player, resolucoesDisponiveis) {
    if (typeof player.getPlaybackQuality === "undefined") {
      return setTimeout(() => setResolution(player, resolucoesDisponiveis), 100);
    }

    const videoIdAtual = getVideoId(player);

    if (videoIdAtual !== VIDEO_ID_ANTERIOR) {
      VIDEO_ID_ANTERIOR = videoIdAtual;
      const resolucaoAtual = player.getPlaybackQuality();
      const indiceResolucaoAtual = resolucoesDisponiveis.indexOf(resolucaoAtual);
      const indiceResolucaoAtualDesejada = resolucoesDisponiveis.indexOf(RESOLUCAO_ATUAL);

      if (indiceResolucaoAtualDesejada >= indiceResolucaoAtual) {
        if (typeof player.setPlaybackQualityRange !== "undefined") {
          player.setPlaybackQualityRange(RESOLUCAO_ATUAL);
        }
        player.setPlaybackQuality(RESOLUCAO_ATUAL);
        return;
      }

      const indiceResolucaoAnterior = resolucoesDisponiveis.indexOf(RESOLUCAO_ATUAL);
      let indiceResolucaoNova = indiceResolucaoAtual;

      while (indiceResolucaoNova < resolucoesDisponiveis.length - 1 && resolucoesDisponiveis[indiceResolucaoNova] !== RESOLUCAO_ATUAL) {
        indiceResolucaoNova++;
      }

      if (videoIdAtual !== resolucoesDisponiveis[indiceResolucaoNova]) {
        const videoIdNovo = getVideoId(player);

        if (videoIdNovo !== "ERROR") {
          const tempoAtual = player.getCurrentTime();
          player.loadVideoById(videoIdNovo, tempoAtual, resolucoesDisponiveis[indiceResolucaoNova]);
        }
      }

      if (typeof player.setPlaybackQualityRange !== "undefined") {
        player.setPlaybackQualityRange(resolucoesDisponiveis[indiceResolucaoNova]);
      }
      player.setPlaybackQuality(resolucoesDisponiveis[indiceResolucaoNova]);
         if (typeof player.setPlaybackQualityRange !== "undefined") {
        player.setPlaybackQualityRange(resolucoesDisponiveis[indiceResolucaoNova]);
      }
      player.setPlaybackQuality(resolucoesDisponiveis[indiceResolucaoNova]);
    }

    const configuracaoSalva = localStorage.getItem("yt-player-quality");
    const configuracaoSalvaValida = configuracaoSalva && JSON.parse(configuracaoSalva).data === RESOLUCAO_ATUAL;

    if (!configuracaoSalvaValida) {
      localStorage.setItem("yt-player-quality", JSON.stringify({ data: RESOLUCAO_ATUAL }));
      console.log(`Stored Resolution: ${RESOLUCAO_ATUAL}`);
    }
  }

  // Define a função setTheaterMode para habilitar o modo teatro no reproductor de vídeo
  function setTheaterMode() {
    if (location.href.indexOf("/watch") === -1) {
      return;
    }

    const body = document.getElementsByTagName("body")[0];
    if (!body.classList.contains("watch-stage-mode")) {
      body.classList.add("watch-stage-mode");
    }

    const player = unwrapObject(document.getElementById("movie_player"));
    PLAYER_SIZE = player.style.width + "," + player.style.height;
    player.style.width = "100%";

    const botaoTheaterMode = document.createElement("button");
    botaoTheaterMode.className = "yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-tooltip";
    botaoTheaterMode.setAttribute("data-tooltip-text", "Modo Teatro");
    botaoTheaterMode.setAttribute("data-tooltip-timer", "1200");
    botaoTheaterMode.innerHTML = `
      <span class="yt-uix-button-icon-wrapper">
        <span class="yt-uix-button-icon yt-uix-button-icon-theater-mode yt-sprite"></span>
      </span>
    `;

    botaoTheaterMode.addEventListener("click", () => {
      const player = unwrapObject(document.getElementById("movie_player"));
      if (player.style.width === "100%") {
        player.style.width = PLAYER_SIZE;
      } else {
        player.style.width = "100%";
      }
    });

    const controlsDireita = document.getElementsByClassName("ytp-right-controls")[0];
    controlsDireita.appendChild(botaoTheaterMode);
  }

  // Define a função main para inicializar o script
  function main() {
    setTheaterMode();
    const player = unwrapObject(document.getElementById("movie_player"));
    setInterval(() => setResolution(player, RESOLUCOES_DISPONIVEIS), 1000);
  }

  // Chama a função main para inicializar o script
  main();
})();