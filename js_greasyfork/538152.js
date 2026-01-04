// ==UserScript==
// @name         T3Chat Auto Boring Theme
// @namespace    https://wearifulpoet.com
// @version      0.1.0
// @description  Automatically sets light mode to boring theme and disables boring theme for dark mode
// @match        https://t3.chat/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538152/T3Chat%20Auto%20Boring%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/538152/T3Chat%20Auto%20Boring%20Theme.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const THEME_KEY = 'theme';
  const THEME = {
    LIGHT: 'light',
    DARK: 'dark',
    BORING_LIGHT: 'boring-light',
    BORING_DARK: 'boring-dark',
    BORING_SYSTEM: 'boring-system'
  };

  const getCurrentTheme = () => {
    try {
      return localStorage.getItem(THEME_KEY) || 'system';
    } catch {
      return null;
    }
  };

  const setTheme = (theme) => {
    try {
      localStorage.setItem(THEME_KEY, theme);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: THEME_KEY,
          newValue: theme,
          storageArea: localStorage
        })
      );
      return true;
    } catch {
      return false;
    }
  };

  const applyBoringLogic = () => {
    const current = getCurrentTheme();
    if (!current) return;

    let next = null;

    if (current === THEME.LIGHT) {
      next = THEME.BORING_LIGHT;
    } else if (current === THEME.BORING_DARK || current === THEME.BORING_SYSTEM) {
      next = THEME.DARK;
    }

    if (next && next !== current && setTheme(next)) {
      setTimeout(() => window.location.reload(), 100);
    }
  };

  const observeThemeChanges = () => {
    window.addEventListener('storage', (e) => {
      if (e.key === THEME_KEY && e.newValue) {
        setTimeout(applyBoringLogic, 50);
      }
    });

    const observer = new MutationObserver(() => {
      setTimeout(applyBoringLogic, 50);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return observer;
  };

  const init = () => {
    applyBoringLogic();
    observeThemeChanges();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();