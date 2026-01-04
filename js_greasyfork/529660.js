// ==UserScript==
// @name         FetLife: Download Image (stable)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Always shows a download button for the active high-res picture with a nice filename.
// @match        https://fetlife.com/*/pictures/*
// @match        https://fetlife.com/pictures/*
// @icon         https://fetlife.com/favicons/favicon.ico
// @license      GPL-3.0
// @grant        GM_download
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/529660/FetLife%3A%20Download%20Image%20%28stable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529660/FetLife%3A%20Download%20Image%20%28stable%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** Get the active picture IMG element inside the carousel */
  function getMainImage() {
    // Prefer the active slide image if present
    const active = document.querySelector('main article .splide__slide.is-active img');
    if (active) return active;
    // Fallbacks, just in case markup shifts
    return document.querySelector('main article img.object-contain')
        || document.querySelector('main article img[alt^="Picture"]')
        || document.querySelector('main article img');
  }

  /** Parse srcset and return the highest-multiplier URL, falling back to src */
  function getHighResUrl(img) {
    if (!img) return '';
    if (img.srcset) {
      let best = '';
      let bestX = 0;
      for (const cand of img.srcset.split(',')) {
        const [url, desc] = cand.trim().split(/\s+/);
        if (desc && /x$/i.test(desc)) {
          const mult = parseFloat(desc);
          if (mult > bestX) {
            bestX = mult;
            best = url;
          }
        } else if (desc && /w$/i.test(desc)) {
          // If they ever switch to width descriptors, prefer the largest
          const width = parseFloat(desc);
          if (width > bestX) {
            bestX = width;
            best = url;
          }
        }
      }
      return best || img.src || '';
    }
    return img.src || '';
  }

  /** Build a username_pictureId.ext filename from URL + location */
  function getCustomFilename(highResUrl) {
    try {
      const u = new URL(highResUrl);
      const last = u.pathname.split('/').pop() || '';
      const dot = last.lastIndexOf('.');
      const ext = dot !== -1 ? last.slice(dot) : '.jpg';

      const parts = window.location.pathname.split('/').filter(Boolean);
      // expect: /<username>/pictures/<pictureId>
      const username = parts[0] || 'user';
      const pictureId = parts[2] || 'image';
      return `${username}_${pictureId}${ext}`;
    } catch {
      return 'image.jpg';
    }
  }

  /** Create (or update) the download button in a stable place */
  function upsertButton(img) {
    if (!img) return;

    // Make sure pointer events aren’t disabled on the image
    img.style.setProperty('pointer-events', 'auto', 'important');

    const article = img.closest('article');
    if (!article) return;

    let btn = document.getElementById('downloadImageButton');
    const curSrc = img.currentSrc || img.src;

    if (btn && btn.dataset.currentImageSrc !== curSrc) {
      btn.remove();
      btn = null;
    }

    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'downloadImageButton';
      btn.type = 'button';
      btn.textContent = 'Download high-res image';
      btn.style.display = 'block';
      btn.style.margin = '16px auto';
      btn.style.padding = '8px 12px';
      btn.style.fontSize = '14px';
      btn.style.cursor = 'pointer';
      btn.style.zIndex = '9999';

      // Insert the button in a stable place: right above the article footer.
      const footer = article.querySelector(':scope > footer');
      if (footer) {
        footer.insertAdjacentElement('beforebegin', btn);
      } else {
        // Fallback under the image
        (img.parentElement || article).insertAdjacentElement('beforeend', btn);
      }

      btn.addEventListener('click', () => {
        const url = getHighResUrl(img);
        const name = getCustomFilename(url);

        // Try GM_download first
        try {
          GM_download({
            url,
            name,
            // Tampermonkey ignores custom headers for GM_download, so don't rely on them.
            onerror: () => {
              // Fallback: open in a new tab so the browser sends a normal Referer
              const win = window.open(url, '_blank');
              if (!win) alert('Popup blocked. Please allow popups or click again.');
            },
          });
        } catch (e) {
          // As a safety net, open the URL
          const win = window.open(url, '_blank');
          if (!win) alert('Popup blocked. Please allow popups or click again.');
        }
      });
    }

    // Track the current image used by the button
    btn.dataset.currentImageSrc = curSrc;
  }

  /** Main driver: find image + ensure button exists */
  function process() {
    const img = getMainImage();
    if (img) upsertButton(img);
  }

  // Initial run
  process();

  // Observe SPA route/rerenders, but throttle to animation frames
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        process();
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Also hook history changes (some SPAs don’t mutate the whole body)
  for (const method of ['pushState', 'replaceState']) {
    const orig = history[method];
    history[method] = function () {
      const ret = orig.apply(this, arguments);
      setTimeout(process, 0);
      return ret;
    };
  }
  window.addEventListener('popstate', () => setTimeout(process, 0));
})();
