// ==UserScript==
// @name         👑 EMPRESS 💅 v1.1.0
// @namespace    https://empornium.is/
// @version      1.1.0
// @description  2 MODULES: Hide Torrents v1.0.0, Click to Nail v1.0.1
// @author       Anonymous + SerpentGPT
// @license      MIT
// @match        https://*.empornium.is/*
// @match        https://*.empornium.sx/*
// @match        https://*.empornium.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538596/%F0%9F%91%91%20EMPRESS%20%F0%9F%92%85%20v110.user.js
// @updateURL https://update.greasyfork.org/scripts/538596/%F0%9F%91%91%20EMPRESS%20%F0%9F%92%85%20v110.meta.js
// ==/UserScript==


// 👑 HIDE TORRENTS v1.0.0
(function () {
    'use strict';

const HIDE_KEY = 'emp_hidden_torrents';
    let lastHidden = null;

    const get = (key) => {
        try {
            return JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
            return {};
        }
    };
    const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

    const getId = (a) => (a.href.match(/id=(\d+)/) || [])[1];

    function styleButtons() {
        const style = document.createElement('style');
        style.textContent = `
            .empress-btn {
                margin-left: 6px;
                cursor: pointer;
                background: transparent;
                border: none;
                font-size: 14px;
                transition: transform 0.2s;
            }
            .empress-btn:hover {
                transform: scale(1.2);
                text-shadow: 0 0 4px hotpink;
            }
            #empress-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #222;
                color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px hotpink;
                z-index: 10000;
                min-width: 300px;
            }
            #empress-modal-close {
                float: right;
                cursor: pointer;
                color: hotpink;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    function createButton(id, row, title) {
        const btn = document.createElement('button');
        btn.classList.add('empress-btn');
        btn.textContent = '🔕';
        btn.title = 'Hide this torrent';

        btn.onclick = () => {
            const list = get(HIDE_KEY);
            if (!list[id]) {
                list[id] = title;
                lastHidden = id;
                set(HIDE_KEY, list);
                row.style.display = 'none';
            }
        };
        return btn;
    }

    function processTorrents() {
        const hidden = get(HIDE_KEY);

        document.querySelectorAll('a[href*="torrents.php?id="]').forEach(a => {
            if (a.dataset.empressDone) return;
            const id = getId(a);
            const row = a.closest('tr');
            const td = a.closest('td');
            const title = a.textContent.trim();
            if (!id || !row || !td) return;

            a.dataset.empressDone = 'true';

            if (hidden[id]) {
                row.style.display = 'none';
                return;
            }

            td.appendChild(createButton(id, row, title));
        });
    }

    function showSettingsModal() {
        if (document.getElementById('empress-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'empress-modal';
        modal.innerHTML = `
            <div id="empress-modal-close">✖</div>
            <h3>👑 EMPRESS 💅</h3>
            <button id="showHidden">Show Hidden Torrents</button>
            <button id="undoLastHide">Undo Last Hide</button>
        `;
        document.body.appendChild(modal);

        document.getElementById('empress-modal-close').onclick = () => {
            modal.remove();
        };

        document.getElementById('showHidden').onclick = () => {
            try {
                const hidden = get(HIDE_KEY);
                Object.keys(hidden).forEach(id => {
                    const links = Array.from(document.querySelectorAll(`a[href*="torrents.php?id=${id}"]`));
                    links.forEach(link => {
                        const row = link.closest('tr');
                        if (row) {
                            row.style.display = '';
                        }
                    });
                });
            } catch (e) {
                console.error('Error while showing hidden torrents:', e);
            }
        };

        document.getElementById('undoLastHide').onclick = () => {
            if (!lastHidden) return;
            const hidden = get(HIDE_KEY);
            delete hidden[lastHidden];
            set(HIDE_KEY, hidden);

            const links = Array.from(document.querySelectorAll(`a[href*="torrents.php?id=${lastHidden}"]`));
            links.forEach(link => {
                const row = link.closest('tr');
                if (row) {
                    row.style.display = '';
                }
            });

            lastHidden = null;
        };
    }

    function addSettingsLinkToNavbar() {
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        ul.appendChild(li);
        ul.style.display = 'inline-block';

        const a = document.createElement('a');
        a.href = '#';
        a.textContent = '👑 EMPRESS 💅';
        a.addEventListener('click', showSettingsModal);
        li.appendChild(a);

        const stats = document.querySelector('#major_stats');
        if (stats) stats.prepend(ul);
    }

    function waitForTorrents() {
        const interval = setInterval(() => {
            const found = document.querySelector('a[href*="torrents.php?id="]');
            if (found) {
                clearInterval(interval);
                processTorrents();
            }
        }, 500);
    }

    window.addEventListener('load', () => {
        styleButtons();
        addSettingsLinkToNavbar();
        waitForTorrents();
        setInterval(processTorrents, 3000);
    });
})();


// 💎 CLICK TO NAIL v1.0.1

(function () {
  'use strict';

  const VIEWER_ID = 'emp-viewer-box';
  let stickyOffsetTop = null;
  let stickyActive = false;

  function insertViewerBox() {
    let box = document.getElementById(VIEWER_ID);
    if (!box) {
      box = document.createElement('div');
      box.id = VIEWER_ID;
      box.style = 'border: 2px solid hotpink; padding: 10px; margin: 10px 0; background:#111; z-index:9999;';
      box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="color:hotpink;margin:0;">EMP ViewerBox 💎</h3>
          <button id="emp-viewer-close" style="font-size:20px; background:none; color:white; border:none; cursor:pointer;">&times;</button>
        </div>
        <div id="emp-viewer-gallery" style="margin-top:10px; display:flex; flex-wrap:nowrap; overflow-x:auto; overflow-y:hidden; gap:6px; align-items:flex-start; height:140px;"></div>
      `;
      const bottomPager = document.querySelector('div.linkbox.pager');
      if (bottomPager && bottomPager.parentElement) bottomPager.parentElement.insertBefore(box, bottomPager);
      else document.body.prepend(box);
      document.getElementById('emp-viewer-close').onclick = () => box.remove();
      stickyOffsetTop = box.offsetTop;
    }
  }

  function handleStickyBehavior() {
    const box = document.getElementById(VIEWER_ID);
    if (!box || stickyOffsetTop === null) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > stickyOffsetTop && !stickyActive) {
      box.style.position = 'fixed';
      box.style.top = '0';
      box.style.left = '0';
      box.style.right = '0';
      box.style.boxShadow = '0 2px 6px rgba(255,105,180,0.5)';
      stickyActive = true;
    } else if (scrollTop <= stickyOffsetTop && stickyActive) {
      box.style.position = 'static';
      box.style.boxShadow = 'none';
      stickyActive = false;
    }
  }

  function showInViewerBox(imageUrls) {
    insertViewerBox();
    const gallery = document.getElementById('emp-viewer-gallery');
    gallery.innerHTML = '';

    let lightbox = document.getElementById('emp-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'emp-lightbox';
      lightbox.style = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        cursor: zoom-out;
      `;
      lightbox.innerHTML = `<div id="emp-lightbox-pan" style="overflow: hidden; max-width: 90vw; max-height: 90vh;">
        <img id="emp-lightbox-img" style="border-radius:4px; transition: transform 0.3s ease; cursor: grab;">
      </div>`;
      document.body.appendChild(lightbox);
    }

    const panWrapper = document.getElementById('emp-lightbox-pan');
    const lightboxImg = document.getElementById('emp-lightbox-img');

    let currentIndex = 0;
    const allImages = imageUrls;

    panWrapper.addEventListener('wheel', (e) => {
      if (lightbox.style.display !== 'flex') return;
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      currentIndex += e.deltaY > 0 ? 1 : -1;
      if (currentIndex < 0) currentIndex = allImages.length - 1;
      if (currentIndex >= allImages.length) currentIndex = 0;

      const nextUrl = allImages[currentIndex];
      lightboxImg.src = nextUrl;
      lightboxImg.dataset.zoomed = 'false';
      lightboxImg.style.width = 'auto';
      lightboxImg.style.height = 'auto';
      lightboxImg.style.maxWidth = '90vw';
      lightboxImg.style.maxHeight = '90vh';
      panWrapper.scrollTop = 0;
      panWrapper.scrollLeft = 0;
      panWrapper.style.overflow = 'hidden';
    }, { passive: false });

    let isDragging = false, startX = 0, startY = 0, scrollLeft = 0, scrollTop = 0, hasMoved = false;

    panWrapper.addEventListener('mousedown', (e) => {
      if (lightboxImg.dataset.zoomed === 'true') {
        isDragging = true;
        hasMoved = false;
        startX = e.pageX - panWrapper.offsetLeft;
        startY = e.pageY - panWrapper.offsetTop;
        scrollLeft = panWrapper.scrollLeft;
        scrollTop = panWrapper.scrollTop;
        lightboxImg.style.cursor = 'grabbing';
      }
    });

    panWrapper.addEventListener('mouseleave', () => {
      isDragging = false;
      lightboxImg.style.cursor = 'grab';
    });

    panWrapper.addEventListener('mouseup', () => {
      isDragging = false;
      setTimeout(() => { if (hasMoved) lightboxImg.style.cursor = 'grab'; }, 50);
    });

    panWrapper.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      hasMoved = true;
      const x = e.pageX - panWrapper.offsetLeft;
      const y = e.pageY - panWrapper.offsetTop;
      const walkX = (x - startX);
      const walkY = (y - startY);
      panWrapper.scrollLeft = scrollLeft - walkX;
      panWrapper.scrollTop = scrollTop - walkY;
    });

    lightbox.onclick = (e) => {
      if (e.target.id === 'emp-lightbox-img') {
        if (lightboxImg.dataset.zoomed === 'false') {
          lightboxImg.style.width = lightboxImg.naturalWidth + 'px';
          lightboxImg.style.height = lightboxImg.naturalHeight + 'px';
          lightboxImg.style.maxWidth = 'none';
          lightboxImg.style.maxHeight = 'none';
          lightboxImg.dataset.zoomed = 'true';
          lightbox.style.cursor = 'zoom-in';
          panWrapper.style.overflow = 'auto';
          panWrapper.scrollLeft = 0;
          panWrapper.scrollTop = 0;
        } else {
          lightboxImg.style.width = 'auto';
          lightboxImg.style.height = 'auto';
          lightboxImg.style.maxWidth = '90vw';
          lightboxImg.style.maxHeight = '90vh';
          lightboxImg.dataset.zoomed = 'false';
          lightbox.style.cursor = 'zoom-out';
          panWrapper.scrollTop = 0;
          panWrapper.scrollLeft = 0;
          panWrapper.style.overflow = 'hidden';
        }
      } else {
        lightbox.style.display = 'none';
      }
    };

    imageUrls.forEach((url) => {
      const thumb = document.createElement('img');
      const preview = url.replace(/(\.(jpg|jpeg|png|gif|webp))$/i, '.th$1');
      thumb.src = preview;
      thumb.loading = 'lazy';
      thumb.onerror = () => {
        thumb.src = url;
        thumb.style.opacity = 0.3;
        thumb.title = "Broken preview 😢";
      };
      thumb.style = 'height:100%; max-height:100%; width:auto; object-fit:contain; border-radius:4px; display:block; cursor: zoom-in;';
      thumb.onclick = () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = url;
        currentIndex = imageUrls.indexOf(url);
        lightboxImg.dataset.zoomed = 'false';
        lightboxImg.style.width = 'auto';
        lightboxImg.style.height = 'auto';
        lightboxImg.style.maxWidth = '90vw';
        lightboxImg.style.maxHeight = '90vh';
        panWrapper.scrollTop = 0;
        panWrapper.scrollLeft = 0;
        panWrapper.style.overflow = 'hidden';
      };
      const wrapper = document.createElement('div');
      wrapper.style = 'flex: 0 0 auto;';
      wrapper.appendChild(thumb);
      gallery.appendChild(wrapper);
    });
  }

  function extractHamsterImages(container) {
    const imgs = new Set();
    container.querySelectorAll('img[src*="hamster.is"], img[data-src*="hamster.is"]').forEach(img => {
      const real = img.dataset.src || img.src;
      if (real) imgs.add(real.replace(/\.(th|md)\./i, '.'));
    });
    container.querySelectorAll('a[href*="hamster.is"]').forEach(a => {
      if (a.href.match(/\.(jpg|jpeg|png|gif|webp)$/i)) imgs.add(a.href);
    });
    return Array.from(imgs);
  }

  function interceptTorrentLinks() {
    document.querySelectorAll('a[href*="torrents.php?id="]').forEach(link => {
      if (link.dataset.viewerIntercepted) return;
      link.dataset.viewerIntercepted = 'true';

      link.addEventListener('click', async e => {
        e.preventDefault();
        const url = link.href;
        try {
          const html = await fetch(url).then(r => r.text());
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const descbox = doc.querySelector('#descbox') || doc.querySelector('#details_top');
          if (!descbox) return;
          const images = extractHamsterImages(descbox);
          if (images.length > 0) showInViewerBox(images);
        } catch (err) {
          console.error('[ViewerBox] Failed to fetch torrent page', err);
        }
      });
    });
  }

  window.addEventListener('scroll', handleStickyBehavior);
  window.addEventListener('load', () => {
    interceptTorrentLinks();
    setInterval(() => {
      try {
        interceptTorrentLinks();
      } catch (err) {
        console.warn('[ViewerBox] Retry failed:', err);
      }
    }, 3000);
  });
})();
