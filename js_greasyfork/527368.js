// ==UserScript==
// @name         TransTweetX
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  TransTweetX offers precise, emoji‑friendly translations for Twitter/X feed and now automatically retranslates text revealed after hitting “Show more/Read more”.
// @author       Ian
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @downloadURL https://update.greasyfork.org/scripts/527368/TransTweetX.user.js
// @updateURL https://update.greasyfork.org/scripts/527368/TransTweetX.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*───────────────────────────
   *  CONFIGURATION
   *──────────────────────────*/
  const config = {
    tweetSelector: '[data-testid="tweetText"]',
    targetLang: 'zh-CN',
    skipLanguages: new Set(['zh-CN', 'zh-TW']),
    languages: {
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      'en': 'English',
      'ja': '日本語',
      'ru': 'Русский',
      'fr': 'Français',
      'de': 'Deutsch'
    },
    translationInterval: 100,
    maxRetry: 2,
    concurrentRequests: 3,
    baseDelay: 30,
    translationStyle: {
      color: 'inherit',
      fontSize: '0.9em',
      borderLeft: '2px solid #1da1f2',
      padding: '0 10px',
      margin: '4px 0',
      whiteSpace: 'pre-wrap',
      opacity: '0.8'
    },
    viewportPriority: {
      centerRadius: 200,
      updateInterval: 500,
      maxPriorityItems: 5
    }
  };

  /*───────────────────────────
   *  STATE
   *──────────────────────────*/
  let processingQueue = new Set();
  let requestQueue = [];
  let isTranslating = false;
  const visibleTweets = new Map();

  /*───────────────────────────
   *  UTILS
   *──────────────────────────*/
  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function translateAndDetectLanguage(text) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${config.targetLang}&dt=t&q=${encodeURIComponent(text)}`,
        onload: res => {
          try {
            const data = JSON.parse(res.responseText);
            const translated = data[0].map(i => i[0]).join('').trim();
            const detectedSourceLang = (data[2] || '').toLowerCase();
            resolve({ translated, detectedSourceLang });
          } catch {
            resolve({ translated: text, detectedSourceLang: '' });
          }
        },
        onerror: () => resolve({ translated: text, detectedSourceLang: '' })
      });
    });
  }

  async function translateTweet(tweet, text) {
    const { translated, detectedSourceLang } = await translateAndDetectLanguage(text);
    const lang = detectedSourceLang.toLowerCase();

    if (lang === config.targetLang.toLowerCase() || config.skipLanguages.has(lang)) {
      const container = tweet.nextElementSibling;
      if (container?.classList.contains('translation-container')) container.remove();
      return null;
    }

    return translated;
  }

  function extractPerfectText(tweet) {
    const clone = tweet.cloneNode(true);
    clone.querySelectorAll('a, button, [data-testid="card.wrapper"]').forEach(el => {
      // Preserve emoji links, drop the rest
      if (!el.innerHTML.match(/[\p{Extended_Pictographic}\p{Emoji_Component}]/gu)) el.remove();
    });
    clone.innerHTML = clone.innerHTML.replace(/<br\s*\/?>(?=\n?)/gi, '\n');
    return clone.textContent.replace(/[\u00A0\u200B]+/g, ' ').trim();
  }

  /*───────────────────────────
   *  TRANSLATION PIPELINE
   *──────────────────────────*/
  function createTranslationContainer() {
    const container = document.createElement('div');
    container.className = 'translation-container';
    Object.assign(container.style, config.translationStyle);
    container.innerHTML = '<div class="loading-spinner"></div>';
    return container;
  }

  function watchTweetChanges(tweet) {
    if (tweet.dataset.transWatcher) return; // already watching

    const observer = new MutationObserver(() => {
      const updatedText = extractPerfectText(tweet);
      if (!updatedText || tweet.dataset.lastOriginalText === updatedText) return;

      tweet.dataset.lastOriginalText = updatedText;
      const container = tweet.nextElementSibling;
      if (container?.classList.contains('translation-container')) {
        container.innerHTML = '<div class="loading-spinner"></div>';
      }

      // push to front so the user sees update quickly
      requestQueue.unshift({ tweet, text: updatedText, retryCount: 0 });
      processQueue();
    });

    observer.observe(tweet, { childList: true, characterData: true, subtree: true });
    tweet.dataset.transWatcher = 'true';
  }

  function processTweet(tweet) {
    if (processingQueue.has(tweet) || tweet.dataset.transProcessed) return;
    processingQueue.add(tweet);
    tweet.dataset.transProcessed = 'true';

    const originalText = extractPerfectText(tweet);
    if (!originalText) {
      processingQueue.delete(tweet);
      return;
    }

    // store text for change detection
    tweet.dataset.lastOriginalText = originalText;

    const container = createTranslationContainer();
    tweet.after(container);

    const distance = distanceToViewportCenter(tweet);
    const request = { tweet, text: originalText, retryCount: 0 };
    if (distance < config.viewportPriority.centerRadius) {
      requestQueue.unshift(request);
    } else {
      requestQueue.push(request);
    }

    watchTweetChanges(tweet);
    processQueue();
  }

  async function processQueue() {
    if (isTranslating || requestQueue.length === 0) return;
    isTranslating = true;

    // closest to viewport centre first
    requestQueue.sort((a, b) => distanceToViewportCenter(a.tweet) - distanceToViewportCenter(b.tweet));
    const batch = requestQueue.splice(0, config.concurrentRequests);

    await Promise.all(batch.map(async ({ tweet, text }) => {
      try {
        const translated = await translateTweet(tweet, text);
        if (translated) updateTranslation(tweet, translated);
      } catch {
        markTranslationFailed(tweet);
      } finally {
        processingQueue.delete(tweet);
      }
    }));

    isTranslating = false;
    if (requestQueue.length > 0) processQueue();
  }

  function updateTranslation(tweet, translated) {
    const container = tweet.nextElementSibling;
    if (container?.classList.contains('translation-container')) {
      container.innerHTML = translated.replace(/\n/g, '<br>');
    }
  }

  function markTranslationFailed(tweet) {
    const container = tweet.nextElementSibling;
    if (container?.classList.contains('translation-container')) {
      container.innerHTML = '<span style="color:red">翻译失败</span>';
    }
  }

  /*───────────────────────────
   *  VIEWPORT TRACKING
   *──────────────────────────*/
  function getElementCenter(el) {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function distanceToViewportCenter(el) {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const elCenter = visibleTweets.get(el) || getElementCenter(el);
    return Math.hypot(center.x - elCenter.x, center.y - elCenter.y);
  }

  function setupViewportTracker() {
    const update = () => {
      document.querySelectorAll(config.tweetSelector).forEach(tweet => {
        const rect = tweet.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          visibleTweets.set(tweet, getElementCenter(tweet));
        } else {
          visibleTweets.delete(tweet);
        }
      });
    };
    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    setInterval(update, config.viewportPriority.updateInterval);
  }

  /*───────────────────────────
   *  MUTATION OBSERVER (new tweets)
   *──────────────────────────*/
  function setupMutationObserver() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1) node.querySelectorAll(config.tweetSelector).forEach(processTweet);
        });
      });
    });
    observer.observe(document, { childList: true, subtree: true });
  }

  /*───────────────────────────
   *  CONTROL PANEL
   *──────────────────────────*/
  function initControlPanel() {
    const panelHTML = `
      <div id="trans-panel">
        <div id="trans-icon"><i class="fa-solid fa-language"></i></div>
        <div id="trans-menu">
          <div style="padding: 6px 12px; font-weight: bold">Target language</div>
          ${Object.entries(config.languages).map(([code, name]) => `
            <div class="lang-item target" data-lang="${code}">${name}</div>
          `).join('')}
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #ccc;">
          <div style="padding: 6px 12px; font-weight: bold">No translation of language</div>
          ${Object.entries(config.languages).map(([code, name]) => `
            <div class="lang-item skip ${config.skipLanguages.has(code) ? 'active' : ''}" data-skip="${code}">${name}</div>
          `).join('')}
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #trans-panel { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: sans-serif; }
      #trans-icon { width: 40px; height: 40px; border-radius: 50%; background: rgba(29, 161, 242, 0.9); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      #trans-icon:hover { transform: scale(1.1); }
      #trans-icon i { color: white; font-size: 20px; }
      #trans-menu { width: 180px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-radius: 12px; padding: 8px 0; margin-top: 10px; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
      #trans-menu.show { opacity: 1; visibility: visible; transform: translateY(0); }
      .lang-item { padding: 10px 16px; font-size: 14px; cursor: pointer; transition: background 0.2s; }
      .lang-item:hover { background: rgba(29,161,242,0.1); }
      .lang-item.target[data-lang="${config.targetLang}"] { color: #1da1f2; font-weight: bold; }
      .lang-item.skip.active { background: rgba(29,161,242,0.1); }
      .loading-spinner { width: 16px; height: 16px; border: 2px solid #ddd; border-top-color: #1da1f2; border-radius: 50%; animation: spin 1s linear infinite; margin: 5px; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    const icon = document.getElementById('trans-icon');
    const menu = document.getElementById('trans-menu');

    icon.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });

    document.querySelectorAll('.lang-item.target').forEach(item => {
      item.addEventListener('click', function () {
        config.targetLang = this.dataset.lang;
        refreshAllTranslations();
        menu.classList.remove('show');
        // update highlight
        document.querySelectorAll('.lang-item.target').forEach(li => li.style.color = '');
        this.style.color = '#1da1f2';
      });
    });

    document.querySelectorAll('.lang-item.skip').forEach(item => {
      item.addEventListener('click', function () {
        const lang = this.dataset.skip;
        if (config.skipLanguages.has(lang)) {
          config.skipLanguages.delete(lang);
          this.classList.remove('active');
        } else {
          config.skipLanguages.add(lang);
          this.classList.add('active');
        }
      });
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('#trans-panel')) menu.classList.remove('show');
    });
  }

  /*───────────────────────────
   *  REFRESH UTIL (when targetLang changed)
   *──────────────────────────*/
  function refreshAllTranslations() {
    document.querySelectorAll('.translation-container').forEach(el => el.remove());
    processingQueue.clear();
    requestQueue = [];
    document.querySelectorAll(config.tweetSelector).forEach(tweet => {
      delete tweet.dataset.transProcessed;
      processTweet(tweet);
    });
  }

  /*───────────────────────────
   *  INIT
   *──────────────────────────*/
  function init() {
    initControlPanel();
    setupViewportTracker();
    setupMutationObserver();
    document.querySelectorAll(config.tweetSelector).forEach(tweet => {
      visibleTweets.set(tweet, getElementCenter(tweet));
      processTweet(tweet);
    });
  }

  window.addEventListener('load', init);
  if (document.readyState === 'complete') init();
})();
