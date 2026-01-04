// ==UserScript==
// @name         Zed.City Theme Settings
// @namespace    http://tampermonkey.net/
// @version      1.1.8
// @description  Floating theme settings menu for zed.city with invert colors, hue overlay, custom background, page title change, hide logo, and reset options.
// @author       ChatGPT
// @match        https://www.zed.city/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545116/ZedCity%20Theme%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/545116/ZedCity%20Theme%20Settings.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // --- Constants ---
  const LS_KEYS = {
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
    themeColor: '#000000',
    invertColors: false,
    hideLogo: false,
    pageTitle: document.title || 'zed.city',
    customBackground: '',
    hueOverlayColor: '#ff69b4',
    hueOverlayIntensity: 0,
    menuMinimized: false,
  };

  // --- Utility functions for localStorage ---
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

  // --- Create elements helper ---
  function el(tag, options = {}) {
    const e = document.createElement(tag);
    if (options.text) e.textContent = options.text;
    if (options.html) e.innerHTML = options.html;
    if (options.attrs) {
      for (const [k,v] of Object.entries(options.attrs)) e.setAttribute(k,v);
    }
    if (options.styles) {
      for (const [k,v] of Object.entries(options.styles)) e.style[k] = v;
    }
    if (options.classes) {
      for (const c of options.classes) e.classList.add(c);
    }
    if (options.events) {
      for (const [k,v] of Object.entries(options.events)) e.addEventListener(k,v);
    }
    return e;
  }

  // --- Global variables ---
  let menu, minimizedBtn;
  let colorInput, invertCheckbox, hideLogoCheckbox, pageTitleInput, bgInput, hueColorInput, hueIntensityInput;
  let resetBtn, minimizeBtn;

  // --- Apply functions ---
  function applyThemeColor(color) {
    document.documentElement.style.setProperty('--zed-theme-color', color);
    // Change clickable buttons and minimize/minimized backgrounds
    const buttons = document.querySelectorAll('button, a, input[type=button], input[type=submit]');
    buttons.forEach(btn => {
      btn.style.backgroundColor = color;
      btn.style.color = '#fff';
      btn.style.borderColor = color;
    });
    if (minimizeBtn) minimizeBtn.style.backgroundColor = color;
    if (minimizedBtn) minimizedBtn.style.backgroundColor = color;
    if (hueIntensityInput) hueIntensityInput.style.accentColor = color;
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

  function applyHideLogo(hide) {
    // Try to find logo by typical selectors
    const logo = document.querySelector('header img.logo, .logo img, header .logo, .logo');
    if (logo) {
      logo.style.display = hide ? 'none' : '';
    }
  }

  function applyPageTitle(title) {
    if (!title) title = DEFAULTS.pageTitle;
    document.title = title;
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
    // Remove old overlay
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
        zIndex: '99999',
        mixBlendMode: 'hue',
        transition: 'background-color 0.3s ease',
      });
      document.body.appendChild(overlay);
    }
    if (intensity > 0) {
      overlay.style.backgroundColor = color;
      overlay.style.opacity = (intensity/100).toString();
      overlay.style.display = 'block';
    } else {
      overlay.style.display = 'none';
    }
  }

  // --- Build menu ---
  function buildMenu() {
    menu = el('div', {
      styles: {
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        width: '280px',
        backgroundColor: '#222',
        color: '#eee',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
        padding: '16px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        zIndex: '100000',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }
    });

    // Title
    const title = el('h2', { text: 'Theme Settings', styles: { margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', textAlign: 'center' } });
    menu.appendChild(title);

    // Theme color picker
    const colorLabel = el('label', { text: 'Theme Color:', styles: { fontWeight: '700' } });
    colorInput = el('input', {
      attrs: { type: 'color' },
      styles: { width: '100%', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' }
    });
    colorInput.value = lsGet(LS_KEYS.themeColor, DEFAULTS.themeColor);
    menu.appendChild(colorLabel);
    menu.appendChild(colorInput);

    // Invert colors checkbox
    invertCheckbox = el('input', { attrs: { type: 'checkbox' }, styles: { marginRight: '6px', cursor: 'pointer' } });
    invertCheckbox.checked = lsGet(LS_KEYS.invertColors, DEFAULTS.invertColors);
    const invertLabel = el('label', { styles: { cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' } });
    invertLabel.appendChild(invertCheckbox);
    invertLabel.appendChild(document.createTextNode('Invert Colors (excluding images)'));
    menu.appendChild(invertLabel);

    // Hide logo checkbox
    hideLogoCheckbox = el('input', { attrs: { type: 'checkbox' }, styles: { marginRight: '6px', cursor: 'pointer' } });
    hideLogoCheckbox.checked = lsGet(LS_KEYS.hideLogo, DEFAULTS.hideLogo);
    const hideLogoLabel = el('label', { styles: { cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' } });
    hideLogoLabel.appendChild(hideLogoCheckbox);
    hideLogoLabel.appendChild(document.createTextNode('Hide Logo'));
    menu.appendChild(hideLogoLabel);

    // Page title input
    const pageTitleLabel = el('label', { text: 'Page Title:', styles: { fontWeight: '700' } });
    pageTitleInput = el('input', {
      attrs: { type: 'text', placeholder: 'Enter custom page title' },
      styles: {
        width: '100%',
        padding: '6px 8px',
        borderRadius: '6px',
        border: '1px solid #444',
        backgroundColor: '#333',
        color: '#eee',
      }
    });
    pageTitleInput.value = lsGet(LS_KEYS.pageTitle, DEFAULTS.pageTitle);
    menu.appendChild(pageTitleLabel);
    menu.appendChild(pageTitleInput);

    // Background image upload
    const bgLabel = el('label', { text: 'Upload Background Image:', styles: { fontWeight: '700', marginTop: '8px' } });
    bgInput = el('input', {
      attrs: { type: 'file', accept: 'image/*' },
      styles: { width: '100%' }
    });
    menu.appendChild(bgLabel);
    menu.appendChild(bgInput);

    // Hue overlay color picker + intensity
    hueColorInput = el('input', { attrs: { type: 'color' }, styles: { width: '60%', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer' } });
    hueColorInput.value = lsGet(LS_KEYS.hueOverlayColor, DEFAULTS.hueOverlayColor);

    hueIntensityInput = el('input', {
      attrs: { type: 'range', min: '0', max: '100' },
      styles: { width: '35%', verticalAlign: 'middle', accentColor: lsGet(LS_KEYS.themeColor, DEFAULTS.themeColor) }
    });
    hueIntensityInput.value = lsGet(LS_KEYS.hueOverlayIntensity, DEFAULTS.hueOverlayIntensity);

    const hueWrapper = el('div', { styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' } });
    hueWrapper.appendChild(hueColorInput);
    hueWrapper.appendChild(hueIntensityInput);

    menu.appendChild(el('label', { text: 'Hue Overlay:', styles: { fontWeight: '700', marginTop: '8px' } }));
    menu.appendChild(hueWrapper);

    // Reset to default button
    resetBtn = el('button', {
      text: 'Reset to Default',
      styles: {
        backgroundColor: '#444',
        color: '#eee',
        border: 'none',
        borderRadius: '6px',
        padding: '10px',
        cursor: 'pointer',
        fontWeight: '700',
        marginTop: '10px',
        userSelect: 'none',
        transition: 'background-color 0.2s',
      },
      events: {
        mouseenter() { this.style.backgroundColor = '#666'; },
        mouseleave() { this.style.backgroundColor = '#444'; },
      }
    });
    menu.appendChild(resetBtn);

    // Minimize button (top right inside menu)
    minimizeBtn = el('button', {
      text: '−',
      attrs: { title: 'Minimize Menu', type: 'button' },
      styles: {
        position: 'absolute',
        top: '10px',
        right: '12px',
        width: '28px',
        height: '28px',
        fontSize: '20px',
        lineHeight: '28px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: colorInput.value,
        color: '#fff',
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
      }
    });
    menu.style.position = 'fixed';
    menu.style.paddingTop = '44px';
    menu.style.boxSizing = 'border-box';
    menu.style.userSelect = 'none';
    menu.appendChild(minimizeBtn);

    // Minimized button (floating gear icon)
    minimizedBtn = el('button', {
      text: '⚙',
      attrs: { title: 'Open Theme Settings', type: 'button' },
      styles: {
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        width: '40px',
        height: '40px',
        fontSize: '24px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: colorInput.value,
        color: '#fff',
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
        display: 'none',
        zIndex: '100001',
      }
    });
    document.body.appendChild(minimizedBtn);

    // Show/hide according to saved state
    const isMinimized = lsGet(LS_KEYS.menuMinimized, DEFAULTS.menuMinimized);
    if (isMinimized) {
      menu.style.display = 'none';
      minimizedBtn.style.display = 'block';
    } else {
      menu.style.display = 'flex';
      minimizedBtn.style.display = 'none';
    }

    // --- Event listeners ---

    colorInput.addEventListener('input', () => {
      const val = colorInput.value;
      lsSet(LS_KEYS.themeColor, val);
      applyThemeColor(val);
      minimizeBtn.style.backgroundColor = val;
      minimizedBtn.style.backgroundColor = val;
      hueIntensityInput.style.accentColor = val;
    });

    invertCheckbox.addEventListener('change', () => {
      const val = invertCheckbox.checked;
      lsSet(LS_KEYS.invertColors, val);
      applyInvertColors(val);
    });

    hideLogoCheckbox.addEventListener('change', () => {
      const val = hideLogoCheckbox.checked;
      lsSet(LS_KEYS.hideLogo, val);
      applyHideLogo(val);
    });

    pageTitleInput.addEventListener('input', () => {
      let val = pageTitleInput.value.trim();
      if (!val) val = DEFAULTS.pageTitle;
      lsSet(LS_KEYS.pageTitle, val);
      applyPageTitle(val);
    });

    bgInput.addEventListener('change', () => {
      const file = bgInput.files[0];
      if (!file) {
        lsSet(LS_KEYS.customBackground, '');
        applyCustomBackground('');
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        const dataUrl = e.target.result;
        lsSet(LS_KEYS.customBackground, dataUrl);
        applyCustomBackground(dataUrl);
      };
      reader.readAsDataURL(file);
    });

    hueColorInput.addEventListener('input', () => {
      const color = hueColorInput.value;
      lsSet(LS_KEYS.hueOverlayColor, color);
      applyHueOverlay(color, Number(hueIntensityInput.value));
    });

    hueIntensityInput.addEventListener('input', () => {
      const intensity = Number(hueIntensityInput.value);
      lsSet(LS_KEYS.hueOverlayIntensity, intensity);
      applyHueOverlay(hueColorInput.value, intensity);
    });

    resetBtn.addEventListener('click', () => {
      // Reset all values
      lsSet(LS_KEYS.themeColor, DEFAULTS.themeColor);
      lsSet(LS_KEYS.invertColors, DEFAULTS.invertColors);
      lsSet(LS_KEYS.hideLogo, DEFAULTS.hideLogo);
      lsSet(LS_KEYS.pageTitle, DEFAULTS.pageTitle);
      lsSet(LS_KEYS.customBackground, '');
      lsSet(LS_KEYS.hueOverlayColor, DEFAULTS.hueOverlayColor);
      lsSet(LS_KEYS.hueOverlayIntensity, DEFAULTS.hueOverlayIntensity);

      // Update inputs
      colorInput.value = DEFAULTS.themeColor;
      invertCheckbox.checked = DEFAULTS.invertColors;
      hideLogoCheckbox.checked = DEFAULTS.hideLogo;
      pageTitleInput.value = DEFAULTS.pageTitle;
      bgInput.value = '';
      hueColorInput.value = DEFAULTS.hueOverlayColor;
      hueIntensityInput.value = DEFAULTS.hueOverlayIntensity;

      // Apply all
      applyThemeColor(DEFAULTS.themeColor);
      applyInvertColors(DEFAULTS.invertColors);
      applyHideLogo(DEFAULTS.hideLogo);
      applyPageTitle(DEFAULTS.pageTitle);
      applyCustomBackground('');
      applyHueOverlay(DEFAULTS.hueOverlayColor, DEFAULTS.hueOverlayIntensity);
    });

    minimizeBtn.addEventListener('click', () => {
      menu.style.display = 'none';
      minimizedBtn.style.display = 'block';
      lsSet(LS_KEYS.menuMinimized, true);
    });

    minimizedBtn.addEventListener('click', () => {
      menu.style.display = 'flex';
      minimizedBtn.style.display = 'none';
      lsSet(LS_KEYS.menuMinimized, false);
    });

    // Append menu to body
    document.body.appendChild(menu);
  }

  // --- Initial apply of saved settings ---
  function applyAllSettings() {
    const themeColor = lsGet(LS_KEYS.themeColor, DEFAULTS.themeColor);
    const invertColors = lsGet(LS_KEYS.invertColors, DEFAULTS.invertColors);
    const hideLogo = lsGet(LS_KEYS.hideLogo, DEFAULTS.hideLogo);
    const pageTitle = lsGet(LS_KEYS.pageTitle, DEFAULTS.pageTitle);
    const customBg = lsGet(LS_KEYS.customBackground, DEFAULTS.customBackground);
    const hueColor = lsGet(LS_KEYS.hueOverlayColor, DEFAULTS.hueOverlayColor);
    const hueIntensity = lsGet(LS_KEYS.hueOverlayIntensity, DEFAULTS.hueOverlayIntensity);

    applyThemeColor(themeColor);
    applyInvertColors(invertColors);
    applyHideLogo(hideLogo);
    applyPageTitle(pageTitle);
    applyCustomBackground(customBg);
    applyHueOverlay(hueColor, hueIntensity);
  }

  // --- Observe page title changes dynamically to keep user custom title ---
  function setupTitleObserver() {
    const observer = new MutationObserver(() => {
      const savedTitle = lsGet(LS_KEYS.pageTitle, DEFAULTS.pageTitle);
      if (document.title !== savedTitle && savedTitle !== DEFAULTS.pageTitle) {
        document.title = savedTitle;
      }
    });
    observer.observe(document.querySelector('title') || document.head, { childList: true, subtree: true });
  }

  // --- Initialize ---
  function init() {
    buildMenu();
    applyAllSettings();
    setupTitleObserver();
  }

  window.addEventListener('load', init);
})();
