// ==UserScript==
// @name         JPDB Uchisen Image inserter
// @version      2.1
// @description  Inserts ALL Uchisen mnemonic images into JPDB kanji cards with Prev/Next and a per-kanji Star that persists via Tampermonkey storage
// @author       togeffet, Henry Russell
// @match        https://jpdb.io/kanji/*
// @match        https://jpdb.io/review*
// @connect      uchisen.com
// @connect      ik.imagekit.io
// @connect      dhblqbsgkimuk.cloudfront.net
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/546315/JPDB%20Uchisen%20Image%20inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/546315/JPDB%20Uchisen%20Image%20inserter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -----------------------------
  // storage keys
  // -----------------------------
  const STORAGE_KEY_STAR  = (kanji) => `uchisen_star_${kanji}`;
  const STORAGE_KEY_INDEX = (kanji) => `uchisen_index_${kanji}`;

  // -----------------------------
  // helpers
  // -----------------------------
  function decodeEntities(str) {
    if (!str) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  function toFullImageURL(imagePath) {
    if (!imagePath) return null;
    if (/^https?:\/\//i.test(imagePath)) return imagePath;

    // typical inputs:
    //  - "/kanji/36865114/2972931736865114.png"
    //  - "generated_63fd7f81c868d.jpg"
    //  - "generated/saved/foo.jpg"
    if (imagePath.startsWith('/')) {
      return `https://ik.imagekit.io/uchisen${imagePath}`;
    }
    if (imagePath.startsWith('generated_')) {
      return `https://ik.imagekit.io/uchisen/generated/saved/${imagePath}`;
    }
    return `https://ik.imagekit.io/uchisen/${imagePath}`;
  }

  // Canonicalize so duplicates compare equal:
  // - force absolute
  // - collapse multiple slashes in pathname
  // - drop query/hash (thumbnails often add ?tr=…)
  function canonURL(raw) {
    if (!raw) return '';
    let u = raw;
    if (!/^https?:\/\//i.test(u)) u = toFullImageURL(u);
    try {
      const url = new URL(u);
      url.pathname = url.pathname.replace(/\/{2,}/g, '/'); // “//kanji” -> “/kanji”
      url.search = '';
      url.hash = '';
      return url.origin + url.pathname;
    } catch {
      return u.replace(/\/{2,}/g, '/').split('?')[0].split('#')[0];
    }
  }

  // fetch image as blob (CSP-friendly)
  function fetchImageObjectURL(url, onSuccess, onError) {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'blob',
      onload: (res) => {
        try {
          const blobUrl = URL.createObjectURL(res.response);
          onSuccess(blobUrl);
        } catch (e) {
          console.error('Blob URL creation failed:', e);
          onError?.(e);
        }
      },
      onerror: (err) => {
        console.error('Error fetching Uchisen image:', err);
        onError?.(err);
      }
    });
  }

  function extractKanjiFromURL() {
    const url = window.location.href;

    // kanji pages
    const kanjiMatch = url.match(/https:\/\/jpdb\.io\/kanji\/(.+?)(?:[?#]|$)/);
    if (kanjiMatch) {
      const kanjiPart = kanjiMatch[1].split('?')[0].split('#')[0];
      return decodeURIComponent(kanjiPart);
    }

    // review pages (after reveal)
    const hiddenInput = document.querySelector('input[name="c"]');
    if (hiddenInput) {
      const parts = hiddenInput.value.split(',');
      if (parts.length > 1 && parts[0] === 'kb') return parts[1];
    }

    return '';
  }

  function fetchUchisenPage(kanji) {
    const url = `https://uchisen.com/kanji/${encodeURIComponent(kanji)}`;
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: (response) => {
        if (response.status === 200) {
          buildAndInsertCarousel(response.responseText, kanji);
        } else {
          console.log(`Failed to fetch Uchisen page for ${kanji}`);
        }
      },
      onerror: (error) => console.error('Error fetching Uchisen page:', error)
    });
  }

  function parseAllImages(html, kanji) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const out = [];

    // main image + story
    const mainLoader = doc.querySelector('.kanji_image_loader[data-large]');
    const mainLarge = mainLoader?.getAttribute('data-large')
                  || doc.querySelector('#full_kanji_image')?.getAttribute('src');
    const mainStory = (doc.querySelector('#mnemonic_story')?.textContent || '').trim();
    if (mainLarge) {
      const cu = canonURL(mainLarge);
      out.push({ url: cu, story: mainStory || 'No story available' });
    }

    // all mnemonic cards
    doc.querySelectorAll('.mnemonic_card').forEach(card => {
      const hiddenUrl = card.querySelector('input.image_url')?.value?.trim();
      const rawStory  = card.querySelector('input.story')?.value || '';
      const story     = decodeEntities(rawStory).replace(/<[^>]+>/g, '').trim();
      if (hiddenUrl) {
        const cu = canonURL(hiddenUrl);
        out.push({ url: cu, story: story || mainStory || 'No story available' });
      }
    });

    // de-dupe by canonical url while preserving order
    const seen = new Set();
    const unique = [];
    for (const it of out) {
      if (!it.url) continue;
      if (!seen.has(it.url)) {
        seen.add(it.url);
        unique.push(it);
      }
    }
    return unique;
  }

  // Find the exact “Mnemonic” subsection and insert immediately after it
  function findMnemonicAnchor() {
    // Prefer the label that actually says "Mnemonic"
    const labels = Array.from(document.querySelectorAll('h6.subsection-label'));
    const label = labels.find(h => h.textContent.trim().toLowerCase().startsWith('mnemonic'));
    if (label && label.nextElementSibling && label.nextElementSibling.classList.contains('subsection')) {
      return { parent: label.parentNode, after: label.nextElementSibling };
    }

    // Fallback: any .mnemonic block’s parent subsection
    const mn = document.querySelector('.mnemonic');
    if (mn) {
      const sub = mn.closest('.subsection');
      if (sub) return { parent: sub.parentNode, after: sub };
    }

    // Last resorts used previously
    const resultKanji = document.querySelector('.result.kanji');
    if (resultKanji) return { parent: resultKanji.parentNode, after: resultKanji };

    return null;
  }

  function createUI() {
    const existing = document.getElementById('uchisen-mnemonic-container');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'uchisen-mnemonic-container';
    container.style.cssText = `
      margin: 18px 0 14px;
      padding: 0;
      text-align: center;
    `;

    const navRow = document.createElement('div');
    navRow.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
    `;

    const btnStyle = `
      cursor: pointer;
      user-select: none;
      border: 1px solid var(--table-border-color);
      background: var(--bg-color, transparent);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 18px;
    `;

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.textContent = '◀ Prev';
    prevBtn.style.cssText = btnStyle;

    const counter = document.createElement('span');
    counter.style.cssText = `font-size: 12px; opacity: 0.9; min-width: 56px; display: inline-block;`;

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.textContent = 'Next ▶';
    nextBtn.style.cssText = btnStyle;

    const starBtn = document.createElement('button');
    starBtn.type = 'button';
    starBtn.title = 'Star favorite for this kanji';
    starBtn.style.cssText = btnStyle + 'font-size: 14px; padding: 0 8px;';
    starBtn.textContent = '☆';

    navRow.append(prevBtn, counter, nextBtn, starBtn);

    const img = document.createElement('img');
    img.alt = 'Uchisen mnemonic';
    img.style.cssText = `
      max-width: 320px;
      max-height: 320px;
      border-radius: 4px;
      margin: 6px 0 10px;
      border: 1px solid var(--table-border-color);
      display: block;
      margin-left: auto;
      margin-right: auto;
    `;

    const storyDiv = document.createElement('div');
    storyDiv.style.cssText = `
      font-size: 14px;
      color: var(--text-color);
      line-height: 1.4;
      max-width: 480px;
      margin: 0 auto 8px auto;
      white-space: pre-wrap;
    `;

    const link = document.createElement('a');
    link.target = '_blank';
    link.textContent = 'View on Uchisen';
    link.style.cssText = `
      display: inline-block;
      color: var(--link-color);
      text-decoration: none;
      font-size: 12px;
    `;

    container.append(navRow, img, storyDiv, link);
    return { container, img, storyDiv, link, prevBtn, nextBtn, starBtn, counter };
  }

  let currentKanji = '';
  let items = [];
  let index = 0;
  let currentObjectURL = null;

  function updateStarUI(starBtn) {
    const starredUrl = GM_getValue(STORAGE_KEY_STAR(currentKanji), null);
    const isStarred = starredUrl && items[index] && items[index].url === starredUrl;
    starBtn.textContent = isStarred ? '★' : '☆';
  }

  function showIndex(ui) {
    if (!items.length) return;

    // remember last viewed index for this kanji
    GM_setValue(STORAGE_KEY_INDEX(currentKanji), index);

    ui.counter.textContent = `${index + 1}/${items.length}`;

    const it = items[index];
    ui.storyDiv.textContent = it.story || '';
    ui.link.href = `https://uchisen.com/kanji/${encodeURIComponent(currentKanji)}`;

    if (currentObjectURL) {
      try { URL.revokeObjectURL(currentObjectURL); } catch {}
      currentObjectURL = null;
    }

    // fetch via canonical URL (works fine; we stripped thumbnail params)
    fetchImageObjectURL(it.url, (blobUrl) => {
      currentObjectURL = blobUrl;
      ui.img.src = blobUrl;
      ui.img.alt = `Uchisen mnemonic for ${currentKanji}`;
    }, () => {
      ui.img.removeAttribute('src');
      ui.img.alt = `Failed to load image for ${currentKanji}`;
    });

    updateStarUI(ui.starBtn);
  }

  function buildAndInsertCarousel(html, kanji) {
    items = parseAllImages(html, kanji);
    if (!items.length) {
      console.log(`No images found for kanji: ${kanji}`);
      return;
    }

    const anchor = findMnemonicAnchor();
    if (!anchor) {
      console.log('Could not find mnemonic anchor; aborting insert.');
      return;
    }

    const ui = createUI();

    // initial index:
    const starred = GM_getValue(STORAGE_KEY_STAR(kanji), null);
    const savedIdx = Number(GM_getValue(STORAGE_KEY_INDEX(kanji), 0));
    let startIdx = 0;
    if (starred) {
      const i = items.findIndex(x => x.url === starred);
      if (i >= 0) startIdx = i;
    } else if (!Number.isNaN(savedIdx) && savedIdx >= 0 && savedIdx < items.length) {
      startIdx = savedIdx;
    }
    index = startIdx;

    // wire buttons
    ui.prevBtn.onclick = () => {
      index = (index - 1 + items.length) % items.length;
      showIndex(ui);
    };
    ui.nextBtn.onclick = () => {
      index = (index + 1) % items.length;
      showIndex(ui);
    };
    ui.starBtn.onclick = () => {
      const key = STORAGE_KEY_STAR(currentKanji);
      const currentUrl = items[index].url;
      const existing = GM_getValue(key, null);
      if (existing === currentUrl) {
        GM_deleteValue(key);
      } else {
        GM_setValue(key, currentUrl);
      }
      updateStarUI(ui.starBtn);
    };

    // keyboard niceties
    const keyHandler = (e) => {
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'ArrowLeft')  ui.prevBtn.click();
      if (e.key === 'ArrowRight') ui.nextBtn.click();
      if (e.key === 's' || e.key === 'S') ui.starBtn.click();
    };
    document.addEventListener('keydown', keyHandler, { passive: true });

    // insert immediately after the Mnemonic subsection
    anchor.parent.insertBefore(ui.container, anchor.after.nextSibling);

    // render initial
    showIndex(ui);
  }

  function init() {
    // avoid front side of JPDB review cards
    if (window.location.href.includes('/review') && !document.querySelector('.review-reveal')) return;

    const kanji = extractKanjiFromURL();
    if (!kanji) return;

    currentKanji = kanji;

    const existing = document.getElementById('uchisen-mnemonic-container');
    if (existing) existing.remove();

    fetchUchisenPage(kanji);
  }

  // initial run
  init();

  // detect JPDB’s dynamic navigations
  const observer = new MutationObserver(() => {
    if (window.location.href !== observer.lastUrl) {
      observer.lastUrl = window.location.href;
      setTimeout(init, 500);
    }
  });
  observer.lastUrl = window.location.href;
  observer.observe(document, { subtree: true, childList: true });
})();
