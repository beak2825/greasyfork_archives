// ==UserScript==
// @name         Ps4Trainer JSON Downloader
// @namespace    https://greasyfork.org/es/scripts/466743
// @version      2.1
// @description  Descarga y gestiona archivos JSON desde ps4trainer.com con buscador, filtros, historial y carga optimizada.
// @author       Moebius
// @icon         http://ps4trainer.com/Trainer/favicon.png
// @match        http://ps4trainer.com/Trainer/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466743/Ps4Trainer%20JSON%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/466743/Ps4Trainer%20JSON%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const links = {};
  let showOnlyNew = false;
  let searchText = '';

  const isEnglish = navigator.language.startsWith('en');

  // Elementos UI
  const listContainer = document.createElement('div');
  const toggleButton = document.createElement('button');
  const downloadAllButton = document.createElement('button');
  const clearButton = document.createElement('button');
  const searchInput = document.createElement('input');
  const switchInput = document.createElement('input');
  const switchLabel = document.createElement('label');
  const switchContainer = document.createElement('div');

  function createUI() {
    listContainer.style.cssText = 'display: none; position: fixed; top: 30px; right: 10px; width: 300px; max-height: 500px; overflow-y: auto; background-color: #333; color: #fff; padding: 10px; border-radius: 5px; z-index: 999;';
    document.body.appendChild(listContainer);

    toggleButton.textContent = label('JSON Files');
    toggleButton.style.cssText = 'position: fixed; top: 0; right: 0; padding: 5px; font-size: 16px; background-color: #333; color: #fff; border: none; cursor: pointer; border-radius: 5px;';
    document.body.appendChild(toggleButton);

    downloadAllButton.style.cssText = 'margin-top: 5px; padding: 5px; font-size: 16px; background-color: #377dff; color: #fff; border: none; border-radius: 5px; cursor: pointer;';
    listContainer.appendChild(downloadAllButton);

    clearButton.textContent = label('Clear history');
    clearButton.style.cssText = 'margin-top: 5px; padding: 5px; background-color: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;';
    listContainer.appendChild(clearButton);

    switchContainer.classList.add('switch-container');
    switchInput.type = 'checkbox';
    switchInput.id = 'switch';
    switchLabel.setAttribute('for', 'switch');
    switchLabel.classList.add('lbl');
    switchContainer.appendChild(switchInput);
    switchContainer.appendChild(switchLabel);
    listContainer.appendChild(switchContainer);

    searchInput.type = 'text';
    searchInput.placeholder = label('Search');
    searchInput.classList.add('search-input');
    searchInput.style.cssText = 'color: #fff; background-color: #333; border: none; padding: 5px; width: 100%; margin-top: 5px;';
    listContainer.appendChild(searchInput);

    toggleButton.onclick = () => listContainer.style.display = listContainer.style.display === 'none' ? 'block' : 'none';

    downloadAllButton.onclick = (e) => {
      e.preventDefault();
      listContainer.querySelectorAll('a').forEach(link => {
        if (!link.hasAttribute('data-downloaded') || !showOnlyNew) downloadFile(link);
      });
    };

    clearButton.onclick = () => {
      Object.keys(localStorage).forEach(k => localStorage.removeItem(k));
      location.reload();
    };

    switchInput.onchange = () => {
      showOnlyNew = switchInput.checked;
      filterList();
      updateDownloadAllButtonText();
    };

    searchInput.oninput = (e) => {
      searchText = e.target.value.toLowerCase();
      filterList();
    };

    addStyles();
  }

  function label(text) {
    const map = {
      'JSON Files': 'Archivos JSON',
      'Download All': '⮟ Descargar Todo',
      'Download New Only': '⮟ Solo Nuevos',
      'Clear history': '🗑 Limpiar historial',
      'Search': '🔎 Buscar'
    };
    return isEnglish ? text : map[text] || text;
  }

 function addDownloadLink(source, gameName) {
  const fileName = source.split('/').pop();
  const isDownloaded = localStorage.getItem(fileName) === 'true';
  const cusaCode = fileName.match(/CUSA\d+/)?.[0];

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display: flex; align-items: center; gap: 5px; margin-bottom: 5px;';

  const img = document.createElement('img');
  img.src = `img/${cusaCode}.jpg`;
  img.width = 30;
  img.height = 30;
  img.style.objectFit = 'cover';
  img.onerror = () => { img.src = 'img/error.png'; };


  img.alt = gameName;
  img.title = gameName;

  const link = document.createElement('a');
  link.href = source;
  link.download = fileName;
  link.textContent = fileName + (isDownloaded ? ' ✓ OK' : '');
  link.style.cssText = 'text-decoration: none; color: inherit;';
  link.classList.add(isDownloaded ? 'downloaded' : 'new');
  if (isDownloaded) link.setAttribute('data-downloaded', 'true');

  link.addEventListener('click', e => {
    e.preventDefault();
    downloadFile(link);
  });

  wrapper.appendChild(img);
  wrapper.appendChild(link);
  listContainer.appendChild(wrapper);
}

  function downloadFile(linkElement) {
    const fileName = linkElement.download;
    fetch(linkElement.href)
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        linkElement.setAttribute('data-downloaded', 'true');
        linkElement.classList.add('downloaded');
        linkElement.classList.remove('new');
        if (!linkElement.textContent.includes('✓ OK')) linkElement.textContent += ' ✓ OK';
        localStorage.setItem(fileName, 'true');
        filterList();
        updateCounter();
      });
  }

  function updateCounter() {
    toggleButton.textContent = `${label('JSON Files')}: ${Object.keys(links).length} (${countDownloaded()} ✓ OK)`;
  }

  function updateDownloadAllButtonText() {
    downloadAllButton.textContent = showOnlyNew ? label('Download New Only') : label('Download All');
  }

  function countDownloaded() {
    return Object.keys(links).filter(src => localStorage.getItem(src.split('/').pop()) === 'true').length;
  }

 function filterList() {
  const linkWrappers = listContainer.querySelectorAll('div');
  linkWrappers.forEach(wrapper => {
    const link = wrapper.querySelector('a');
    if (!link) return;

    const matchSearch = link.textContent.toLowerCase().includes(searchText);
    const isNew = link.classList.contains('new');
    const show = (!showOnlyNew || isNew) && matchSearch;

    wrapper.style.display = show ? 'flex' : 'none';
  });
}

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .lbl {
        display: inline-block;
        width: 48px;
        height: 16px;
        background: #979797;
        border-radius: 16px;
        cursor: pointer;
        position: relative;
        transition: .2s;
        padding: 0;
        line-height: 16px;
        font-size: 12px;
        color: #fff;
        transform: scale(0.75);
        margin-top: 5px;
      }
      .lbl::after {
        content: '';
        display: block;
        width: 12px;
        height: 12px;
        background: #eee;
        border-radius: 100%;
        position: absolute;
        top: 2px;
        left: 2px;
        transition: .2s;
      }
      #switch:checked + .lbl {
        background: #09cc85;
      }
      #switch:checked + .lbl::after {
        left: calc(100% - 2px);
        transform: translateX(-100%);
      }
      .new { color: #6ab8ff; }
      .downloaded { color: #ccc; }
    `;
    document.head.appendChild(style);
  }

  function updateLinkList() {
  const trainerCards = document.querySelectorAll('div.trainer-card');
  trainerCards.forEach(card => {
    const src = card.getAttribute('source');
    if (src && !links[src]) {
      links[src] = true;

      const gameNameEl = card.querySelector('.game-name');
      const gameName = gameNameEl ? gameNameEl.textContent.trim() : 'Sin nombre';

      addDownloadLink(src, gameName);
      updateCounter();
    }
  });
  filterList();
  updateDownloadAllButtonText();
}

  function observeDOMChanges() {
    const target = document.querySelector('.row.trainers-list') || document.body;
    let timeout = null;
    const observer = new MutationObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => updateLinkList(), 300); // debounce
    });
    observer.observe(target, { childList: true, subtree: true });
  }

  // Inicialización
  createUI();
  updateLinkList();
  observeDOMChanges();
})();
