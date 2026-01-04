// ==UserScript==
// @name         Gifs
// @namespace    http://shikimori.me/
// @version      1.0
// @description  Поиск GIF-изображений.
// @author       pirate~
// @match        *://shikimori.tld/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509587/Gifs.user.js
// @updateURL https://update.greasyfork.org/scripts/509587/Gifs.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const debounce = (fn, wait) => {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), wait);
    };
  };

  const style = document.createElement('style');
  style.textContent = `
      .all { position: relative; display: inline-block; }
      .pushme { position: relative; cursor: pointer; padding: 0 10px; }
      .new_block { z-index: 99; position: absolute; top: -310px; overflow-y: auto; padding: 5px; background: white; width: 400px; height: 300px; box-shadow: 0 0 2px #b9b9b9; }
      .new_block > .popular-img, .results-container { display: grid; grid-template-columns: repeat(7, 50px); justify-content: center; padding: 5px; gap: 5px; }
      .new_block img { cursor: pointer; width: 50px; height: 50px; object-fit: cover; }
      .new_block img:hover { opacity: 0.5; }
      .search-container { display: flex; align-items: center; }
      .search-container > .search-input { border: 1px solid lightgray; color: #605f5f; font-size: 13px; padding: 0.5em; height: 30px; }
      .search-container > .search-button { border: 1px solid lightgray; border-left: 0; color: #605f5f; font-size: 13px; height: 30px; cursor: pointer; padding: 0 5px; align-items: center; display: flex; }
      .search-container > .search-button:active, .new_block > .load_more:active { box-shadow: inset 0 0 4px lightgray; }
      .new_block > .load_more { border: 1px solid lightgray; padding: 5px; float: right; text-align: center; display: none; cursor: pointer; }
      .b-shiki_editor aside.buttons { overflow: inherit !important; }
  `;
  document.head.appendChild(style);

  function setupPopularImageEvent(img) {
    let lastClickTime = 0;
    const clickInterval = 300;
    img.addEventListener('click', function() {
      const now = Date.now();
      let count = Number(img.dataset.clickCount) || 0;
      if (now - lastClickTime < clickInterval) {
        count++;
      } else {
        count = 1;
      }
      img.dataset.clickCount = count;
      lastClickTime = now;
      if (count >= 3) {
        img.remove();
        savePopularImages();
        img.dataset.clickCount = 0;
        return;
      }
      document.querySelectorAll('.editor-area').forEach(ta => {
        const pos = ta.selectionStart;
        const tag = `[img no-zoom w=40]${img.src}[/img]`;
        ta.value = ta.value.slice(0, pos) + tag + ta.value.slice(pos);
        ta.setSelectionRange(pos + tag.length, pos + tag.length);
      });
    });
  }

  function addCustomElements() {
    let target = document.querySelector('.b-shiki_editor:not(.b-shiki_editor-v2) .editor-controls');
    if (!target) target = document.querySelector('.vue-node .menubar');
    if (!target) return;
    if (target.querySelector('.all')) return;
    const allContainer = document.createElement('div');
    allContainer.className = 'all';
    const pushMeButton = document.createElement('div');
    pushMeButton.className = 'pushme';
    pushMeButton.style.cursor = 'pointer';
    pushMeButton.style.padding = '0 10px';
    pushMeButton.style.color = 'var(--headline-color)';
    pushMeButton.textContent = '🌁';
    const newBlock = document.createElement('div');
    newBlock.className = 'new_block';
    newBlock.style.display = 'none';
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    const searchInput = document.createElement('input');
    searchInput.className = 'search-input';
    searchInput.type = 'text';
    searchInput.placeholder = 'Что ищешь?';
    const searchButton = document.createElement('span');
    searchButton.className = 'search-button';
    searchButton.textContent = 'Найти';
    searchButton.addEventListener('click', () => searchTenor(searchInput.value));
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    newBlock.appendChild(searchContainer);
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-container';
    newBlock.appendChild(resultsContainer);
    const popularImagesContainer = document.createElement('div');
    popularImagesContainer.className = 'popular-img';
    newBlock.appendChild(popularImagesContainer);
    const loadMoreButton = document.createElement('span');
    loadMoreButton.className = 'load_more';
    loadMoreButton.textContent = 'Ещё';
    loadMoreButton.addEventListener('click', () => {
      const term = document.querySelector('.new_block .search-input').value;
      searchTenor(term, true);
    });
    newBlock.appendChild(loadMoreButton);
    allContainer.appendChild(pushMeButton);
    allContainer.appendChild(newBlock);
    target.appendChild(allContainer);
    pushMeButton.addEventListener('click', () => {
      newBlock.style.display = getComputedStyle(newBlock).display === 'none' ? 'block' : 'none';
      pushMeButton.classList.toggle('clickme');
    });
  }

  function restorePopularImages() {
    const container = document.querySelector('.popular-img');
    if (!container) return;
    container.innerHTML = '';
    const imgs = JSON.parse(localStorage.getItem('popularImages')) || [];
    imgs.forEach(src => {
      const img = document.createElement('img');
      img.className = 'popular-img-item';
      img.src = src;
      img.style.cursor = 'pointer';
      img.style.width = '50px';
      img.style.height = '50px';
      img.style.objectFit = 'cover';
      setupPopularImageEvent(img);
      container.appendChild(img);
    });
  }

  function savePopularImages() {
    const imgs = Array.from(document.querySelectorAll('.popular-img img')).map(i => i.src);
    localStorage.setItem('popularImages', JSON.stringify(imgs));
  }

  let offset = 0, limit = 28, apiKey = 'LIVDSRZULELA';
  function searchTenor(term, loadMore = false) {
    const results = document.querySelector('.results-container');
    const popular = document.querySelector('.popular-img');
    if (!results) return;
    if (!loadMore) { results.innerHTML = ''; offset = 0; }
    fetch(`https://api.tenor.com/v1/search?key=${apiKey}&q=${term}&limit=${limit}&pos=${offset}`)
      .then(r => r.json())
      .then(data => {
        data.results.forEach(gif => {
          const img = document.createElement('img');
          img.className = 'search-result-img';
          img.style.cursor = 'pointer';
          img.style.width = '50px';
          img.style.height = '50px';
          img.style.objectFit = 'cover';
          img.src = gif.media[0].gif.url;
          img.alt = gif.title;
          img.addEventListener('click', () => {
            document.querySelectorAll('.editor-area').forEach(ta => {
              const pos = ta.selectionStart;
              const tag = `[img no-zoom w=40]${img.src}[/img]`;
              ta.value = ta.value.slice(0, pos) + tag + ta.value.slice(pos);
              ta.setSelectionRange(pos + tag.length, pos + tag.length);
            });
            const exists = Array.from(document.querySelectorAll('.popular-img img')).some(i => i.src === img.src);
            if (!exists) {
              const copy = img.cloneNode();
              copy.className = 'popular-img-item';
              copy.style.cursor = 'pointer';
              setupPopularImageEvent(copy);
              const existingImgs = document.querySelectorAll('.popular-img img');
              if (existingImgs.length >= 49) existingImgs[0].remove();
              popular.appendChild(copy);
              savePopularImages();
            }
          });
          results.appendChild(img);
        });
        offset += limit;
        const lmb = document.querySelector('.load_more');
        if (lmb) lmb.style.display = data.results.length > 0 ? 'inline-block' : 'none';
        popular.style.display = results.querySelectorAll('img').length > 0 ? 'none' : 'grid';
      })
      .catch(e => console.error(e));
  }

  function initGifs() {
    addCustomElements();
    if (!window.popularImagesInitialized) {
      restorePopularImages();
      window.popularImagesInitialized = true;
    }
  }

  const di = debounce(initGifs, 100);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', di);
  } else {
    di();
  }

  new MutationObserver(di).observe(document.body, { childList: true, subtree: true });

  const _wrap = m => {
    const orig = history[m];
    return (...args) => {
      const ret = orig.apply(history, args);
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };
  };
  history.pushState = _wrap('pushState');
  history.replaceState = _wrap('replaceState');
  window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
  window.addEventListener('locationchange', di);
  window.addEventListener('pageshow', di);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) di(); });
})();
