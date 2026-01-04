// ==UserScript==
// @name         Enhanced Ad Link Analyzer with Custom Domains
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Улучшенный скрипт для анализа рекламных ссылок на поиске Яндекса с поддержкой динамической загрузки, функцией копирования и улучшенным пользовательским интерфейсом, включающим отображение в виде таблицы ключевых значений и кнопку «Открыть в новой вкладке».
// @author       TechnoGnostic
// @license      MIT
// @run-at       document-start
// @match        https://ya.ru/search/*
// @match        https://ya.ru/search*
// @match        https://www.ya.ru/search/*
// @match        https://www.ya.ru/search*
// @match        https://yandex.ru/search/*
// @match        https://yandex.ru/search*
// @match        https://www.yandex.ru/search/*
// @match        https://www.yandex.ru/search*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/526066/Enhanced%20Ad%20Link%20Analyzer%20with%20Custom%20Domains.user.js
// @updateURL https://update.greasyfork.org/scripts/526066/Enhanced%20Ad%20Link%20Analyzer%20with%20Custom%20Domains.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* =======================
     Global Configuration
  ========================== */
  const CONFIG = {
    TOOLTIP_DELAY: 300,
    DEBUG_MODE: false,
    PROCESSED_ATTR: 'data-tooltip-processed',
    SETTINGS_KEY: 'customDomainSettings',
  };

  // Default settings – you can customize these defaults
  const DEFAULT_SETTINGS = {
    // List of domains with colors for each theme.
    domains: [
      { domain: 'geon.ru', lightColor: '#ff0000', darkColor: '#ff0000' },
      { domain: 'ada-rus.ru', lightColor: '#8000ff', darkColor: '#8000ff' },
      { domain: 'rusgeocom.ru', lightColor: '#0080ff', darkColor: '#0080ff' },
    ],
    // Global advertiser color (for any ad block style that isn’t domain-specific)
    advertiser: { lightColor: '#bfbf30', darkColor: '#ffff00' }
  };

  // Utility: Logging function
  function log(...args) {
    if (CONFIG.DEBUG_MODE) {
      console.log('[AdAnalyzer]', ...args);
    }
  }

  /* =======================
     Storage Helpers
  ========================== */
  // Try using GM storage if available, fallback to localStorage.
  function loadSettings() {
    let settings = null;
    try {
      if (typeof GM_getValue === 'function') {
        settings = GM_getValue(CONFIG.SETTINGS_KEY, DEFAULT_SETTINGS);
      }
    } catch (e) {
      log('GM_getValue not available:', e);
    }
    if (!settings) {
      const stored = localStorage.getItem(CONFIG.SETTINGS_KEY);
      settings = stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    }
    return settings;
  }

  function saveSettings(settings) {
    try {
      if (typeof GM_setValue === 'function') {
        GM_setValue(CONFIG.SETTINGS_KEY, settings);
      } else {
        localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(settings));
      }
    } catch (e) {
      log('Error saving settings:', e);
    }
  }

  function resetSettings() {
    saveSettings(DEFAULT_SETTINGS);
  }

  /* =======================
     Dynamic Style Generation
  ========================== */
  /**
   * Generate CSS rules based on current settings.
   * We generate two sets of CSS: one for the dark theme and one for the light theme.
   */
  function generateDynamicStyles(settings) {
    // Create CSS variables for dark theme and light theme
    const darkVars = [];
    const lightVars = [];
    // Advertiser colors (global)
    darkVars.push(`--color-advertiser: ${settings.advertiser.darkColor};`);
    lightVars.push(`--color-advertiser: ${settings.advertiser.lightColor};`);

    // Create domain-specific variables. We assign a variable name based on the domain name (e.g. --color-geon).
    settings.domains.forEach(entry => {
      // For safety, generate a safe variable name (remove dots and hyphens)
      const safeName = entry.domain.replace(/[.\-]/g, '');
      darkVars.push(`--color-${safeName}: ${entry.darkColor};`);
      lightVars.push(`--color-${safeName}: ${entry.lightColor};`);
    });

    // Base CSS for theme colors
    const themeCSS = `
      /* Dark theme colors */
      body.Theme_color_yandex-inverse {
        ${darkVars.join('\n')}
      }
      /* Light theme colors */
      body.Theme_color_yandex-default {
        ${lightVars.join('\n')}
      }
    `;

    // CSS for advertiser blocks (always on top)
    const advertiserCSS = `
      /* Any advertiser block */
      li.serp-item:has(button[data-vnl*="about-advertiser"]){
        border: 2px solid var(--color-advertiser);
      }
    `;

    // Domain-specific rules – both for ad blocks (solid border) and organic blocks (dashed border)
    let domainCSS = '';
    settings.domains.forEach(entry => {
      const safeName = entry.domain.replace(/[.\-]/g, '');
      domainCSS += `
        /* Ad blocks for domain ${entry.domain} */
        li.serp-item:has(a.Link_theme_outer[data-click*="${entry.domain}" i]) {
          border: 2px solid var(--color-${safeName});
        }
        /* Organic blocks for domain ${entry.domain} */
        li.serp-item:has(a.Link_theme_outer[href*="${entry.domain}" i]) {
          border: 2px dashed var(--color-${safeName});
        }
      `;
    });

    return themeCSS + advertiserCSS + domainCSS;
  }

  // Apply the dynamic styles to the page.
  function applyDynamicStyles() {
    const settings = loadSettings();
    // Remove previous dynamic style block if exists
    const existingStyle = document.getElementById('dynamic-ad-analyzer-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    const styleEl = document.createElement('style');
    styleEl.id = 'dynamic-ad-analyzer-styles';
    styleEl.textContent = generateDynamicStyles(settings);
    document.head.appendChild(styleEl);
  }

  /* =======================
     Tooltip Logic
  ========================== */
  function replaceQuotes(text) {
    return text.replace(/&quot;/g, '"');
  }

  function removeUTMTags(url) {
    try {
      const urlObject = new URL(url);
      const params = new URLSearchParams(urlObject.search);
      const allParams = Array.from(params.entries())
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n'); // Each parameter on a new line
      urlObject.search = '';
      return {
        cleanUrl: urlObject.toString(),
        allParams: allParams,
        hasUTM: params.toString().includes('utm_')
      };
    } catch (error) {
      log('URL processing error:', error);
      return { cleanUrl: url, allParams: '', hasUTM: false };
    }
  }

  function recalcTooltipMaxWidth(tooltip) {
    const margin = 20; // leave some gap on the side
    const viewportWidth = window.innerWidth;
    let available = 0;
    const parentRect = tooltip.parentElement.getBoundingClientRect();
    if (tooltip.style.left && tooltip.style.left !== 'auto') {
      const tooltipRect = tooltip.getBoundingClientRect();
      available = viewportWidth - tooltipRect.left - margin;
    } else {
      available = parentRect.left - margin;
    }
    tooltip.style.maxWidth = available + 'px';
  }

    // Функция для позиционирования тултипа
    function positionTooltip(tooltip) {
      // Give the tooltip a high z-index so it appears on top
      tooltip.style.zIndex = '999999';

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Identify the top/pinned header and measure its bottom edge
      const topPanel = document.querySelector('.HeaderNav');
      const topPanelRect = topPanel?.getBoundingClientRect();
      const pinnedHeaderBottom = topPanelRect ? topPanelRect.bottom : 0;

      // Safe margin from the viewport edges
      const SAFE_MARGIN = 20;

      // Parent element and its bounding rectangle
      const parent = tooltip.parentElement;
      const parentRect = parent.getBoundingClientRect();

      // Tooltip dimensions (assumes it’s rendered and measurable)
      const tooltipHeight = tooltip.offsetHeight;
      const tooltipWidth = tooltip.offsetWidth;

      // -------------------------
      // Horizontal Positioning
      // -------------------------
      const spaceRight = viewportWidth - (parentRect.right + SAFE_MARGIN);
      const spaceLeft = parentRect.left - SAFE_MARGIN;

      // Default: position to the right if possible, otherwise left
      if (spaceRight >= tooltipWidth) {
        tooltip.style.left = `${parentRect.width * 1.05}px`;
        tooltip.style.right = 'auto';
      } else if (spaceLeft >= tooltipWidth) {
        tooltip.style.right = `${parentRect.width * 1.05}px`;
        tooltip.style.left = 'auto';
      } else {
        // If neither side is ample, still default to the right
        tooltip.style.left = `${parentRect.width * 1.05}px`;
        tooltip.style.right = 'auto';
      }

      // -------------------------
      // Vertical Positioning
      // -------------------------
      // Center tooltip relative to the parent's vertical center
      const parentCenterY = parentRect.top + (parentRect.height / 2);
      let idealTooltipTop = parentCenterY - (tooltipHeight / 2);

      // Min and max top positions to keep tooltip fully in view
      const minTooltipTop = pinnedHeaderBottom + SAFE_MARGIN;
      const maxTooltipTop = viewportHeight - tooltipHeight - SAFE_MARGIN;

      // Clamp the top within these limits
      let finalTooltipTop = Math.min(Math.max(idealTooltipTop, minTooltipTop), maxTooltipTop);

      // If tooltip is too tall for the remaining space, enable scrolling
      const availableVerticalSpace = viewportHeight - pinnedHeaderBottom - (SAFE_MARGIN * 2);
      if (tooltipHeight > availableVerticalSpace) {
        finalTooltipTop = minTooltipTop;
        tooltip.style.maxHeight = `${availableVerticalSpace}px`;
        tooltip.style.overflowY = 'auto';
      } else {
        tooltip.style.maxHeight = '';
        tooltip.style.overflowY = 'visible';
      }

      // Convert from viewport to parent-relative coords
      const topRelativeToParent = finalTooltipTop - parentRect.top;
      tooltip.style.top = `${topRelativeToParent}px`;
      tooltip.style.bottom = 'auto';

      // Recalculate maxWidth so the tooltip doesn’t overflow horizontally
      recalcTooltipMaxWidth(tooltip);
    }




    function createTooltip(element, cleanUrl, allParams) {
        const tooltip = document.createElement('div');
        tooltip.className = 'ad-analyzer-tooltip';

        const linkInfo = document.createElement('div');
        linkInfo.className = 'ad-analyzer-url-section';
        linkInfo.innerHTML = `<strong>Clean URL:</strong><br><a href="${cleanUrl}" target="_blank">${cleanUrl}</a>`;

        const paramsContainer = document.createElement('div');
        paramsContainer.className = 'ad-analyzer-params-container';
        const paramsTitle = document.createElement('strong');
        paramsTitle.textContent = 'Parameters:';
        paramsContainer.appendChild(paramsTitle);

        const twoColumnContainers = [];

        if (allParams) {
            const lines = allParams.split('\n');
            lines.forEach(line => {
                const index = line.indexOf(':');
                const row = document.createElement('div');
                row.className = 'ad-analyzer-param-row';
                if (index !== -1) {
                    const key = line.slice(0, index).trim();
                    const rawValue = line.slice(index + 1).trim();
                    const keyDiv = document.createElement('div');
                    keyDiv.className = 'ad-analyzer-param-key';
                    keyDiv.textContent = key;
                    const valueDiv = document.createElement('div');
                    valueDiv.className = 'ad-analyzer-param-value';

                    if (rawValue.includes('|')) {
                        const parts = rawValue.split('|')
                            .map(item => item.trim())
                            .filter(item => item.length > 0);
                        const twoColumnContainer = document.createElement('div');
                        twoColumnContainer.style.display = 'grid';
                        twoColumnContainer.style.gridTemplateColumns = 'repeat(2, fit-content(400px))';
                        twoColumnContainer.style.columnGap = '10px';

                        parts.forEach(part => {
                            const partDiv = document.createElement('div');
                            partDiv.className = 'ad-analyzer-param-cell';
                            partDiv.textContent = part;
                            twoColumnContainer.appendChild(partDiv);
                        });

                        valueDiv.appendChild(twoColumnContainer);
                        twoColumnContainers.push(twoColumnContainer);
                    } else {
                        valueDiv.textContent = rawValue;
                    }

                    row.appendChild(keyDiv);
                    row.appendChild(valueDiv);
                } else {
                    row.textContent = line;
                }
                paramsContainer.appendChild(row);
            });
        } else {
            const noneText = document.createElement('div');
            noneText.textContent = 'None';
            paramsContainer.appendChild(noneText);
        }

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'ad-analyzer-buttons';

        const openButton = document.createElement('button');
        openButton.className = 'ad-analyzer-open-btn';
        openButton.textContent = '🗖 Открыть в новой вкладке';
        openButton.addEventListener('click', e => {
            e.stopPropagation();
            window.open(cleanUrl, '_blank');
        });

        const copyButton = document.createElement('button');
        copyButton.className = 'ad-analyzer-copy-btn';
        copyButton.textContent = '📋 Копировать URL';
        copyButton.addEventListener('click', e => {
            e.stopPropagation();
            navigator.clipboard.writeText(cleanUrl).then(() => {
                GM_notification({
                    title: 'Скопировано!',
                    text: 'URL скопирован в буфер обмена',
                    timeout: 2000
                });
            }).catch(err => console.log('Copy failed:', err));
        });

        buttonsContainer.appendChild(openButton);
        buttonsContainer.appendChild(copyButton);

        tooltip.appendChild(linkInfo);
        tooltip.appendChild(paramsContainer);
        tooltip.appendChild(buttonsContainer);

        element.style.position = 'relative';
        element.appendChild(tooltip);

        // Функция для синхронизации ширины колонок
        function synchronizeColumnWidths() {
            const colWidths = [0, 0]; // [максимальная ширина первой колонки, второй колонки]

            twoColumnContainers.forEach(container => {
                const cells = Array.from(container.children);
                if (cells.length >= 2) {
                    colWidths[0] = Math.max(colWidths[0], colWidths[1], cells[0].scrollWidth, cells[1].scrollWidth);
                    colWidths[1] = Math.max(colWidths[0], colWidths[1], cells[0].scrollWidth, cells[1].scrollWidth);
                }
            });

            // Ограничиваем максимальную ширину одной колонки до 400px
            colWidths[0] = Math.min(colWidths[0], 400);
            colWidths[1] = Math.min(colWidths[1], 400);

            twoColumnContainers.forEach(container => {
                const cells = Array.from(container.children);
                if (cells.length >= 2) {
                    cells[0].style.width = colWidths[0] + 'px';
                    cells[1].style.width = colWidths[1] + 'px';
                }
            });
        }

        if (twoColumnContainers.length) {
            requestAnimationFrame(synchronizeColumnWidths);
        }

        let hoverTimeout;

        const showTooltip = () => {
            clearTimeout(hoverTimeout);
            tooltip.classList.add('visible');
            positionTooltip(tooltip);
        };

        const hideTooltip = () => {
            hoverTimeout = setTimeout(() => {
                tooltip.classList.remove('visible');
            }, 200);
        };

        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    }


  function processElement(parentElement) {
    try {
      if (parentElement[CONFIG.PROCESSED_ATTR]) return;
      parentElement[CONFIG.PROCESSED_ATTR] = true;
      const jsonButton = parentElement.querySelector('button[data-vnl*="about-advertiser"]');
      if (!jsonButton) return;
      const jsonText = replaceQuotes(jsonButton.dataset.vnl);
      const jsonData = JSON.parse(jsonText);
      const snippetUrl = jsonData.items
        .find(item => item.variant === "reportFeedback")
        ?.reportFeedback?.customMetaFields
        ?.find(field => field.name === "snippetUrl")?.value;
      if (!snippetUrl) return;
      const { cleanUrl, allParams, hasUTM } = removeUTMTags(snippetUrl);
      if (!hasUTM) return;
      createTooltip(parentElement, cleanUrl, allParams);
    } catch (error) {
      log('Element processing error:', error);
    }
  }

  function processElements() {
    document.querySelectorAll('li.serp-item')
      .forEach(processElement);
  }

  window.addEventListener('resize', () => {
    document.querySelectorAll('.ad-analyzer-tooltip').forEach(tooltip => {
      if (tooltip.classList.contains('visible')) {
        positionTooltip(tooltip);
      }
    });
  });


    window.addEventListener('scroll', () => {
        document.querySelectorAll('.ad-analyzer-tooltip.visible').forEach(tooltip => {
            positionTooltip(tooltip);
        });
    });

  /* =======================
     Settings Modal UI
  ========================== */
  function createSettingsModal() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'settings-modal-overlay';

    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'settings-modal';
    modal.innerHTML = `
      <h2>Настройки доменов и цветов</h2>
      <div id="settings-modal-content">
        <div class="settings-header">
          <div class="settings-col">Домен</div>
          <div class="settings-col">Цвет (светлая тема)</div>
          <div class="settings-col">Цвет (тёмная тема)</div>
          <div class="settings-col">Удалить</div>
        </div>
        <div id="settings-rows"></div>
      </div>
      <div id="settings-modal-buttons">
        <button id="add-domain-btn">Добавить домен</button>
        <button id="cancel-settings-btn">Отмена</button>
        <button id="save-settings-btn">Сохранить</button>
        <button id="reset-settings-btn">Сбросить настройки</button>
      </div>
    `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Populate current settings
    function renderRows() {
      const rowsContainer = modal.querySelector('#settings-rows');
      rowsContainer.innerHTML = ''; // Clear previous content
      const settings = loadSettings();
      settings.domains.forEach((entry, index) => {
        const row = document.createElement('div');
        row.className = 'settings-row';
        row.dataset.index = index;
        row.innerHTML = `
          <div class="settings-col">
            <input type="text" class="domain-input" value="${entry.domain}" />
          </div>
          <div class="settings-col">
            <input type="color" class="light-color-input" value="${entry.lightColor}" />
          </div>
          <div class="settings-col">
            <input type="color" class="dark-color-input" value="${entry.darkColor}" />
          </div>
          <div class="settings-col">
            <button class="delete-row-btn" title="Удалить строку">✖</button>
          </div>
        `;
        rowsContainer.appendChild(row);
      });
    }
    renderRows();

    // Button listeners
    modal.querySelector('#add-domain-btn').addEventListener('click', () => {
      const settings = loadSettings();
      settings.domains.push({ domain: '', lightColor: '#ffffff', darkColor: '#000000' });
      saveSettings(settings);
      renderRows();
    });

    modal.querySelector('#cancel-settings-btn').addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    modal.querySelector('#reset-settings-btn').addEventListener('click', () => {
      if (confirm('Сбросить настройки к значениям по умолчанию?')) {
        resetSettings();
        renderRows();
      }
    });

    modal.querySelector('#save-settings-btn').addEventListener('click', () => {
      // Gather new settings from the rows
      const newSettings = loadSettings();
      newSettings.domains = [];
      modal.querySelectorAll('.settings-row').forEach(row => {
        const domain = row.querySelector('.domain-input').value.trim();
        const lightColor = row.querySelector('.light-color-input').value;
        const darkColor = row.querySelector('.dark-color-input').value;
        if (domain) {
          newSettings.domains.push({ domain, lightColor, darkColor });
        }
      });
      saveSettings(newSettings);
      applyDynamicStyles();
      document.body.removeChild(overlay);
    });

    // Delegate delete-row button clicks
    modal.querySelector('#settings-rows').addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('delete-row-btn')) {
        const row = e.target.closest('.settings-row');
        const index = parseInt(row.dataset.index, 10);
        const settings = loadSettings();
        settings.domains.splice(index, 1);
        saveSettings(settings);
        renderRows();
      }
    });
  }

  // Create a gear icon button to open settings (inserted into the page)
  function addSettingsButton() {
    const btn = document.createElement('button');
    btn.id = 'open-settings-btn';
    btn.title = 'Настроить домены и цвета';
    btn.textContent = '⚙';
    btn.addEventListener('click', createSettingsModal);
    // Insert into page – you can adjust where the button should appear.
    document.body.appendChild(btn);
  }

  /* =======================
     CSS Styles
  ========================== */
  GM_addStyle(`
    /* Улучшенные стили тултипа */
    .ad-analyzer-tooltip {
      position: absolute;
      left: auto;
      top: auto;
      background: #1a1a1a;
      color: #fff;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      width: max-content;
      min-width: 280px;
      max-width: 592px;
      max-height: 1024px;
      overflow-y: auto;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease;
      will-change: transform, opacity;
      overscroll-behavior: contain;
      pointer-events: auto;
      z-index: 9999;
      word-break: break-word;
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.4;
    }
    /* Стрелка тултипа */
    .ad-analyzer-tooltip::before {
      content: "";
      position: absolute;
      top: 50%;
      right: 100%;
      transform: translateY(-50%);
      border-width: 8px;
      border-style: solid;
      border-color: transparent #1a1a1a transparent transparent;
    }
    /* Показ тултипа */
    .ad-analyzer-tooltip.visible {
      opacity: 1;
      visibility: visible;
    }
    /* Секция URL */
    .ad-analyzer-url-section a {
      color: #4CAF50;
      text-decoration: none;
    }
    .ad-analyzer-url-section a:hover {
      text-decoration: underline;
    }
    /* Контейнер параметров */
    .ad-analyzer-params-container {
      margin-top: 10px;
    }
    /* Строки параметров */
    .ad-analyzer-param-row {
      display: flex;
      gap: 10px;
      padding: 5px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      align-items: center;
    }
    .ad-analyzer-param-row:last-child {
      border-bottom: none;
    }
    .ad-analyzer-param-key {
      font-weight: bold;
      color: #a0a0a0;
      white-space: nowrap;
      flex-shrink: 0;
      width: 140px;
    }
    .ad-analyzer-param-value {
      color: #fff;
      word-break: break-word;
      overflow-wrap: break-word;
      flex-grow: 1;
      white-space: pre-wrap;
    }
    /* Кнопки */
    .ad-analyzer-buttons {
      margin-top: 15px;
      display: flex;
      gap: 10px;
    }
    .ad-analyzer-open-btn,
    .ad-analyzer-copy-btn {
      background: #4CAF50;
      color: #fff;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s, transform 0.2s;
    }
    .ad-analyzer-open-btn {
      background: #2196F3;
    }
    .ad-analyzer-open-btn:hover,
    .ad-analyzer-copy-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    /* Адаптив для мобильных */
    @media (max-width: 480px) {
      .ad-analyzer-tooltip {
        min-width: 220px;
        max-width: 90vw;
        left: auto;
        right: 110%;
      }
      .ad-analyzer-tooltip::before {
        right: auto;
        left: 100%;
        border-color: transparent transparent transparent #1a1a1a;
      }
      .ad-analyzer-param-row {
        flex-direction: column;
        gap: 4px;
      }
      .ad-analyzer-buttons {
        flex-direction: column;
      }
      .ad-analyzer-open-btn,
      .ad-analyzer-copy-btn {
        width: 100%;
        text-align: center;
      }
    }

    @media (max-height: 600px) {
        .ad-analyzer-tooltip {
            max-height: 70vh !important;
        }
    }

    /* Стили модального окна и кнопки настроек остаются без изменений */
    /* Settings Modal Styles */
    #settings-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    #settings-modal {
      background: var(--modal-bg, #fff);
      color: var(--modal-text, #333);
      border-radius: 8px;
      padding: 20px;
      width: 600px;
      max-width: 95%;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      font-family: sans-serif;
    }
    #settings-modal h2 {
      margin-top: 0;
      text-align: center;
    }
    #settings-modal-content {
      margin: 20px 0;
    }
    .settings-header,
    .settings-row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1.5fr 0.5fr;
      gap: 10px;
      align-items: center;
      margin-bottom: 8px;
    }
    .settings-header {
      font-weight: bold;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4px;
    }
    .settings-col {
      overflow: hidden;
    }
    .settings-row input[type="text"],
    .settings-row input[type="color"] {
      width: 100%;
      padding: 4px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    #settings-modal-buttons {
      text-align: center;
    }
    #settings-modal-buttons button {
      margin: 0 5px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
      font-size: 14px;
    }
    #add-domain-btn {
      background: #2196F3;
      color: #fff;
    }
    #cancel-settings-btn {
      background: #f44336;
      color: #fff;
    }
    #save-settings-btn {
      background: #4CAF50;
      color: #fff;
    }
    #reset-settings-btn {
      background: #9E9E9E;
      color: #fff;
    }
    #settings-modal-buttons button:hover {
      opacity: 0.9;
    }
    /* Settings button (gear icon) */
    #open-settings-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #333;
      color: #fff;
      border: none;
      padding: 10px;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      z-index: 10000;
      transition: background 0.2s;
    }
    #open-settings-btn:hover {
      background: #555;
    }
    /* Dark mode adjustments for modal if needed */
    @media (prefers-color-scheme: dark) {
      #settings-modal {
        --modal-bg: #333;
        --modal-text: #f0f0f0;
      }
    }
  `);

  /* =======================
     Initialize Script
  ========================== */
  function init() {
    processElements();
    applyDynamicStyles();
    addSettingsButton();
    // Observe DOM changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          processElements();
        }
      });
    });
    document.addEventListener('DOMContentLoaded', () => {
      processElements();
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  init();
})();