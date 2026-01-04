// ==UserScript==
// @name        Nhentai Endless (Updated 2025)
// @namespace   https://ko-fi.com/greekie
// @version     3.0
// @description Endless scroll.
// @author      Greekie_10
// @match       https://nhentai.net/*
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @connect-src nhentai.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541702/Nhentai%20Endless%20%28Updated%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541702/Nhentai%20Endless%20%28Updated%202025%29.meta.js
// ==/UserScript==

(function () {
  // 💣 TOTAL DISABLE for /g or /g/*
  if (/^\/g(\/|$)/.test(location.pathname)) {
    console.log('[nhentai_endless] Skipped on /g pages.');
    return;
  }

  let maxPages = 1;
  let loadedPages = 0;
  let lastUrl = null;
  let isLoading = false;
  let container;
  let reachedEnd = false;
  let awaitingRepeatBottom = false;

  function fixLazyImages(container) {
    const imgs = container.querySelectorAll('img');
    imgs.forEach(img => {
      const lazy = img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.getAttribute('data-original');
      if (lazy) img.src = lazy;
      img.removeAttribute('loading');
      img.removeAttribute('data-src');
      img.removeAttribute('data-lazy-src');
      img.removeAttribute('data-original');
    });
  }

  function getNextPageUrl() {
    const currentUrl = new URL(window.location.href);
    const pageParam = currentUrl.searchParams.get("page");
    const currentPage = pageParam ? parseInt(pageParam) : 1;
    const nextPage = currentPage + loadedPages;
    currentUrl.searchParams.set("page", nextPage + 1);
    return currentUrl.href;
  }

  function loadNextPage() {
    if (isLoading || reachedEnd || (loadedPages >= maxPages - 1 && maxPages !== Infinity)) return;
    isLoading = true;
    awaitingRepeatBottom = false;

    const nextUrl = getNextPageUrl();
    if (nextUrl === lastUrl) return;
    lastUrl = nextUrl;

    GM_xmlhttpRequest({
      method: 'GET',
      url: nextUrl,
      onload: function (res) {
        const html = new DOMParser().parseFromString(res.responseText, "text/html");
        const nextContent = html.querySelector('#content');

        const galleryItems = nextContent?.querySelectorAll('.gallery');
        if (!nextContent || !galleryItems || galleryItems.length === 0) {
          reachedEnd = true;
          console.log('[nhentai_endless] No more pages. Stopping.');
          return;
        }

        fixLazyImages(nextContent);
        container.appendChild(nextContent);
        loadedPages++;
        isLoading = false;
      },
      onerror: function () {
        isLoading = false;
      }
    });
  }

  function scrollListener() {
    const scrolled = Math.ceil(window.scrollY + window.innerHeight);
    const total = Math.floor(document.documentElement.scrollHeight);

    if (scrolled >= total) {
      if (!awaitingRepeatBottom) {
        console.log('[nhentai_endless] Bottom reached. Scroll again to load next page.');
        awaitingRepeatBottom = true;
      } else {
        loadNextPage();
      }
    }
  }

  function setupDropdown() {
    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.top = '5vh';
    box.style.left = '10px';
    box.style.background = 'rgba(0,0,0,0.85)';
    box.style.color = '#fff';
    box.style.padding = '8px 12px';
    box.style.zIndex = '9999';
    box.style.borderRadius = '10px';
    box.style.cursor = 'move';
    box.style.fontFamily = 'Arial, sans-serif';
    box.style.fontSize = '14px';
    box.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

    const label = document.createElement('label');
    label.textContent = 'Page:';
    label.style.marginRight = '6px';

    const select = document.createElement('select');
    select.style.backgroundColor = '#ff9900';
    select.style.color = 'black';
    select.style.border = 'none';
    select.style.padding = '4px 8px';
    select.style.borderRadius = '6px';
    select.style.fontWeight = 'bold';
    select.style.cursor = 'pointer';
    select.style.outline = 'none';
    select.style.fontSize = '14px';
    select.style.textAlign = 'center';
    select.style.textAlignLast = 'center';
    select.style.webkitAppearance = 'none';
    select.style.mozAppearance = 'none';
    select.style.appearance = 'none';
    select.style.backgroundImage = 'none';

    select.addEventListener('keydown', e => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    });

    for (let i = 1; i <= 5; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      select.appendChild(opt);
    }

    const endlessOpt = document.createElement('option');
    endlessOpt.value = 'Infinity';
    endlessOpt.textContent = '♾️';
    select.appendChild(endlessOpt);

    select.value = "1";
    select.addEventListener('change', () => {
      maxPages = select.value === 'Infinity' ? Infinity : parseInt(select.value);
      loadedPages = 0;
      reachedEnd = false;
      awaitingRepeatBottom = false;
      lastUrl = null;
      container.innerHTML = ''; // Clear old content

      if (maxPages === Infinity) {
        window.addEventListener('scroll', scrollListener);
      } else {
        window.removeEventListener('scroll', scrollListener);
        (async function loadAll() {
          for (let i = 0; i < maxPages - 1; i++) {
            await new Promise(resolve => {
              const interval = setInterval(() => {
                if (!isLoading) {
                  loadNextPage();
                  clearInterval(interval);
                  resolve();
                }
              }, 100);
            });
          }
        })();
      }
    });

    box.appendChild(label);
    box.appendChild(select);
    document.body.appendChild(box);

    let offsetX = 0, offsetY = 0, isDown = false;
    box.addEventListener('mousedown', (e) => {
      isDown = true;
      offsetX = e.clientX - box.offsetLeft;
      offsetY = e.clientY - box.offsetTop;
      box.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      box.style.left = `${e.clientX - offsetX}px`;
      box.style.top = `${e.clientY - offsetY}px`;
    });
    document.addEventListener('mouseup', () => {
      isDown = false;
      box.style.cursor = 'move';
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('#content');
    if (!mainContent) return;

    container = document.createElement('div');
    mainContent.after(container);
    setupDropdown();
  });
})();
