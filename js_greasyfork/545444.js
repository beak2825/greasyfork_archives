// ==UserScript==
// @name         Zed.City Theme Settings Alpha
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Floating theme settings menu for zed.city with invert colors, hue overlay, custom background, page title change, hide logo, hide stats, and reset options.
// @match        https://www.zed.city/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545444/ZedCity%20Theme%20Settings%20Alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/545444/ZedCity%20Theme%20Settings%20Alpha.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // --- Constants ---
  const LS_KEYS = {
    hideStats: 'zedHideStats',
    themeColor: 'zedThemeColor',
    invertColors: 'zedInvertColors',
    hideLogo: 'zedHideLogo',
    pageTitle: 'zedPageTitle',
    customBackground: 'zedCustomBackground',
    hueOverlayColor: 'zedHueOverlayColor',
    hueOverlayIntensity: 'zedHueOverlayIntensity',
    menuMinimized: 'zedMenuMinimized',
  };

  const DEFAULTS = {
    hideStats: false,
    themeColor: '#000000',
    invertColors: false,
    hideLogo: false,
    pageTitle: document.title || 'zed.city',
    customBackground: '',
    hueOverlayColor: '#ff69b4',
    hueOverlayIntensity: 0,
    menuMinimized: false,
  };

  // --- Utility functions ---
  function lsGet(key, def) {
    try {
      const val = localStorage.getItem(key);
      if (val === null || val === undefined) return def;
      if (typeof def === 'boolean') return val === 'true';
      if (typeof def === 'number') return Number(val) || def;
      return val;
    } catch {
      return def;
    }
  }
  function lsSet(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch {}
  }

  function el(tag, options = {}) {
    const e = document.createElement(tag);
    if (options.text) e.textContent = options.text;
    if (options.html) e.innerHTML = options.html;
    if (options.attrs) for (const [k,v] of Object.entries(options.attrs)) e.setAttribute(k,v);
    if (options.styles) for (const [k,v] of Object.entries(options.styles)) e.style[k] = v;
    if (options.classes) for (const c of options.classes) e.classList.add(c);
    if (options.events) for (const [k,v] of Object.entries(options.events)) e.addEventListener(k,v);
    return e;
  }

  // --- Apply functions ---
  function applyThemeColor(color) {
    document.documentElement.style.setProperty('--zed-theme-color', color);
    const buttons = document.querySelectorAll('button, a, input[type=button], input[type=submit]');
    buttons.forEach(btn => {
      btn.style.backgroundColor = color;
      btn.style.color = '#fff';
      btn.style.borderColor = color;
    });
  }
  function applyInvertColors(enabled) {
    if (enabled) {
      if (!document.getElementById('zedInvertStyle')) {
        const style = document.createElement('style');
        style.id = 'zedInvertStyle';
        style.textContent = `
          html {
            filter: invert(1) hue-rotate(180deg);
            background: black !important;
          }
          img, video, svg, picture, iframe, .no-invert {
            filter: invert(1) hue-rotate(180deg) !important;
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      const style = document.getElementById('zedInvertStyle');
      if (style) style.remove();
    }
  }
  function applyHideStats(hide) {
    const statsBars = document.querySelectorAll('.stats, header .stats, #stats, .top-stats');
    statsBars.forEach(el => el.style.display = hide ? 'none' : '');
  }
  function applyHideLogo(hide) {
    const logo = document.querySelector('header img.logo, .logo img, header .logo, .logo');
    if (logo) logo.style.display = hide ? 'none' : '';
  }
  function applyPageTitle(title) {
    document.title = title || DEFAULTS.pageTitle;
  }
  function applyCustomBackground(dataUrl) {
    if (dataUrl) {
      document.body.style.backgroundImage = `url(${dataUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundPosition = 'center center';
    } else {
      document.body.style.backgroundImage = '';
    }
  }
  function applyHueOverlay(color, intensity) {
    let overlay = document.getElementById('zedHueOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'zedHueOverlay';
      Object.assign(overlay.style, {
        pointerEvents: 'none',
        position: 'fixed',
        top: '0', left: '0',
        width: '100%',
        height: '100%',
        zIndex: '999999',
        mixBlendMode: 'overlay'
      });
      document.body.appendChild(overlay);
    }
    overlay.style.backgroundColor = color;
    overlay.style.opacity = intensity;
  }

  // --- Init ---
  window.addEventListener('load', () => {
    const menu = el('div', {
      styles: {
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#222',
        color: '#fff',
        padding: '10px',
        zIndex: 9999999,
        borderRadius: '5px',
        fontFamily: 'sans-serif',
        maxWidth: '250px'
      }
    });

    // Theme color picker
    const colorLabel = el('label', { text: ' Theme Color ' });
    const colorInput = el('input', {
      attrs: { type: 'color' },
      events: {
        input: e => {
          lsSet(LS_KEYS.themeColor, e.target.value);
          applyThemeColor(e.target.value);
        }
      }
    });
    colorLabel.prepend(colorInput);
    menu.appendChild(colorLabel);

    // Invert colors
    const invertLabel = el('label', { text: ' Invert Colors' });
    const invertCheckbox = el('input', {
      attrs: { type: 'checkbox' },
      events: {
        change: e => {
          lsSet(LS_KEYS.invertColors, e.target.checked);
          applyInvertColors(e.target.checked);
        }
      }
    });
    invertLabel.prepend(invertCheckbox);
    menu.appendChild(invertLabel);

    // Hide logo
    const hideLogoLabel = el('label', { text: ' Hide Logo' });
    const hideLogoCheckbox = el('input', {
      attrs: { type: 'checkbox' },
      events: {
        change: e => {
          lsSet(LS_KEYS.hideLogo, e.target.checked);
          applyHideLogo(e.target.checked);
        }
      }
    });
    hideLogoLabel.prepend(hideLogoCheckbox);
    menu.appendChild(hideLogoLabel);

    // Hide stats
    const hideStatsLabel = el('label', { text: ' Hide Stats' });
    const hideStatsCheckbox = el('input', {
      attrs: { type: 'checkbox' },
      events: {
        change: e => {
          lsSet(LS_KEYS.hideStats, e.target.checked);
          applyHideStats(e.target.checked);
        }
      }
    });
    hideStatsLabel.prepend(hideStatsCheckbox);
    menu.appendChild(hideStatsLabel);

    document.body.appendChild(menu);

    // Apply saved settings
    applyThemeColor(lsGet(LS_KEYS.themeColor, DEFAULTS.themeColor));
    invertCheckbox.checked = lsGet(LS_KEYS.invertColors, DEFAULTS.invertColors);
    hideLogoCheckbox.checked = lsGet(LS_KEYS.hideLogo, DEFAULTS.hideLogo);
    hideStatsCheckbox.checked = lsGet(LS_KEYS.hideStats, DEFAULTS.hideStats);
    applyInvertColors(invertCheckbox.checked);
    applyHideLogo(hideLogoCheckbox.checked);
    applyHideStats(hideStatsCheckbox.checked);
  });
})();
