// ==UserScript==
// @name         SBT+ Chapolin - EPs Removidos
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Adiciona aba de episódios removidos e carrega vídeos personalizados via API no SBT Vídeos.
// @author       Você
// @match        https://mais.sbt.com.br/serie/6363759535112*
// @match        https://mais.sbt.com.br/vod/6363765157112?t=0&removidos=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535601/SBT%2B%20Chapolin%20-%20EPs%20Removidos.user.js
// @updateURL https://update.greasyfork.org/scripts/535601/SBT%2B%20Chapolin%20-%20EPs%20Removidos.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const API_URL = atob("aHR0cHM6Ly9kYXRhbWluZXJici5naXRodWIuaW8vcmVtb3ZlZHNfc2J0L2NoYXBvbGluLmpzb24=");
  const url = new URL(window.location.href);
  const removidoId = url.searchParams.get("removidos");

  // --- Parte 1: Página de vídeo com parâmetro ?removidos= ---
  if (removidoId) {
    (async function initVideoPage() {
      try {
        const res = await fetch(API_URL + '?t=' + Date.now());
        const json = await res.json();

        const episodio = json.videos_rotativos.find(ep => ep.id === removidoId && ep.enabled === true);
        if (!episodio) {
          console.log("[TM] Episódio não encontrado ou desativado");
          return;
        }

        console.log("[TM] Episódio removido detectado:", episodio);

        await waitForElement(".ml-6 span");
        await waitForElement("video.vjs-tech");

        const titulo = document.querySelector(".ml-6 span");
        if (titulo) {
          titulo.textContent = episodio.name;
        }

        const video = document.querySelector("video.vjs-tech");
        if (video) {
          video.poster = episodio.cover || "";
          const quality = episodio.quality && episodio.quality.includes("1080P") ? "1080" : "720";
          const baseVideoURL = atob("aHR0cDovL3ZpZXcuc2J0Y2RuLndvcmtlcnMuZGV2LzA6Lw==");
          const videoUrl = `${baseVideoURL}${episodio.id}_${quality}.mp4`;
          video.src = videoUrl;
          video.load();
        }
      } catch (e) {
        console.error("[TM] Erro ao buscar/alterar episódio:", e);
      }
    })();

    function waitForElement(selector, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
          const el = document.querySelector(selector);
          if (el) {
            clearInterval(timer);
            resolve(el);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(timer);
          reject("Elemento não encontrado: " + selector);
        }, timeout);
      });
    }

    return; // Evita executar o restante do script na página de vídeo
  }

  // --- Parte 2: Página da série - aba "Episódios removidos" ---
  let episodiosRemovidos = [];

  async function carregarEpisodios() {
    try {
      const response = await fetch(API_URL + '?t=' + Date.now());
      const data = await response.json();
      episodiosRemovidos = data.videos_rotativos.filter(ep => ep.enabled);
    } catch (error) {
      console.error("Erro ao carregar episódios removidos:", error);
    }
  }

  function adicionarOpcaoNoDropdown(dropdown) {
    if (!dropdown || dropdown.querySelector('[data-id="episodios-removidos"]')) return;

    const novaOpcao = document.createElement('div');
    novaOpcao.className = "group hover:bg-bg-tertiary pl-4 pr-28 lg:pr-4 my-2 cursor-pointer";
    novaOpcao.setAttribute('data-id', 'episodios-removidos');
    novaOpcao.innerHTML = `
      <div class="font-sans select-none lg:font-normal lg:leading-[1.4rem] lg:text-body-medium font-medium leading-[1.4rem] text-mobile-body-medium text-accent-tertiary
           px-4 py-3 group-hover:text-accent-primary whitespace-nowrap">
        <span class="pointer-events-none">Episódios removidos</span>
      </div>
    `;

    novaOpcao.addEventListener('click', () => {
      exibirEpisodiosRemovidos();
      dropdown.style.display = 'none';
    });

    dropdown.appendChild(novaOpcao);
    console.log('✅ Aba "Episódios removidos" adicionada!');
  }

  async function exibirEpisodiosRemovidos() {
    if (episodiosRemovidos.length === 0) await carregarEpisodios();

    document.querySelectorAll('.flex.h-full.w-full.flex-col').forEach(el => el.style.display = 'none');

    const tituloElemento = Array.from(document.querySelectorAll('div.lg\\:text-title-small span'))
      .find(el => el.textContent.trim().includes('Episódios'));
    if (tituloElemento) tituloElemento.textContent = 'Episódios removidos';

    const contadorElemento = Array.from(document.querySelectorAll('div.lg\\:text-button span'))
      .find(el => el.textContent.trim().match(/^Episódios\s*\(\d+\)/));
    if (contadorElemento) contadorElemento.textContent = `Episódios (${episodiosRemovidos.length})`;

    let container = document.getElementById('episodios-removidos');
    if (container) {
      container.style.display = 'flex';
      return;
    }

    container = document.createElement('div');
    container.id = 'episodios-removidos';
    container.className = 'flex h-full w-full flex-col items-center gap-x-4 gap-y-8 text-accent-primary/80 lg:mb-16 p-4';

    episodiosRemovidos.forEach(ep => {
      const wrapper = document.createElement('div');
      wrapper.className = 'w-full';

      const card = document.createElement('div');
      card.className = 'w-full flex flex-col md:flex-row min-h-[140px] gap-4 max-w-[1200px]';

      const duracao = ep.time ? `${ep.time}min` : '';
      const expDate = ep.expire.replace(/-/g, '/');

      const cardLink = `https://mais.sbt.com.br/vod/6363765157112?t=0&removidos=${ep.id}`;

      card.innerHTML = `
        <a href="${cardLink}" class="relative rounded-xl w-[251px] lg:w-[325px] max-h-[140px] lg:max-h-[182px] h-full overflow-hidden h-auto flex-shrink-0 group cursor-pointer outline outline-4 outline-accent-primary/0 hover:outline-accent-primary">
          <div class="absolute p-4 w-[56px] h-[56px] m-auto left-0 right-0 top-0 bottom-0 hidden group-hover:flex text-accent-primary bg-bg-secondary flex flex-center rounded-full">
            <div class="h-6 w-6 m-auto select-none">
              <img alt="playBold" loading="lazy" width="24" height="24" decoding="async" class="w-full h-full" src="https://mais.sbt.com.br/assets/icons/play_bold.svg" />
            </div>
          </div>
          <img src="${ep.cover}" alt="${ep.name}" class="rounded-lg w-full h-full object-cover" />
          <div class="top-[5px] left-[6px] absolute bg-bg-secondary/[85%] rounded-[6px] h-[24px] w-fit">
            <div class="font-sans select-none font-medium text-sm text-accent-primary/[85%] py-0.5 px-2">${duracao}</div>
          </div>
        </a>
      `;

      const info = document.createElement('div');
      info.className = 'flex flex-col justify-between';
      info.innerHTML = `
        <div>
          <div class="text-lg font-bold text-accent-primary mb-1">${ep.name}</div>
          <div class="text-mobile-body-medium mb-2">Reviva e descubra os momentos mais icônicos de Chaves e sua turma, agora com conteúdo rotativo aqui.</div>
        </div>
        <div class="text-sm text-accent-primary bg-bg-tertiary rounded-lg w-fit px-2 py-[2px]">Disponível até dia: ${expDate}</div>
      `;

      const linha = document.createElement('div');
      linha.className = 'bg-bg-tertiary border-none h-[1px] w-full mt-8';

      card.appendChild(info);
      wrapper.appendChild(card);
      wrapper.appendChild(linha);
      container.appendChild(wrapper);
    });

    const destino = document.querySelector('main .flex.h-full.w-full.flex-col');
    if (destino && destino.parentNode) {
      destino.parentNode.appendChild(container);
    } else {
      document.body.appendChild(container);
    }
  }

  function restaurarConteudoOriginal() {
    document.querySelectorAll('main .flex.h-full.w-full.flex-col').forEach(el => el.style.display = '');
    const container = document.getElementById('episodios-removidos');
    if (container) container.style.display = 'none';
  }

  const observer = new MutationObserver(() => {
    const dropdown = document.querySelector('.bg-bg-secondary.absolute.rounded-lg.z-30');
    if (dropdown) adicionarOpcaoNoDropdown(dropdown);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('click', (e) => {
    const alvo = e.target.closest('.cursor-pointer');
    if (alvo && !alvo.hasAttribute('data-id')) {
      setTimeout(restaurarConteudoOriginal, 100);
    }
  });
})();
