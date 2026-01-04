// ==UserScript==
// @name         Paginação Numérica Completa Baixar Bluray (movies e series)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Paginação com << < 1 2 3 ... > >> e controle dinâmico no baixar-bluray.org para movies e series
// @author       Você
// @license      MIT
// @match        https://baixar-bluray.net/movie/*
// @match        https://baixar-bluray.net/serie/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537858/Pagina%C3%A7%C3%A3o%20Num%C3%A9rica%20Completa%20Baixar%20Bluray%20%28movies%20e%20series%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537858/Pagina%C3%A7%C3%A3o%20Num%C3%A9rica%20Completa%20Baixar%20Bluray%20%28movies%20e%20series%29.meta.js
// ==/UserScript==

let currentType = 'movies';

(function() {
  'use strict';

  // Tenta extrair automaticamente o _wpsearch do HTML
  function extrairNonce() {
    const html = document.documentElement.innerHTML;
    const match = html.match(/_wpsearch["']\s*:\s*["']([^"']+)["']/);
    if (match) {
      return match[1];
    } else {
      console.warn("Não foi possível extrair _wpsearch!");
      return null;
    }
  }

  // Usa toronites (se estiver disponível) ou fallback para regex
  let nonce = window.toronites?.nonce || extrairNonce();
  const containerSelector = '.post-lst';
  let paginationContainer;
  let currentPage = 1;
  let hasNext = true;
  const maxButtons = 7; // Quantidade máxima de botões numéricos visíveis

  // Remove botão "Carregar mais"
  function removeLoadMore() {
    const btn = document.querySelector('p[data-loadmore]');
    if (btn) btn.remove();
  }

  // Cria a estrutura da paginação (botões)
  function criarPaginacao() {
    if (paginationContainer) {
      paginationContainer.remove();
    }

    paginationContainer = document.createElement('div');
    paginationContainer.style.margin = '20px 0';
    paginationContainer.style.textAlign = 'center';
    paginationContainer.style.userSelect = 'none';

    atualizarBotoesPaginacao();

    const container = document.querySelector(containerSelector);
    if (container) {
      container.parentNode.insertBefore(paginationContainer, container.nextSibling);
    }
  }

  // Atualiza os botões da paginação de acordo com currentPage e hasNext
  function atualizarBotoesPaginacao() {
    paginationContainer.innerHTML = '';

    // Botão << (primeira página)
    const btnFirst = criarBotao('<<', currentPage > 1, () => carregarPagina(1));
    paginationContainer.appendChild(btnFirst);

    // Botão < (página anterior)
    const btnPrev = criarBotao('<', currentPage > 1, () => carregarPagina(currentPage - 1));
    paginationContainer.appendChild(btnPrev);

    // Botões numéricos - mostramos no máximo maxButtons botões próximos da página atual
    const half = Math.floor(maxButtons / 2);
    let startPage = Math.max(1, currentPage - half);
    let endPage = startPage + maxButtons - 1;

    if (!hasNext) {
      endPage = currentPage;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const isAtiva = (i === currentPage);
      const btnNum = criarBotao(i, !isAtiva, () => carregarPagina(i));
      if (isAtiva) {
        btnNum.style.fontWeight = 'bold';
        btnNum.style.textDecoration = 'underline';
        btnNum.disabled = true;
      }
      paginationContainer.appendChild(btnNum);
    }

    // Botão > (próxima página)
    const btnNext = criarBotao('>', hasNext, () => carregarPagina(currentPage + 1));
    paginationContainer.appendChild(btnNext);

    // Botão >> (última página) - desabilitado porque não sabemos total de páginas
    const btnLast = criarBotao('>>', false, () => {});
    btnLast.title = 'Última página desconhecida';
    btnLast.style.opacity = '0.5';
    btnLast.disabled = true;
    paginationContainer.appendChild(btnLast);
  }

  // Cria um botão com texto, habilitado/desabilitado e callback
  function criarBotao(texto, habilitado, callback) {
    const btn = document.createElement('button');
    btn.textContent = texto;
    btn.style.margin = '0 4px';
    btn.style.padding = '4px 9px';
    btn.style.cursor = habilitado ? 'pointer' : 'default';
    btn.disabled = !habilitado;
    if (habilitado) {
      btn.addEventListener('click', callback);
    }
    return btn;
  }

async function carregarPagina(page = 1, updateURL = true) {
  const url = 'https://baixar-bluray.net/wp-admin/admin-ajax.php';

  const vars = {
    _wpsearch: nonce,
    taxonomy: "none",
    search: "none",
    term: "none",
    type: currentType, // isso será 'movies' ou 'series' dependendo da URL
    genres: [],
    years: [],
    sort: "1",
    page: page,
    posts_per_page: 30
  };

  const formData = new FormData();
  formData.append('action', 'action_search');
  formData.append('vars', JSON.stringify(vars));

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (!data.html) throw new Error('Resposta não contém html!');

    const container = document.querySelector(containerSelector);
    if (container) {
      container.innerHTML = data.html;
    } else {
      console.error('Container .post-lst não encontrado!');
    }

    currentPage = page;
    hasNext = !!data.next;
    atualizarBotoesPaginacao();

    if (updateURL) {
      const url = new URL(window.location);
      url.searchParams.set("page", page);
      window.history.pushState({}, '', url);
    }

    container.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (e) {
    console.error('Erro ao carregar página:', e);
  }
}


function init() {
  removeLoadMore();
  criarPaginacao();

  // Detecta tipo com base na URL
  const isSeries = window.location.pathname.includes('/serie/');
  currentType = isSeries ? 'series' : 'movies';

  // Lê ?page= da URL
  const params = new URLSearchParams(window.location.search);
  const paginaInicial = parseInt(params.get('page')) || 1;

  carregarPagina(paginaInicial, false);
}

  window.addEventListener('load', init);

})();
