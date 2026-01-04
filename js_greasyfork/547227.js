// ==UserScript==
// @name          Nexus Mods - Updated Mod Highlighter
// @version       2.1.1
// @description   Highlight mods that have updated since you last downloaded them
// @author        Journey Over
// @license       MIT
// @match         *://*.nexusmods.com/*
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@0171b6b6f24caea737beafbc2a8dacd220b729d8/libs/utils/utils.min.js
// @grant         none
// @icon          https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @homepageURL   https://github.com/StylusThemes/Userscripts
// @namespace https://greasyfork.org/users/32214
// @downloadURL https://update.greasyfork.org/scripts/547227/Nexus%20Mods%20-%20Updated%20Mod%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/547227/Nexus%20Mods%20-%20Updated%20Mod%20Highlighter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const CONFIG = {
    table: {
      highlightClass: 'nm-update-row',
    },
    tile: {
      styleId: 'nm-highlighter-style',
      updateClass: 'nm-update-card',
      downloadClass: 'nm-downloaded-card',
      colors: {
        update: {
          primary: 'rgba(255,59,48,0.8)',
          secondary: 'rgba(255,100,92,0.6)',
          glow: 'rgba(255,59,48,0.4)',
          bg: 'rgba(255,59,48,0.05)'
        },
        download: {
          primary: 'rgba(52,199,89,0.8)',
          secondary: 'rgba(92,255,129,0.6)',
          glow: 'rgba(52,199,89,0.4)',
          bg: 'rgba(52,199,89,0.05)'
        }
      },
      selectors: [
        '[data-e2eid="mod-tile"]',
        '[data-e2eid="mod-tile-list"]',
        '[data-e2eid="mod-tile-standard"]',
        '[data-e2eid="mod-tile-compact"]',
        '[data-e2eid="mod-tile-teaser"]',
        '[class*="group/mod-tile"]'
      ],
    },
    global: {
      styleId: 'nexus-global-style',
    },
    debounceDelay: 100,
  };

  const ANIMATION_DURATIONS = {
    TILE_GLOW: 2,
    TILE_PULSE: 2.5,
    TABLE_GLOW: 3,
    TABLE_STRIPE: 4,
  };

  const PAGE_SELECTORS = {
    DOWNLOAD_HISTORY: {
      path: '/users/myaccount',
      tab: 'tab=download+history'
    }
  };

  class NexusModsHighlighter {
    constructor() {
      this.logger = Logger('Nexus Mods - Updated Mod Highlighter', { debug: false });
      this.mutationObserver = null;
      this.debouncedProcess = debounce(this.processAll.bind(this), CONFIG.debounceDelay);
    }

    parseDate(text) {
      if (!text) return NaN;
      const cleanedText = text.replace(/\s+/g, ' ').trim();
      const parsedTimestamp = Date.parse(cleanedText);
      return isNaN(parsedTimestamp) ? new Date(cleanedText).getTime() || NaN : parsedTimestamp;
    }

    isDownloadHistoryPage() {
      return window.location.pathname.includes(PAGE_SELECTORS.DOWNLOAD_HISTORY.path) &&
        window.location.search.includes(PAGE_SELECTORS.DOWNLOAD_HISTORY.tab);
    }

    getTileSelector() {
      return CONFIG.tile.selectors.join(', ');
    }

    injectStyleElement(styleId, styleCss) {
      if (document.getElementById(styleId)) return;
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = styleCss;
      document.head.appendChild(styleElement);
      this.logger.debug(`Injected style: ${styleId}`);
    }

    injectTableStyles() {
      const updateColors = CONFIG.tile.colors.update;
      const css = `@keyframes table-row-glow{0%,100%{box-shadow:inset 0 0 8px ${updateColors.glow.replace('0.4','0.1')},0 0 4px ${updateColors.glow.replace('0.4','0.2')};background:linear-gradient(90deg,${updateColors.bg} 0%,${updateColors.bg.replace('0.05','0.08')} 50%,${updateColors.bg} 100%)}50%{box-shadow:inset 0 0 12px ${updateColors.glow.replace('0.4','0.15')},0 0 8px ${updateColors.glow.replace('0.4','0.3')};background:linear-gradient(90deg,${updateColors.bg.replace('0.05','0.08')} 0%,${updateColors.bg.replace('0.05','0.12')} 50%,${updateColors.bg.replace('0.05','0.08')} 100%)}}@keyframes table-stripe{0%{background-position:-200% 0}100%{background-position:200% 0}}.${CONFIG.table.highlightClass}{position:relative;animation:table-row-glow ${ANIMATION_DURATIONS.TABLE_GLOW}s ease-in-out infinite;background:linear-gradient(90deg,${updateColors.bg.replace('0.05','0.03')} 0%,${updateColors.bg.replace('0.05','0.06')} 50%,${updateColors.bg.replace('0.05','0.03')} 100%);background-size:200% 100%;transition:all 0.3s ease}.${CONFIG.table.highlightClass}::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg,transparent 0%,${updateColors.glow.replace('0.4','0.1')} 20%,${updateColors.glow.replace('0.4','0.2')} 50%,${updateColors.glow.replace('0.4','0.1')} 80%,transparent 100%);background-size:200% 100%;animation:table-stripe ${ANIMATION_DURATIONS.TABLE_STRIPE}s linear infinite;pointer-events:none;z-index:1}.${CONFIG.table.highlightClass}::after{content:'';position:absolute;top:0;left:0;bottom:0;width:3px;background:linear-gradient(180deg,${updateColors.primary} 0%,${updateColors.secondary} 50%,${updateColors.primary} 100%);box-shadow:0 0 8px ${updateColors.glow}}`;
      this.injectStyleElement('nexus-updated-style', css);
    }

    injectTileStyles() {
      const updateColors = CONFIG.tile.colors.update;
      const downloadColors = CONFIG.tile.colors.download;
      const css = `@keyframes nm-glow{0%,100%{box-shadow:0 0 8px ${updateColors.glow},0 0 16px ${updateColors.glow.replace('0.4','0.2')},0 0 24px ${updateColors.glow.replace('0.4','0.1')},inset 0 0 8px ${updateColors.glow.replace('0.4','0.1')};filter:brightness(1.05) saturate(1.1)}50%{box-shadow:0 0 12px ${updateColors.primary.replace('0.8','0.6')},0 0 24px ${updateColors.primary.replace('0.8','0.4')},0 0 36px ${updateColors.primary.replace('0.8','0.2')},inset 0 0 12px ${updateColors.primary.replace('0.8','0.15')};filter:brightness(1.08) saturate(1.15)}}@keyframes nm-download-pulse{0%,100%{box-shadow:0 0 6px ${downloadColors.glow},0 0 12px ${downloadColors.glow.replace('0.4','0.2')},inset 0 0 6px ${downloadColors.glow.replace('0.4','0.05')}}50%{box-shadow:0 0 10px ${downloadColors.primary.replace('0.8','0.5')},0 0 20px ${downloadColors.primary.replace('0.8','0.3')},inset 0 0 10px ${downloadColors.primary.replace('0.8','0.08')}}} .${CONFIG.tile.updateClass}{position:relative;background:linear-gradient(135deg,${updateColors.bg} 0%,${updateColors.bg.replace('0.05','0.03')} 50%,${updateColors.bg.replace('0.05','0.01')} 100%);border:2px solid transparent;border-image:linear-gradient(135deg,${updateColors.primary} 0%,${updateColors.secondary} 50%,${updateColors.primary.replace('0.8','0.4')} 100%);border-image-slice:1;animation:nm-glow ${ANIMATION_DURATIONS.TILE_GLOW}s ease-in-out infinite;transform:scale(1.02);transition:all 0.3s ease}.${CONFIG.tile.updateClass}::before{content:'';position:absolute;top:-2px;left:-2px;right:-2px;bottom:-2px;background:linear-gradient(45deg,transparent 0%,${updateColors.bg.replace('0.05','0.1')} 25%,${updateColors.bg.replace('0.05','0.2')} 50%,${updateColors.bg.replace('0.05','0.1')} 75%,transparent 100%);background-size:200% 200%;animation:nm-glow ${ANIMATION_DURATIONS.TILE_GLOW}s ease-in-out infinite;pointer-events:none;z-index:-1}.${CONFIG.tile.downloadClass}{position:relative;background:linear-gradient(135deg,${downloadColors.bg} 0%,${downloadColors.bg.replace('0.05','0.03')} 50%,${downloadColors.bg.replace('0.05','0.01')} 100%);border:2px solid transparent;border-image:linear-gradient(135deg,${downloadColors.primary} 0%,${downloadColors.secondary} 50%,${downloadColors.primary.replace('0.8','0.4')} 100%);border-image-slice:1;animation:nm-download-pulse ${ANIMATION_DURATIONS.TILE_PULSE}s ease-in-out infinite;transform:scale(1.01);transition:all 0.3s ease}.${CONFIG.tile.downloadClass}::before{content:'';position:absolute;top:-2px;left:-2px;right:-2px;bottom:-2px;background:linear-gradient(45deg,transparent 0%,${downloadColors.bg.replace('0.05','0.1')} 25%,${downloadColors.bg.replace('0.05','0.2')} 50%,${downloadColors.bg.replace('0.05','0.1')} 75%,transparent 100%);background-size:200% 200%;animation:nm-download-pulse ${ANIMATION_DURATIONS.TILE_PULSE}s ease-in-out infinite;pointer-events:none;z-index:-1}`;
      this.injectStyleElement(CONFIG.tile.styleId, css);
    }

    injectGlobalStyles() {
      const css = `*{border-radius:0!important}`;
      this.injectStyleElement(CONFIG.global.styleId, css);
    }

    injectStyles() {
      this.injectTableStyles();
      this.injectTileStyles();
      this.injectGlobalStyles();
    }

    processTable() {
      if (!this.isDownloadHistoryPage()) return;
      const tableRows = document.querySelectorAll('tr.even, tr.odd');
      let highlightedCount = 0;
      for (const tableRow of tableRows) {
        const downloadDateCell = tableRow.querySelector('td.table-download');
        const updateDateCell = tableRow.querySelector('td.table-update');
        if (!downloadDateCell || !updateDateCell) continue;
        const downloadTimestamp = this.parseDate(downloadDateCell.textContent);
        const updateTimestamp = this.parseDate(updateDateCell.textContent);
        if (!isNaN(downloadTimestamp) && !isNaN(updateTimestamp) && downloadTimestamp < updateTimestamp) {
          tableRow.classList.add(CONFIG.table.highlightClass);
          highlightedCount++;
        }
      }
      this.logger.debug(`Processed ${tableRows.length} table rows, highlighted ${highlightedCount}`);
    }

    processTiles() {
      if (this.isDownloadHistoryPage()) return;
      const tileSelectorString = this.getTileSelector();
      const tileElements = document.querySelectorAll(tileSelectorString);
      for (const tileElement of tileElements) {
        tileElement.classList.remove(CONFIG.tile.updateClass, CONFIG.tile.downloadClass);
      }
      for (const updateBadge of document.querySelectorAll('[data-e2eid="mod-tile-update-available"]')) {
        const tileElement = updateBadge.closest(tileSelectorString);
        if (tileElement) tileElement.classList.add(CONFIG.tile.updateClass);
      }
      for (const downloadBadge of document.querySelectorAll('[data-e2eid="mod-tile-downloaded"]')) {
        const tileElement = downloadBadge.closest(tileSelectorString);
        if (tileElement && !tileElement.classList.contains(CONFIG.tile.updateClass)) {
          tileElement.classList.add(CONFIG.tile.downloadClass);
        }
      }
      this.logger.debug(`Processed ${tileElements.length} tiles`);
    }

    processAll() {
      this.processTable();
      this.processTiles();
    }

    setupMutationObserver() {
      if (this.mutationObserver) this.mutationObserver.disconnect();
      this.mutationObserver = new MutationObserver(this.debouncedProcess);
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    setupNavigationHooks() {
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      history.pushState = (...stateArguments) => {
        const result = originalPushState.apply(history, stateArguments);
        this.debouncedProcess();
        return result;
      };
      history.replaceState = (...stateArguments) => {
        const result = originalReplaceState.apply(history, stateArguments);
        this.debouncedProcess();
        return result;
      };
      window.addEventListener('popstate', this.debouncedProcess);
    }

    init() {
      this.injectStyles();
      this.processAll();
      this.setupMutationObserver();
      this.setupNavigationHooks();
    }
  }

  const highlighter = new NexusModsHighlighter();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => highlighter.init());
  } else {
    highlighter.init();
  }
})();
