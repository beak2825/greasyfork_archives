// ==UserScript==
// @name         eBay UI Enhancer v5.8 – Cleaned, Optimized, and Turbocharged
// @namespace    https://greasyfork.org/users/Eliminater74
// @version      5.8
// @description  Major upgrade: removes off-topic ads, adds dark & compact modes, keyword filtering, seller badges, import/export, draggable neon UI — built for performance and customization. Price chart support coming soon.
// @author       Eliminater74
// @license      MIT
// @match        https://www.ebay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538248/eBay%20UI%20Enhancer%20v58%20%E2%80%93%20Cleaned%2C%20Optimized%2C%20and%20Turbocharged.user.js
// @updateURL https://update.greasyfork.org/scripts/538248/eBay%20UI%20Enhancer%20v58%20%E2%80%93%20Cleaned%2C%20Optimized%2C%20and%20Turbocharged.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SETTINGS_KEY = 'ebayEnhancerSettings';
  const POSITION_KEY = 'ebayEnhancerGearPosition';
  const PRICE_CACHE_KEY = 'ebayPriceCache';

  const defaultSettings = {
    darkMode: false,
    compactView: false,
    hideAds: true,
    hideOffTopicAds: true,
    highlightTopSellers: true,
    keywordFilter: true,
    showPriceStats: true,
    performanceMode: false,
    debug: false
  };

  let settings = { ...defaultSettings, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) };
  let priceCache = JSON.parse(localStorage.getItem(PRICE_CACHE_KEY) || '{}');
  const log = (...args) => settings.debug && console.log('[eBay Enhancer]', ...args);
  const saveSettings = () => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

  function injectUI() {
    if (document.getElementById('ebay-enhancer-gear')) return;

    const gear = document.createElement('div');
    gear.id = 'ebay-enhancer-gear';
    gear.innerHTML = '<div class="gear-icon"></div>';
    document.body.appendChild(gear);

    const saved = JSON.parse(localStorage.getItem(POSITION_KEY));
    if (saved) {
      gear.style.left = saved.left;
      gear.style.top = saved.top;
    }

    const panel = document.createElement('div');
    panel.id = 'ebay-enhancer-panel';
    panel.innerHTML = `
      ${Object.keys(defaultSettings).map(key =>
        `<label><input type="checkbox" id="${key}Toggle"> ${key.replace(/([A-Z])/g, ' $1')}</label><br>`
      ).join('')}
      <hr><button id="exportSettings">Export</button>
      <button id="importSettings">Import</button>
    `;
    document.body.appendChild(panel);

    panel.querySelectorAll('input[type="checkbox"]').forEach(input => {
      const key = input.id.replace('Toggle', '');
      input.checked = settings[key];
      input.addEventListener('change', () => {
        settings[key] = input.checked;
        saveSettings();
        applyEnhancements();
      });
    });

    document.getElementById('exportSettings').onclick = () => {
      const blob = new Blob([JSON.stringify(settings)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ebayEnhancerSettings.json';
      a.click();
    };

    document.getElementById('importSettings').onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = () => {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            settings = JSON.parse(e.target.result);
            saveSettings();
            location.reload();
          } catch {
            alert('Invalid settings file.');
          }
        };
        reader.readAsText(input.files[0]);
      };
      input.click();
    };

    gear.onclick = () => {
      panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    };

    const style = document.createElement('style');
    style.textContent = `
      #ebay-enhancer-gear {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 36px;
        height: 36px;
        background: black;
        border-radius: 50%;
        box-shadow: 0 0 10px #00f7ff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        cursor: grab;
      }
      .gear-icon {
        width: 20px;
        height: 20px;
        border: 2px solid #00f7ff;
        border-radius: 50%;
        animation: spin 2s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      #ebay-enhancer-panel {
        position: fixed;
        top: 70px;
        left: 20px;
        background: #111;
        color: #0ff;
        padding: 10px;
        border-radius: 10px;
        font-family: monospace;
        box-shadow: 0 0 10px #00f7ff;
        z-index: 99999;
        display: none;
      }
      #ebay-enhancer-panel label {
        display: block;
        margin-bottom: 4px;
      }
    `;
    document.head.appendChild(style);

    makeDraggable(gear, POSITION_KEY);
    makeDraggable(panel);
  }

  function makeDraggable(el, persistKey) {
    let offsetX = 0, offsetY = 0, dragging = false;
    el.addEventListener('mousedown', e => {
      dragging = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      el.style.cursor = 'grabbing';
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
    });
    document.addEventListener('mouseup', () => {
      dragging = false;
      el.style.cursor = 'grab';
      if (persistKey) localStorage.setItem(persistKey, JSON.stringify({ left: el.style.left, top: el.style.top }));
    });
  }

  function removeTopAdCarousels() {
    const killList = [];

    document.querySelectorAll('div[role="region"]').forEach(el => {
      if (el.innerText.includes('Shop store on eBay') && el.offsetTop < 300) killList.push(el);
    });

    document.querySelectorAll('div[id^="placement_"]').forEach(el => {
      if (el.offsetTop < 300 || el.innerText.includes('Sponsored')) killList.push(el);
    });

    document.querySelectorAll('.x-ebayui, .x-vds-carousel, .x-carousel-container').forEach(el => {
      if (el.offsetTop < 300 && el.innerText.includes('Shop store')) killList.push(el);
    });

    killList.forEach(el => {
      log('Removing persistent ad:', el);
      el.remove();
    });
  }

  function handlePriceBlock() {
    const titleNode = document.querySelector('#itemTitle');
    if (!titleNode) return;

    const priceNode = document.querySelector(
      '#prcIsum, [itemprop=price], .x-price-approx__price, .display-price, .x-price-approx__value, .x-price-primary span, [data-testid="x-bin-price"] .x-price-primary .ux-textspans'
    );
    if (!priceNode) {
      log('❌ Price element not found');
      return;
    }

    const title = titleNode.textContent.replace(/^Details about\s*/, '').trim();
    const key = title.toLowerCase();
    const price = parseFloat(priceNode.textContent.replace(/[^\d.]/g, ''));
    if (isNaN(price)) {
      log('❌ Price is not a number:', priceNode.textContent);
      return;
    }

    const history = priceCache[key] || [];
    const last = history.at(-1);
    const bars = ['▁','▂','▃','▄','▅','▆','▇','█'];
    let chart = '';
    if (history.length > 1) {
      const min = Math.min(...history);
      const max = Math.max(...history);
      const scale = n => Math.round(((n - min) / (max - min)) * 7);
      chart = history.map(p => bars[scale(p)]).join('');
    }

    const box = document.createElement('div');
    box.innerHTML = `
      <div style="margin-top:6px;font-size:13px;">
        Price History: ${chart || '—'}<br>
        <strong>Last:</strong> $${last ?? '—'}<br>
        <strong>Now:</strong> $${price.toFixed(2)}
      </div>
    `;
    priceNode.insertAdjacentElement('afterend', box);
    log('✅ Injected price chart below:', priceNode);

    if (!Array.isArray(history)) priceCache[key] = [];
    if (priceCache[key].at(-1) !== price) {
      priceCache[key].push(price);
      if (priceCache[key].length > 10) priceCache[key].shift();
      localStorage.setItem(PRICE_CACHE_KEY, JSON.stringify(priceCache));
    }
  }

  function applyEnhancements() {
    document.body.classList.toggle('ebay-dark-mode', settings.darkMode);
    document.body.classList.toggle('ebay-compact-mode', settings.compactView);

    if (settings.hideAds) {
      document.querySelectorAll('[data-testid="spnAd"], [aria-label="Sponsored"], .s-item__title--tagblock')
        .forEach(el => el.remove());
    }

    if (settings.hideOffTopicAds) {
      removeTopAdCarousels();
    }

    if (settings.highlightTopSellers) {
      document.querySelectorAll('.s-item__etrs-text, .s-item__etrs-badge').forEach(el => {
        el.style.backgroundColor = '#d4f7d4';
        el.style.borderRadius = '4px';
        el.style.padding = '2px 4px';
      });
    }

    if (settings.keywordFilter) {
      const blocked = ['broken', 'damaged', 'for parts'];
      document.querySelectorAll('.s-item').forEach(item => {
        const text = item.innerText.toLowerCase();
        if (blocked.some(term => text.includes(term))) item.remove();
      });
    }

    if (settings.showPriceStats) {
      handlePriceBlock();
    }
  }

  injectUI();
  const observer = new MutationObserver(applyEnhancements);
  observer.observe(document.body, { childList: true, subtree: true });
})();
