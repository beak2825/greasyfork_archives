// ==UserScript==
// @name         TransPostBSKY
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto-translate Bluesky timeline, post detail and replies – emoji-safe, viewport-aware, re-translate on “Show more”, with a floating language panel.
// @author       Ian
// @license      MIT
// @match        https://bsky.app/*
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @downloadURL https://update.greasyfork.org/scripts/534833/TransPostBSKY.user.js
// @updateURL https://update.greasyfork.org/scripts/534833/TransPostBSKY.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*───────────────────────────
   *  CONFIG
   *──────────────────────────*/
  const config = {
    /** 节点选择器：覆盖首页流、详情页、回帖正文 */
    postSelectors: [
      'main [data-testid*="postText"]',            // 早期/后备 DOM
      'main div[dir="auto"][data-word-wrap]'       // 现行 DOM
    ],

    targetLang: 'zh-CN',
    skipLanguages: new Set(['zh-CN', 'zh-TW']),
    languages: {
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      en: 'English',
      ja: '日本語',
      ru: 'Русский',
      fr: 'Français',
      de: 'Deutsch'
    },

    concurrentRequests: 3,
    translationStyle: {
      color: 'inherit',
      fontSize: '0.9em',
      borderLeft: '2px solid #4c9aff',
      padding: '0 10px',
      margin: '4px 0',
      whiteSpace: 'pre-wrap',
      opacity: '0.8',
      display: 'block',
      width: '100%',
      flex: '0 0 auto',
      alignSelf: 'flex-start'
    },

    viewportPriority: { centerRadius: 200, updateInterval: 500 }
  };

  /*───────────────────────────
   *  STATE
   *──────────────────────────*/
  const processing = new Set();
  let queue = [];
  let busy = false;
  const visible = new Map();

  /*───────────────────────────
   *  HELPERS
   *──────────────────────────*/
  const selectorAll = config.postSelectors.join(',');
  function collectNodes(root = document) {
    const out = new Set();
    if (root.matches?.(selectorAll)) out.add(root);
    root.querySelectorAll?.(selectorAll).forEach(n => out.add(n));
    return [...out].filter(n => !n.classList.contains('translation-container'));
  }

  async function gTranslate(text) {
    return new Promise(res => {
      GM_xmlhttpRequest({
        method: 'GET',
        url:
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${config.targetLang}` +
          `&dt=t&q=${encodeURIComponent(text)}`,
        onload: r => {
          try {
            const j = JSON.parse(r.responseText);
            res({ tr: j[0].map(i => i[0]).join('').trim(), src: (j[2] || '').toLowerCase() });
          } catch {
            res({ tr: text, src: '' });
          }
        },
        onerror: () => res({ tr: text, src: '' })
      });
    });
  }

  function extractText(node) {
    const clone = node.cloneNode(true);
    clone.querySelectorAll('a, button').forEach(el => {
      if (!/[\p{Extended_Pictographic}\p{Emoji_Component}]/u.test(el.innerHTML)) el.remove();
    });
    clone.innerHTML = clone.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    return clone.textContent.replace(/[\u00A0\u200B]+/g, ' ').trim();
  }

  function makeBox() {
    const div = document.createElement('div');
    div.className = 'translation-container';
    Object.assign(div.style, config.translationStyle);
    div.innerHTML = '<div class="loading-spinner"></div>';
    return div;
  }

  /*───────────────────────────
   *  CORE PIPELINE
   *──────────────────────────*/
  function handle(node) {
    if (processing.has(node) || node.dataset.trDone) return;
    processing.add(node);
    node.dataset.trDone = 1;

    const raw = extractText(node);
    if (!raw) return processing.delete(node);
    node.dataset.raw = raw;
    node.after(makeBox());

    const req = { node, text: raw };
    (distance(node) < config.viewportPriority.centerRadius ? queue.unshift(req) : queue.push(req));
    watchNode(node);
    runQueue();
  }

  function watchNode(node) {
    if (node.dataset.trObs) return;
    node.dataset.trObs = 1;
    new MutationObserver(() => {
      const cur = extractText(node);
      if (!cur || cur === node.dataset.raw) return;
      node.dataset.raw = cur;
      node.nextElementSibling.innerHTML = '<div class="loading-spinner"></div>';
      queue.unshift({ node, text: cur });
      runQueue();
    }).observe(node, { childList: true, characterData: true, subtree: true });
  }

  async function runQueue() {
    if (busy || !queue.length) return;
    busy = true;

    queue.sort((a, b) => distance(a.node) - distance(b.node));
    const batch = queue.splice(0, config.concurrentRequests);

    await Promise.all(
      batch.map(async ({ node, text }) => {
        try {
          const { tr, src } = await gTranslate(text);
          node.nextElementSibling.innerHTML =
            src === config.targetLang.toLowerCase() || config.skipLanguages.has(src)
              ? ''
              : tr.replace(/\n/g, '<br>');
        } catch {
          node.nextElementSibling.innerHTML = '<span style="color:red">翻译失败</span>';
        } finally {
          processing.delete(node);
        }
      })
    );

    busy = false;
    queue.length && runQueue();
  }

  /*───────────────────────────
   *  VIEWPORT LOGIC
   *──────────────────────────*/
  function center(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function distance(el) {
    const c = visible.get(el) || center(el);
    return Math.hypot(innerWidth / 2 - c.x, innerHeight / 2 - c.y);
  }
  function trackViewport() {
    const update = () =>
      collectNodes().forEach(n => {
        const r = n.getBoundingClientRect();
        r.top < innerHeight && r.bottom > 0 ? visible.set(n, center(n)) : visible.delete(n);
      });
    addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    setInterval(update, config.viewportPriority.updateInterval);
  }

  /*───────────────────────────
   *  DOM OBSERVERS & SCANS
   *──────────────────────────*/
  function scan(root = document) {
    collectNodes(root).forEach(handle);
  }
  function observeDOM() {
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => scan(n))))
      .observe(document, { childList: true, subtree: true });
  }

  /*───────────────────────────
   *  CONTROL PANEL
   *──────────────────────────*/
  function initPanel() {
    const panelHTML = `
      <div id="trans-panel">
        <div id="trans-icon"><i class="fa-solid fa-language"></i></div>
        <div id="trans-menu">
          <div class="menu-title">Target language</div>
          ${Object.entries(config.languages)
            .map(
              ([code, name]) =>
                `<div class="lang-item target" data-lang="${code}">${name}</div>`
            )
            .join('')}
          <hr>
          <div class="menu-title">Do not translate</div>
          ${Object.entries(config.languages)
            .map(
              ([code, name]) =>
                `<div class="lang-item skip ${
                  config.skipLanguages.has(code) ? 'active' : ''
                }" data-skip="${code}">${name}</div>`
            )
            .join('')}
        </div>
      </div>
    `;
    const style = document.createElement('style');
    style.textContent = `
      #trans-panel{position:fixed;bottom:20px;right:20px;z-index:9999;font-family:sans-serif}
      #trans-icon{width:40px;height:40px;border-radius:50%;background:rgba(76,154,255,.9);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.3s;box-shadow:0 4px 6px rgba(0,0,0,.1)}
      #trans-icon:hover{transform:scale(1.1)}
      #trans-icon i{color:#fff;font-size:20px}
      #trans-menu{width:200px;background:rgba(255,255,255,.95);backdrop-filter:blur(10px);border-radius:12px;padding:8px 0;margin-top:10px;opacity:0;visibility:hidden;transform:translateY(10px);transition:.3s;box-shadow:0 8px 24px rgba(0,0,0,.15)}
      #trans-menu.show{opacity:1;visibility:visible;transform:translateY(0)}
      .menu-title{padding:6px 12px;font-weight:bold;font-size:13px}
      .lang-item{padding:10px 16px;font-size:14px;cursor:pointer;transition:background .2s}
      .lang-item:hover{background:rgba(76,154,255,.1)}
      .lang-item.target[data-lang="${config.targetLang}"]{color:#4c9aff;font-weight:bold}
      .lang-item.skip.active{background:rgba(76,154,255,.1)}
      .loading-spinner{width:16px;height:16px;border:2px solid #ddd;border-top-color:#4c9aff;border-radius:50%;animation:spin 1s linear infinite;margin:5px}
      @keyframes spin{to{transform:rotate(360deg)}}
      .translation-container{display:block;width:100%;flex:0 0 100%}
      hr{margin:8px 0;border:none;border-top:1px solid #ccc}
    `;
    document.head.appendChild(style);
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    const icon = document.getElementById('trans-icon');
    const menu = document.getElementById('trans-menu');

    icon.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('#trans-panel')) menu.classList.remove('show');
    });

    /** 切换目标语言 **/
    document.querySelectorAll('.lang-item.target').forEach(item =>
      item.addEventListener('click', function () {
        config.targetLang = this.dataset.lang;
        document.querySelectorAll('.lang-item.target').forEach(li => (li.style.color = ''));
        this.style.color = '#4c9aff';
        refreshAll();
        menu.classList.remove('show');
      })
    );

    /** 切换跳过语言 **/
    document.querySelectorAll('.lang-item.skip').forEach(item =>
      item.addEventListener('click', function () {
        const lang = this.dataset.skip;
        config.skipLanguages.has(lang)
          ? config.skipLanguages.delete(lang)
          : config.skipLanguages.add(lang);
        this.classList.toggle('active');
      })
    );
  }

  function refreshAll() {
    document.querySelectorAll('.translation-container').forEach(el => el.remove());
    processing.clear();
    queue = [];
    scan();
  }

  /*───────────────────────────
   *  INIT
   *──────────────────────────*/
  function init() {
    initPanel();
    trackViewport();
    observeDOM();
    scan();
    setInterval(scan, 1000); // 再保险补漏
  }

  addEventListener('load', init);
  if (document.readyState === 'complete') init();
})();