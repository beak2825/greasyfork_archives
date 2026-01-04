// ==UserScript==
// @name         Translator
// @namespace    https://translator.userscript
// @version      1.0
// @description  Immersive bilingual translation for main content only (original above, translation below). Viewport-aware, AdGuard-compatible, safer DOM, domain-scoped selectors, Reddit compatible, YouTube two-line captions, and FAB spinning indicator with adjustable original opacity.
// @author       Raffe Yang
// @match        *://*/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/546396/Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/546396/Translator.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const VERSION = '8.3.1';
  const NS = 'smart_translator_';
  const logVerbose = false; // set true for debugging

  function log(...args) { if (logVerbose) console.log('[Smart Translator]', ...args); }
  function warn(...args) { console.warn('[Smart Translator]', ...args); }
  function err(...args) { console.error('[Smart Translator]', ...args); }

  const CONFIG = {
    storage: {
      sourceLang: NS + 'source',
      targetLang: NS + 'target',
      theme: NS + 'theme',
      showIcon: NS + 'show_icon',
      shortcut: NS + 'shortcut',
      autoSites: NS + 'auto_sites',
      youtubeSubtitle: NS + 'youtube_subtitle',
      originalOpacity: NS + 'original_opacity'
    },
    languages: [
      { code: 'auto', name: 'Auto Detect', flag: '🌐' },
      { code: 'zh-Hans', name: '简体中文', flag: '🇨🇳' },
      { code: 'zh-Hant', name: '繁体中文', flag: '🇹🇼' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: '한국어', flag: '🇰🇷' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' }
    ]
  };

  const Storage = {
    get(key, def) { try { return GM_getValue(key, def); } catch { return def; } },
    set(key, val) { try { GM_setValue(key, val); } catch {} }
  };

  function matchDomain(domain, site) { return domain === site || domain.endsWith('.' + site); }

  // Language detection (symmetric)
  const LanguageDetector = {
    ratio(text, re) {
      const m = text.match(re) || [];
      const total = (text.replace(/\s/g, '') || '').length;
      if (total === 0) return 0;
      return m.length / total;
    },
    isChinese(text) { return this.ratio(text, /[\u4e00-\u9fff]/g) > 0.3; },
    isEnglish(text) { return this.ratio(text, /[a-zA-Z]/g) > 0.6; },
    shouldTranslate(text, targetLang = 'zh-Hans') {
      if (!text || text.length < 5) return false;
      if (/^[\d\s\p{P}]+$/u.test(text)) return false;
      if (/^(Like|Share|Comment|Subscribe|Follow|Read more|Sign in|Next|Previous|Cancel|Close)$/i.test(text)) return false;
      if (targetLang.startsWith('zh')) { if (this.isChinese(text)) return false; return this.isEnglish(text); }
      if (targetLang === 'en') { if (this.isEnglish(text)) return false; return this.isChinese(text); }
      return true;
    }
  };

  // Main-content scoping
  function isInDisallowedRegion(el) {
    const disallowedSelectors = [
      'header', 'nav', 'footer', 'aside',
      '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
      '.site-header', '.site-footer', '.sidebar', '.menu', '.navbar', '.toolbar'
    ];
    return disallowedSelectors.some(s => el.closest(s));
  }
  function getAllowedRoots() {
    const d = location.hostname;
    if (d.includes('github.com')) return ['.markdown-body'];
    if (d.includes('reddit.com')) return [
      '[data-test-id="post-content"]',
      '[data-testid="post-container"]',
      'shreddit-post',
      'faceplate-partial',
      'main'
    ];
    if (d.includes('youtube.com')) return ['#content', 'ytd-app', 'body'];
    if (d.includes('x.com') || d.includes('twitter.com')) return ['main'];
    return ['main', 'article', '[role="main"]', '.content', '.post-content', '.prose', '.entry-content'];
  }
  function scopedQueryAll(selector) {
    const roots = getAllowedRoots();
    const out = [];
    roots.forEach(r => {
      document.querySelectorAll(r).forEach(root => {
        try { root.querySelectorAll(selector).forEach(el => out.push(el)); } catch {}
      });
    });
    return out;
  }

  // Translate service with adaptive concurrency and LRU-ish cache
  const GoogleTranslate = {
    cache: new Map(),
    maxCacheSize: 800,
    concurrency: 12,
    minConcurrency: 4,
    maxConcurrency: 15,
    errorStreak: 0,

    adjustConcurrency(ok) {
      if (ok) { this.errorStreak = 0; this.concurrency = Math.min(this.maxConcurrency, this.concurrency + 1); }
      else { this.errorStreak++; if (this.errorStreak >= 2) this.concurrency = Math.max(this.minConcurrency, Math.floor(this.concurrency / 2)); }
      log('concurrency:', this.concurrency, 'errorStreak:', this.errorStreak);
    },
    getCacheKey(text, from, to) { const t = text.length > 200 ? text.slice(0, 200) + '…' : text; return `${from}|${to}|${t}`; },
    setCache(key, val) { if (this.cache.size >= this.maxCacheSize) { const first = this.cache.keys().next().value; this.cache.delete(first); } this.cache.set(key, val); },

    async translate(text, from, to) {
      if (!LanguageDetector.shouldTranslate(text, to)) return text;
      const key = this.getCacheKey(text, from, to);
      if (this.cache.has(key)) return this.cache.get(key);
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
      const exec = () => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET', url, timeout: 6000,
          onload: (res) => {
            try {
              if (res.status !== 200) return reject(new Error('HTTP ' + res.status));
              const data = JSON.parse(res.responseText);
              const out = data && data[0] ? data[0].map(i => i[0]).join('').trim() : '';
              if (!out) return reject(new Error('Empty result'));
              this.setCache(key, out); resolve(out);
            } catch { reject(new Error('Parse error')); }
          },
          onerror: () => reject(new Error('Network error')),
          ontimeout: () => reject(new Error('Timeout'))
        });
      });
      try { const r = await exec(); this.adjustConcurrency(true); return r; }
      catch (e1) {
        await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
        try { const r2 = await exec(); this.adjustConcurrency(true); return r2; }
        catch (e2) { this.adjustConcurrency(false); warn('translate failed:', e1.message, '->', e2.message); return text; }
      }
    },

    async translateBatch(items, from, to, onProgress) {
      const results = new Array(items.length);
      let done = 0;
      for (let i = 0; i < items.length; i += this.concurrency) {
        const batch = items.slice(i, i + this.concurrency);
        const promises = batch.map(async (item, idx) => {
          try {
            const res = await this.translate(item.text, from, to);
            results[i + idx] = { ...item, result: res, success: res !== item.text };
          } catch {
            results[i + idx] = { ...item, result: item.text, success: false };
          } finally {
            done++; onProgress && onProgress(done, items.length);
          }
        });
        await Promise.all(promises);
        if (i + this.concurrency < items.length) await new Promise(r => setTimeout(r, 20));
      }
      return results;
    }
  };

  class TranslationManager {
    constructor() { this.sourceLang = Storage.get(CONFIG.storage.sourceLang, 'auto'); this.targetLang = Storage.get(CONFIG.storage.targetLang, 'zh-Hans'); }
    setLanguages(src, tgt) { this.sourceLang = src; this.targetLang = tgt; Storage.set(CONFIG.storage.sourceLang, src); Storage.set(CONFIG.storage.targetLang, tgt); }
    async translateBatch(items, onProgress) { return GoogleTranslate.translateBatch(items, this.sourceLang, this.targetLang, onProgress); }
  }
  const translator = new TranslationManager();

  class ThemeManager {
    constructor() { this.theme = Storage.get(CONFIG.storage.theme, 'system'); this.apply(); this.watch(); }
    current() { return this.theme === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : this.theme; }
    apply() { document.documentElement.setAttribute('data-theme', this.current()); }
    set(t) { this.theme = t; Storage.set(CONFIG.storage.theme, t); this.apply(); }
    watch() { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (this.theme === 'system') this.apply(); }); }
  }
  const themeManager = new ThemeManager();

  class AutoTranslationManager {
    constructor() { this.autoSites = Storage.get(CONFIG.storage.autoSites, 'youtube.com,github.com,x.com,twitter.com,reddit.com'); this.domain = location.hostname; this.shouldAuto = this.check(); }
    check() { const sites = this.autoSites.split(',').map(s => s.trim()).filter(Boolean); return sites.some(site => matchDomain(this.domain, site)); }
    setSites(s) { this.autoSites = s; Storage.set(CONFIG.storage.autoSites, s); this.shouldAuto = this.check(); }
    getSites() { return this.autoSites; }
  }
  const autoMgr = new AutoTranslationManager();

  class ViewportObserver {
    constructor(cb) { this.cb = cb; this.observer = new IntersectionObserver((ents) => { const visible = ents.filter(e => e.isIntersecting).map(e => e.target); if (visible.length) this.cb(visible); }, { rootMargin: '100px', threshold: 0.1 }); }
    observe(elems) { elems.forEach(el => { if (!el.hasAttribute('data-observed')) { this.observer.observe(el); el.setAttribute('data-observed', 'true'); } }); }
    disconnect() { this.observer && this.observer.disconnect(); }
  }

  // Non-destructive apply: wrap + hide original children visually, mark processed
  function markProcessed(el) { el.setAttribute('data-st-processed', '1'); }
  function isProcessed(el) { return el.hasAttribute('data-st-processed') || el.querySelector('.translation-wrapper'); }

  class ContentProcessor {
    constructor() { this.viewport = new ViewportObserver(els => this.translateVisible(els)); this.processed = new Set(); this.setupDynamic(); }
    setupDynamic() {
      let timer = null;
      const mo = new MutationObserver((muts) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const added = [];
          muts.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) added.push(...this.findInNode(n)); }));
          if (added.length) {
            const visible = added.filter(i => this.inViewport(i.element));
            if (visible.length) this.translateVisible(visible.map(i => i.element));
            this.viewport.observe(added.map(i => i.element));
          }
        }, 100);
      });
      mo.observe(document.body, { childList: true, subtree: true });
      let scrollTimer = null;
      addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(() => { const vis = this.visibleUntranslated(); if (vis.length) this.translateVisible(vis); }, 160); }, { passive: true });
    }
    selectorsByDomain() {
      const d = location.hostname;
      const map = {
        'youtube.com': ['#video-title h1'], // subtitles handled separately
        'x.com': ['[data-testid="tweetText"]'],
        'twitter.com': ['[data-testid="tweetText"]'],
        'github.com': ['.markdown-body h1', '.markdown-body h2', '.markdown-body h3', '.markdown-body p'],
        'reddit.com': [
          'h1._eYtD2XCVieq6emjKBH3m',
          'h1[data-click-id="title"]',
          '.RichTextJSON-root p',
          'div[data-click-id="text"] p',
          '._1qeIAgB0cPwnLhDF9XSiJM p',
          '.Comment p',
          '[data-testid="comment"] p'
        ],
        'default': [
          'article h1', 'article h2', 'article p',
          'main h1', 'main h2', 'main p',
          '.markdown-body h1', '.markdown-body h2', '.markdown-body p',
          '.prose p', '.entry-content p', '.post-content p'
        ]
      };
      const key = Object.keys(map).find(k => matchDomain(d, k)) || 'default';
      return map[key];
    }
    extractText(el) {
      if (el.querySelector('.translation-wrapper')) return '';
      const text = (el.textContent || '').trim();
      if (text.length < 5) return '';
      if (/^[\d\s\p{P}]+$/u.test(text)) return '';
      return text;
    }
    findInNode(node) {
      const out = [];
      const sels = this.selectorsByDomain();
      sels.forEach(sel => {
        try {
          const found = node.querySelectorAll ? node.querySelectorAll(sel) : [];
          found.forEach(el => {
            if (this.processed.has(el) || isProcessed(el) || el.hasAttribute('data-translated')) return;
            if (isInDisallowedRegion(el)) return;
            const t = this.extractText(el);
            if (t && LanguageDetector.shouldTranslate(t, translator.targetLang)) {
              out.push({ element: el, text: t, selector: sel });
              this.processed.add(el);
            }
          });
        } catch (e) { warn('selector error', sel, e); }
      });
      return out;
    }
    collectAll() {
      const out = [];
      const sels = this.selectorsByDomain();
      sels.forEach(sel => {
        try {
          const found = scopedQueryAll(sel);
          found.forEach(el => {
            if (this.processed.has(el) || isProcessed(el) || el.hasAttribute('data-translated')) return;
            if (isInDisallowedRegion(el)) return;
            const t = this.extractText(el);
            if (t && LanguageDetector.shouldTranslate(t, translator.targetLang)) {
              out.push({ element: el, text: t, selector: sel });
              this.processed.add(el);
            }
          });
        } catch (e) { warn('selector error', sel, e); }
      });
      return out;
    }
    collectViewport() { const items = this.collectAll(); this.viewport.observe(items.map(i => i.element)); return items.filter(i => this.inViewport(i.element)); }
    inViewport(el) { const r = el.getBoundingClientRect(); return r.top >= -100 && r.left >= 0 && r.bottom <= (innerHeight + 100) && r.right <= innerWidth; }
    visibleUntranslated() {
      const els = [];
      this.selectorsByDomain().forEach(sel => {
        try {
          scopedQueryAll(sel).forEach(el => {
            if (el.hasAttribute('data-translated')) return;
            if (isProcessed(el)) return;
            if (isInDisallowedRegion(el)) return;
            if (!this.inViewport(el)) return;
            const t = this.extractText(el);
            if (t && LanguageDetector.shouldTranslate(t, translator.targetLang)) els.push(el);
          });
        } catch (e) {}
      });
      return els;
    }
    async translateVisible(elems) {
      const items = elems
        .filter(el => this.inViewport(el))
        .filter(el => !el.hasAttribute('data-translated') && !isProcessed(el) && !isInDisallowedRegion(el))
        .map(el => { const t = this.extractText(el); return t && LanguageDetector.shouldTranslate(t, translator.targetLang) ? { element: el, text: t } : null; })
        .filter(Boolean);
      if (!items.length) return;
      const res = await translator.translateBatch(items);
      res.forEach(r => { try { if (r.success && r.text.trim() !== r.result.trim()) this.apply(r.element, r.text, r.result); } catch (e) { warn('apply failed', e); } });
    }
    apply(el, originalText, translatedText) {
      if (el.hasAttribute('data-translated')) return;
      if (isProcessed(el)) return;
      if (originalText === translatedText) return;

      // Create a visible translation wrapper and hide original children
      const wrapper = document.createElement('div');
      wrapper.className = 'translation-wrapper';

      const pair = document.createElement('div');
      pair.className = 'translation-pair';
      const o = document.createElement('div'); o.className = 'original-text'; o.textContent = originalText;
      const t = document.createElement('div'); t.className = 'translated-text'; t.textContent = translatedText;
      pair.appendChild(o); pair.appendChild(t);
      wrapper.appendChild(pair);

      // Hide original children visually without destroying layout
      const originalHost = document.createElement('div');
      originalHost.className = 'st-original-host';
      while (el.firstChild) originalHost.appendChild(el.firstChild);
      el.appendChild(originalHost);
      el.appendChild(wrapper);

      el.setAttribute('data-translated', 'true');
      markProcessed(el);
    }
    restore() {
      document.querySelectorAll('[data-translated]').forEach(el => {
        const wrapper = el.querySelector('.translation-wrapper');
        const host = el.querySelector('.st-original-host');
        if (wrapper) wrapper.remove();
        if (host) {
          const frag = document.createDocumentFragment();
          while (host.firstChild) frag.appendChild(host.firstChild);
          el.insertBefore(frag, el.firstChild);
          host.remove();
        }
        el.removeAttribute('data-translated');
        el.removeAttribute('data-st-processed');
        el.removeAttribute('data-observed');
      });
      this.processed.clear();
      this.viewport.disconnect();
      this.viewport = new ViewportObserver(els => this.translateVisible(els));
      this.setupDynamic();
    }
  }
  const processor = new ContentProcessor();

  // YouTube subtitles (safe DOM, two-line layout)
  class YouTubeSubtitleManager {
    constructor() { this.enabled = Storage.get(CONFIG.storage.youtubeSubtitle, true); this.observer = null; this.setup(); }
    setup() {
      if (!location.hostname.includes('youtube.com')) return;
      const mo = new MutationObserver(muts => { muts.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1 && n.matches('.ytp-caption-segment')) this.translate(n); })); });
      mo.observe(document.body, { childList: true, subtree: true });
      this.observer = mo;
    }
    async translate(seg) {
      if (!this.enabled || seg.hasAttribute('data-translated')) return;
      const text = (seg.textContent || '').trim();
      if (!LanguageDetector.shouldTranslate(text, translator.targetLang)) return;
      try {
        const out = await GoogleTranslate.translate(text, 'auto', translator.targetLang);
        if (out && out !== text) this.apply(seg, text, out);
      } catch (e) { warn('subtitle translate failed', e); }
    }
    apply(el, orig, trans) {
      if (el.hasAttribute('data-translated')) return;
      el.setAttribute('data-translated', 'true');
      el.innerHTML = '';
      const line1 = document.createElement('div'); line1.className = 'subtitle-original'; line1.textContent = orig; el.appendChild(line1);
      const line2 = document.createElement('div'); line2.className = 'subtitle-translation'; line2.textContent = trans; el.appendChild(line2);
    }
    setEnabled(v) { this.enabled = v; Storage.set(CONFIG.storage.youtubeSubtitle, v); }
    disconnect() { this.observer && this.observer.disconnect(); }
  }
  const ytSub = new YouTubeSubtitleManager();

  // Shortcut
  class ShortcutManager {
    constructor() { this.shortcut = Storage.get(CONFIG.storage.shortcut, 'Alt+KeyW'); this.isTranslated = false; this.bind(); }
    bind() {
      const handler = async (e) => {
        const combo = this.normalize(e);
        if (combo === this.shortcut) {
          e.preventDefault(); e.stopImmediatePropagation();
          const fab = document.querySelector('#translatorFab'); fab && fab.classList.add('st-rotating');
          try { if (document.querySelector('[data-translated], .translation-wrapper')) { processor.restore(); this.isTranslated = false; } else { await performDirect(); this.isTranslated = true; } }
          finally { fab && fab.classList.remove('st-rotating'); }
          return false;
        }
      };
      document.addEventListener('keydown', handler, true);
      window.addEventListener('keydown', handler, true);
    }
    normalize(e) {
      const mods = [];
      if (e.altKey) mods.push('Alt');
      if (e.ctrlKey) mods.push('Ctrl');
      if (e.metaKey) mods.push('Meta');
      if (e.shiftKey) mods.push('Shift');
      const code = e.code || '';
      if (code) mods.push(code);
      return mods.join('+');
    }
    setShortcut(s) { this.shortcut = s; Storage.set(CONFIG.storage.shortcut, s); }
  }
  const shortcut = new ShortcutManager();

  // UI
  function injectStyles() {
    GM_addStyle(`
:root{--st-bg:#fff;--st-text:#1a1a1a;--st-border:#e1e5e9;--st-primary:#3b82f6;--st-primary-hover:#2563eb;--st-secondary:#f3f4f6;--st-secondary-hover:#e5e7eb;--st-input-bg:#fff;--st-shadow:rgba(0,0,0,.15);--st-accent:#10b981;--st-original-opacity:0.85}
[data-theme="dark"]{--st-bg:#1f2937;--st-text:#f9fafb;--st-border:#374151;--st-primary:#60a5fa;--st-primary-hover:#3b82f6;--st-secondary:#374151;--st-secondary-hover:#4b5563;--st-input-bg:#111827;--st-shadow:rgba(0,0,0,.3);--st-accent:#34d399}
.smart-translator-ui{position:fixed;top:50%;right:20px;transform:translateY(-50%);z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;direction:ltr;display:flex;flex-direction:column;align-items:flex-end}
.smart-translator-ui.hidden{display:none}
.translator-fab{width:56px;height:56px;background:linear-gradient(135deg,var(--st-primary) 0%,var(--st-accent) 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;cursor:pointer;box-shadow:0 4px 16px rgba(59,130,246,.4);transition:all .3s cubic-bezier(.4,0,.2,1);margin-bottom:12px}
.translator-fab:hover{transform:scale(1.1);box-shadow:0 8px 25px rgba(59,130,246,.6)}
.translator-fab.st-rotating{animation:st-rotate 1s linear infinite}
@keyframes st-rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.fab-icon{font-size:24px}
.translator-panel{width:400px;background:var(--st-bg);color:var(--st-text);border-radius:16px;box-shadow:0 12px 40px var(--st-shadow);border:1px solid var(--st-border);opacity:0;transform:translateY(-50%) translateX(20px) scale(.9);transition:all .3s cubic-bezier(.4,0,.2,1);pointer-events:none;position:absolute;right:70px;top:50%;z-index:2147483648;backdrop-filter:blur(10px)}
.translator-panel.active{opacity:1;transform:translateY(-50%) translateX(0) scale(1);pointer-events:auto}
.panel-header{padding:16px 20px 12px;border-bottom:1px solid var(--st-border);display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,var(--st-primary),var(--st-accent));color:#fff;border-radius:16px 16px 0 0}
.panel-header h3{margin:0;font-size:18px;font-weight:600;color:#fff;flex:1}
.close-btn{background:rgba(255,255,255,.2);border:none;font-size:16px;cursor:pointer;color:#fff;padding:0;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:all .2s ease}
.close-btn:hover{background:rgba(255,255,255,.3);transform:scale(1.1)}
.panel-content{padding:18px}
.theme-section,.language-section,.shortcut-section,.opacity-section,.auto-sites-section,.youtube-section,.toggle-section,.action-section{margin-bottom:16px}
label{display:block;margin-bottom:6px;font-weight:500;color:var(--st-text);font-size:13px}
input[type=text],textarea,input[type=range]{width:100%;padding:10px 14px;background:var(--st-input-bg);border:2px solid var(--st-border);border-radius:12px;font-size:14px;color:var(--st-text);transition:all .3s ease;box-sizing:border-box;font-family:inherit}
input[type=range]{padding:8px 10px}
input[type=text]:focus,textarea:focus,input[type=range]:focus{outline:none;border-color:var(--st-primary);box-shadow:0 0 0 3px rgba(59,130,246,.1)}
textarea{resize:vertical;min-height:60px}
.auto-sites-section small{display:block;margin-top:4px;font-size:12px;color:var(--st-text);opacity:.6}
.modern-dropdown{position:relative}
.dropdown-trigger{width:100%;padding:12px 16px;background:linear-gradient(135deg,var(--st-input-bg) 0%,var(--st-secondary) 100%);border:2px solid var(--st-border);border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .3s ease;box-sizing:border-box}
.dropdown-trigger:hover{border-color:var(--st-primary);box-shadow:0 4px 12px rgba(59,130,246,.15);transform:translateY(-1px)}
.selected-option{display:flex;align-items:center;gap:8px}
.option-flag{font-size:16px}
.option-text{font-size:14px;color:var(--st-text);font-weight:500}
.dropdown-arrow{font-size:12px;color:var(--st-text);opacity:.6;transition:transform .3s ease}
.modern-dropdown.open .dropdown-arrow{transform:rotate(180deg)}
.dropdown-menu{position:absolute;top:calc(100% + 4px);left:0;right:0;background:var(--st-bg);border:2px solid var(--st-border);border-radius:12px;box-shadow:0 8px 32px var(--st-shadow);opacity:0;visibility:hidden;transform:translateY(-8px);transition:all .3s cubic-bezier(.4,0,.2,1);z-index:1000;max-height:240px;overflow-y:auto}
.modern-dropdown.open .dropdown-menu{opacity:1;visibility:visible;transform:translateY(0)}
.dropdown-option{padding:12px 16px;display:flex;align-items:center;gap:8px;cursor:pointer;transition:all .2s ease;border-radius:8px;margin:4px}
.dropdown-option:hover{background:var(--st-secondary);transform:translateX(4px)}
.dropdown-option.selected{background:linear-gradient(135deg,var(--st-primary),var(--st-accent));color:#fff}
.dropdown-option.selected .option-text{color:#fff}
.check-mark{margin-left:auto;font-size:14px;font-weight:700}
.language-row{display:flex;align-items:center;gap:12px}
.language-row>div{flex:1}
.arrow{color:var(--st-primary);font-weight:700;font-size:18px}
.toggle-container{display:flex;align-items:center;justify-content:space-between;cursor:pointer;margin-bottom:0;padding:10px 14px;background:var(--st-secondary);border-radius:12px;transition:all .3s ease}
.toggle-container:hover{background:var(--st-secondary-hover)}
.toggle-container input[type=checkbox]{display:none}
.toggle-slider{width:56px;height:30px;background:var(--st-border);border-radius:15px;position:relative;transition:all .3s ease}
.toggle-slider::before{content:"";position:absolute;width:24px;height:24px;border-radius:50%;background:#fff;top:3px;left:3px;transition:all .3s ease;box-shadow:0 2px 6px rgba(0,0,0,.2)}
.toggle-container input[type=checkbox]:checked + .toggle-slider{background:var(--st-primary)}
.toggle-container input[type=checkbox]:checked + .toggle-slider::before{transform:translateX(26px)}
.translate-btn,.restore-btn{width:100%;padding:12px 18px;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;transition:all .3s ease;margin-bottom:12px;display:flex;align-items:center;justify-content:center;gap:8px}
.translate-btn{background:linear-gradient(135deg,var(--st-primary),var(--st-accent));color:#fff;box-shadow:0 4px 16px rgba(59,130,246,.3)}
.translate-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(59,130,246,.4)}
.translate-btn:disabled{background:#9ca3af;cursor:not-allowed;transform:none;box-shadow:none}
.restore-btn{background:var(--st-secondary);color:var(--st-text);border:2px solid var(--st-border)}
.restore-btn:hover{background:var(--st-secondary-hover);transform:translateY(-1px);border-color:var(--st-primary)}
.status-section{margin-top:20px;padding-top:20px;border-top:1px solid var(--st-border)}
#statusText{text-align:center;font-size:13px;color:var(--st-text);opacity:.8;margin-bottom:8px}
.progress-bar{width:100%;height:4px;background:var(--st-secondary);border-radius:2px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--st-primary),var(--st-accent));width:0;transition:width .3s ease}
.translation-wrapper{position:relative}
.st-original-host{visibility:hidden;height:0;overflow:hidden}
.original-text{color:#6b7280;font-style:italic;font-size:.9em;line-height:1.45;margin-bottom:4px;opacity:var(--st-original-opacity)}
[data-theme="dark"] .original-text{color:rgba(229,231,235,0.92);text-shadow:0 0 1px rgba(0,0,0,0.6)}
.translated-text{color:var(--st-text);font-weight:500;line-height:1.55;font-size:1em}
/* YouTube subtitles two-line layout */
.ytp-caption-segment .subtitle-original,.ytp-caption-segment .subtitle-translation{display:block !important}
.subtitle-original{color:rgba(255,255,255,.92);font-size:1em;margin-bottom:2px;line-height:1.25;text-shadow:1px 1px 2px rgba(0,0,0,.85)}
.subtitle-translation{color:#ffed4a;font-weight:600;font-size:1.06em;line-height:1.25;text-shadow:1px 1px 3px rgba(0,0,0,.9)}
@media (max-width:480px){.translator-panel{width:360px;right:10px}.smart-translator-ui{right:10px}.translator-fab{width:50px;height:50px}}
`);
  }

  function createUI() {
    const ui = document.createElement('div');
    ui.className = 'smart-translator-ui';
    ui.innerHTML = `
      <div class="translator-fab" id="translatorFab"><span class="fab-icon">🌐</span></div>
      <div class="translator-panel" id="translatorPanel">
        <div class="panel-header"><button class="close-btn" id="closeBtn">×</button><h3>Smart Translator</h3></div>
        <div class="panel-content">
          <div class="theme-section"><label>Theme:</label><div id="themeDropdown"></div></div>
          <div class="language-section"><label>Translation:</label><div class="language-row"><div id="sourceDropdown"></div><span class="arrow">→</span><div id="targetDropdown"></div></div></div>
          <div class="shortcut-section"><label>Shortcut:</label><input type="text" id="shortcutInput" placeholder="Alt+KeyW" value="${Storage.get(CONFIG.storage.shortcut, 'Alt+KeyW')}"></div>
          <div class="opacity-section"><label>Original text opacity:</label><input type="range" id="originalOpacity" min="0.4" max="0.9" step="0.05"><small>Adjust how faint the original text looks (40%–90%).</small></div>
          <div class="auto-sites-section"><label>Auto-translate sites:</label><textarea id="autoSitesInput" rows="2">${autoMgr.getSites()}</textarea><small>Comma-separated domains. Match equals or suffix (e.g. example.com).</small></div>
          <div class="youtube-section"><label class="toggle-container"><span>YouTube Subtitle Translation</span><input type="checkbox" id="youtubeSubtitleToggle" ${Storage.get(CONFIG.storage.youtubeSubtitle, true) ? 'checked' : ''}><span class="toggle-slider"></span></label></div>
          <div class="toggle-section"><label class="toggle-container"><span>Show Translator Icon</span><input type="checkbox" id="showIconToggle" checked><span class="toggle-slider"></span></label></div>
          <div class="action-section"><button id="translateBtn" class="translate-btn"><span>Smart Translate</span></button><button id="restoreBtn" class="restore-btn"><span>Restore Original</span></button></div>
          <div class="status-section"><div id="statusText">Smart Translation Ready</div><div id="progressBar" class="progress-bar" style="display:none;"><div class="progress-fill"></div></div></div>
        </div>
      </div>`;
    document.body.appendChild(ui);
    return ui;
  }

  class ModernDropdown {
    constructor(container, options, value, onChange) { this.container = container; this.options = options; this.value = value; this.onChange = onChange; this.opened = false; this.render(); }
    render() {
      const selected = this.options.find(o => o.code === this.value);
      this.container.innerHTML = `
        <div class="modern-dropdown">
          <div class="dropdown-trigger"><span class="selected-option"><span class="option-flag">${selected?.flag || '🌐'}</span><span class="option-text">${selected?.name || 'Select'}</span></span><span class="dropdown-arrow">▼</span></div>
          <div class="dropdown-menu">
            ${this.options.map(o => `<div class="dropdown-option ${o.code === this.value ? 'selected' : ''}" data-value="${o.code}"><span class="option-flag">${o.flag}</span><span class="option-text">${o.name}</span>${o.code === this.value ? '<span class="check-mark">✓</span>' : ''}</div>`).join('')}
          </div>
        </div>`;
      this.bind();
    }
    bind() {
      const trigger = this.container.querySelector('.dropdown-trigger');
      const menu = this.container.querySelector('.dropdown-menu');
      trigger.addEventListener('click', () => this.toggle());
      menu.addEventListener('click', (e) => { const opt = e.target.closest('.dropdown-option'); if (opt) { const v = opt.dataset.value; this.set(v); this.close(); this.onChange && this.onChange(v); } });
      document.addEventListener('click', (e) => { if (!this.container.contains(e.target)) this.close(); });
    }
    toggle() { this.opened ? this.close() : this.open(); }
    open() { this.opened = true; this.container.querySelector('.modern-dropdown').classList.add('open'); }
    close() { this.opened = false; this.container.querySelector('.modern-dropdown').classList.remove('open'); }
    set(v) { this.value = v; this.render(); }
  }

  function setupUIEvents(ui) {
    const fab = ui.querySelector('#translatorFab');
    const panel = ui.querySelector('#translatorPanel');
    const closeBtn = ui.querySelector('#closeBtn');
    const showIconToggle = ui.querySelector('#showIconToggle');
    const shortcutInput = ui.querySelector('#shortcutInput');
    const autoSitesInput = ui.querySelector('#autoSitesInput');
    const youtubeSubtitleToggle = ui.querySelector('#youtubeSubtitleToggle');
    const translateBtn = ui.querySelector('#translateBtn');
    const restoreBtn = ui.querySelector('#restoreBtn');
    const statusText = ui.querySelector('#statusText');

    showIconToggle.checked = Storage.get(CONFIG.storage.showIcon, true);

    const themeOptions = [
      { code: 'system', name: 'Follow System', flag: '🌓' },
      { code: 'light', name: 'Light Mode', flag: '☀️' },
      { code: 'dark', name: 'Dark Mode', flag: '🌙' }
    ];

    new ModernDropdown(ui.querySelector('#themeDropdown'), themeOptions, themeManager.theme, v => themeManager.set(v));
    new ModernDropdown(ui.querySelector('#sourceDropdown'), CONFIG.languages, translator.sourceLang, v => translator.setLanguages(v, translator.targetLang));
    new ModernDropdown(ui.querySelector('#targetDropdown'), CONFIG.languages.filter(l => l.code !== 'auto'), translator.targetLang, v => translator.setLanguages(translator.sourceLang, v));

    fab.addEventListener('click', () => panel.classList.toggle('active'));
    closeBtn.addEventListener('click', () => panel.classList.remove('active'));

    showIconToggle.addEventListener('change', () => { const show = showIconToggle.checked; Storage.set(CONFIG.storage.showIcon, show); ui.classList.toggle('hidden', !show); });

    // Shortcut capture
    shortcutInput.addEventListener('keydown', (e) => {
      e.preventDefault();
      const mods = [];
      if (e.altKey) mods.push('Alt');
      if (e.ctrlKey) mods.push('Ctrl');
      if (e.metaKey) mods.push('Meta');
      if (e.shiftKey) mods.push('Shift');
      const code = e.code || '';
      if (code) mods.push(code);
      const combo = mods.join('+');
      if (combo) { shortcutInput.value = combo; shortcut.setShortcut(combo); }
    });

    // Original opacity control
    const opacityInput = ui.querySelector('#originalOpacity');
    const storedOpacity = Storage.get(CONFIG.storage.originalOpacity, 0.85);
    opacityInput.value = storedOpacity;
    document.documentElement.style.setProperty('--st-original-opacity', storedOpacity);
    opacityInput.addEventListener('input', () => {
      const v = parseFloat(opacityInput.value);
      Storage.set(CONFIG.storage.originalOpacity, v);
      document.documentElement.style.setProperty('--st-original-opacity', v);
    });

    autoSitesInput.addEventListener('input', () => { autoMgr.setSites(autoSitesInput.value.trim()); });
    youtubeSubtitleToggle.addEventListener('change', () => ytSub.setEnabled(youtubeSubtitleToggle.checked));

    translateBtn.addEventListener('click', async () => {
      const f = document.querySelector('#translatorFab'); f && f.classList.add('st-rotating');
      try { await performSmart(translateBtn, statusText); }
      finally { f && f.classList.remove('st-rotating'); }
    });

    restoreBtn.addEventListener('click', () => {
      const f = document.querySelector('#translatorFab'); f && f.classList.add('st-rotating');
      try { processor.restore(); statusText.textContent = 'Original text restored'; }
      finally { f && f.classList.remove('st-rotating'); }
    });

    if (!showIconToggle.checked) ui.classList.add('hidden');

    setTimeout(initAutoTranslation, 600);
  }

  async function performSmart(button, statusEl) {
    const items = processor.collectViewport();
    if (!items.length) { statusEl.textContent = 'No translatable content found'; return; }
    button.disabled = true; button.querySelector('span:last-child').textContent = 'Translating...'; statusEl.textContent = 'Analyzing content...';
    const bar = document.querySelector('#progressBar'); const fill = document.querySelector('.progress-fill'); bar.style.display = 'block';
    try {
      const res = await translator.translateBatch(items, (done, total) => { const pct = Math.round(done / total * 100); statusEl.textContent = `Progress: ${done}/${total} (${pct}%)`; fill.style.width = pct + '%'; });
      let ok = 0, skip = 0; res.forEach(r => { if (r.success && r.text !== r.result) { processor.apply(r.element, r.text, r.result); ok++; } else skip++; });
      statusEl.textContent = `Completed: ${ok} translated${skip ? `, ${skip} skipped` : ''}`; fill.style.width = '100%';
    } catch (e) { statusEl.textContent = `Translation failed: ${e.message}`; }
    finally { setTimeout(() => { document.querySelector('#progressBar').style.display = 'none'; document.querySelector('.progress-fill').style.width = '0%'; }, 1500); button.disabled = false; button.querySelector('span:last-child').textContent = 'Smart Translate'; }
  }

  function initAutoTranslation() {
    if (!autoMgr.shouldAuto) return;
    const start = () => setTimeout(() => { performDirect().catch(() => {}); }, 1200);
    if (document.readyState === 'complete') start();
    else if (document.readyState === 'interactive') addEventListener('load', start);
    else document.addEventListener('DOMContentLoaded', () => addEventListener('load', start));
  }

  async function performDirect() {
    const items = processor.collectViewport();
    if (!items.length) { const all = processor.collectAll(); await translateElements(all.slice(0, 24)); }
    else { await translateElements(items); }
  }

  async function translateElements(items) {
    if (!items.length) { showStatus('未找到需要翻译的内容'); return; }
    const res = await translator.translateBatch(items);
    let ok = 0; res.forEach(r => { try { if (r.success && r.text.trim() !== r.result.trim()) { processor.apply(r.element, r.text, r.result); ok++; } } catch (e) { warn('apply error', e); } });
    showStatus(ok > 0 ? `翻译完成: ${ok} 个元素` : '未找到需要翻译的内容');
  }

  function showStatus(msg) { const el = document.querySelector('#statusText'); if (el) el.textContent = msg; else log('Status:', msg); }

  function init() { injectStyles(); const ui = createUI(); setupUIEvents(ui); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else setTimeout(init, 100);
})();
