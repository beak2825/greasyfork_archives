// ==UserScript==
// @name        Incicle Dark Theme
// @license MIT
// @namespace   Violentmonkey Scripts
// @match       https://projects.incicle.com/*
// @grant       none
// @version     1.1
// @author      JV
// @description Tema de nord dark para o kanban do incicle
// @downloadURL https://update.greasyfork.org/scripts/540153/Incicle%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/540153/Incicle%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
'use strict';

// Nord Color Palette
const COLORS = {
  // Polar Night
  nord0: '#2e3440',  // Background
  nord1: '#3b4252',  // Background lighter
  nord2: '#434c5e',  // Selection background
  nord3: '#4c566a',  // Comments, invisibles
  
  // Snow Storm
  nord4: '#d8dee9',  // Dark text
  nord5: '#e5e9f0',  // Text
  nord6: '#eceff4',  // Light text
  
  // Frost
  nord7: '#8fbcbb',  // Secondary
  nord8: '#88c0d0',  // Light blue
  nord9: '#81a1c1',  // Secondary blue
  nord10: '#5e81ac', // Primary
  
  // Aurora
  nord11: '#bf616a', // Red
  nord12: '#d08770', // Orange
  nord13: '#ebcb8b', // Yellow
  nord14: '#a3be8c'  // Green
};

const cssModules = {
  // CSS Variables
  variables: `
    :root,
    html:root {
      --primary: ${COLORS.nord10} !important;
      --secondary-blue: ${COLORS.nord9} !important;
      --second: ${COLORS.nord7} !important;
      --red: ${COLORS.nord11} !important;
      --light-blue: ${COLORS.nord8} !important;
      --orange: ${COLORS.nord12} !important;
      --green: ${COLORS.nord14} !important;
      --text-color: ${COLORS.nord5} !important;
      --text-darker: ${COLORS.nord4} !important;
      --opaque-bkg: ${COLORS.nord3} !important;
      --light-yellow: ${COLORS.nord13} !important;
      --nord-bg: ${COLORS.nord0} !important;
      --nord-bg2: ${COLORS.nord1} !important;
      --nord-bg3: ${COLORS.nord2} !important;
      --nord-bg4: ${COLORS.nord3} !important;
    }
  `,

  // Base styles
  base: `
    body,
    html body {
      background-color: var(--nord-bg) !important;
      color: var(--text-color) !important;
    }
  `,

  // Links with high specificity
  links: `
    a,
    html a,
    body a,
    div a,
    p a,
    span a,
    li a,
    td a,
    th a,
    header a,
    nav a,
    main a,
    footer a,
    article a,
    section a,
    .link,
    [href],
    a.link,
    a[class],
    a[id],
    body div a,
    html body a,
    div.container a,
    .nav-link,
    .menu-link,
    .btn-link {
      color: var(--text-color) !important;
    }
  `,

  // Header styles
  header: `
    header,
    body header,
    html body header,
    div header,
    .header,
    #header,
    [class*="header"],
    nav header,
    main header {
      background-color: var(--nord-bg2) !important;
    }
    
    .css-1vb8iuf {
      color: var(--text-darker) !important;
    }
  `,

  // Kanban specific styles
  kanban: `
    /* Kanban Cards */
    .kyhxic,
    [class*="card"],
    .kanban-card {
      background-color: var(--nord-bg3) !important;
    }

    /* Kanban Columns */
    .hNtkvk,
    [class*="column"] {
      background-color: var(--nord-bg4) !important;
    }

    .jHmrSI {
      color: var(--text-darker) !important;
      border-color: var(--text-darker) !important;
    }

    .css-18st10o .MuiInputBase-root {
      background-color: transparent !important;
    }
  `,

  // Modal/Card styles
  modals: `
    .css-1tx53sv {
      background-color: var(--nord-bg2) !important;
    }

    .css-1tx53sv h3, 
    .css-1tx53sv button {
      color: var(--text-darker) !important;
    }

    .css-9aqn0s {
      background-color: var(--nord-bg3) !important;
    }

    .css-18z8a8c fieldset {
      color: var(--text-color) !important;
    }

    .css-13e5wxt {
      color: var(--text-darker) !important;
    }
  `
};

class IncicleThemeManager {
  constructor() {
    this.retryCount = 0;
    this.maxRetries = 5;
    this.retryDelay = 200;
  }

  // Combina todos os módulos CSS
  getCombinedCSS() {
    return Object.values(cssModules).join('\n\n');
  }

  // Aplica estilos via Greasemonkey/Violentmonkey
  applyWithGM() {
    if (typeof GM_addStyle !== "undefined") {
      GM_addStyle(this.getCombinedCSS());
      return true;
    }
    return false;
  }

  // Aplica estilos via DOM
  applyWithDOM() {
    const styleNode = document.createElement("style");
    styleNode.appendChild(document.createTextNode(this.getCombinedCSS()));
    styleNode.setAttribute('data-userscript', 'incicle-dark-theme');
    styleNode.setAttribute('data-version', '1.1');
    
    const head = document.querySelector("head") || document.documentElement;
    head.appendChild(styleNode);
  }

  // Força estilos via JavaScript para elementos problemáticos
  forceStyles() {
    // Headers
    const headers = document.querySelectorAll('header, .header, #header, [class*="header"]');
    headers.forEach(el => {
      el.style.setProperty('background-color', COLORS.nord1, 'important');
    });

    // Kanban cards
    const cards = document.querySelectorAll('.kyhxic, [class*="card"]');
    cards.forEach(el => {
      el.style.setProperty('background-color', COLORS.nord2, 'important');
    });

    // Links
    const links = document.querySelectorAll('a, [href]');
    links.forEach(el => {
      el.style.setProperty('color', COLORS.nord5, 'important');
    });
  }

  // Aplica estilos com retry
  applyStyles() {
    // Tenta aplicar via GM primeiro
    if (!this.applyWithGM()) {
      this.applyWithDOM();
    }

    // Força estilos específicos após delay
    setTimeout(() => this.forceStyles(), 100);
  }

  // Observer para mudanças dinâmicas
  setupObserver() {
    const observer = new MutationObserver((mutations) => {
      let needsReapply = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          needsReapply = true;
        }
      });

      if (needsReapply) {
        setTimeout(() => this.forceStyles(), 50);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Inicialização
  init() {
    // Aplica imediatamente
    this.applyStyles();

    // Aplica após DOM carregar
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.applyStyles();
        this.setupObserver();
      });
    } else {
      this.setupObserver();
    }

    // Retry periódico para elementos que carregam dinamicamente
    const retryInterval = setInterval(() => {
      this.forceStyles();
      this.retryCount++;
      
      if (this.retryCount >= this.maxRetries) {
        clearInterval(retryInterval);
      }
    }, this.retryDelay * this.retryCount);
  }
}

// Inicializar
const themeManager = new IncicleThemeManager();
themeManager.init();

})();
