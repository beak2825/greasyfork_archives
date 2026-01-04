// ==UserScript==
// @name         Модерация ГА/ЗГА/Куратор/ Стили ✨
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Full forum
// @author       Maras Rofls 
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532584/%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%93%D0%90%D0%97%D0%93%D0%90%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D0%A1%D1%82%D0%B8%D0%BB%D0%B8%20%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532584/%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%93%D0%90%D0%97%D0%93%D0%90%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D0%A1%D1%82%D0%B8%D0%BB%D0%B8%20%E2%9C%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LS_THEME_KEY = 'BRVL_SimpleTheme_v4';
  const LS_CUSTOM_BG_KEY = 'BRVL_CustomBG_URL_v1';
  const LS_EFFECTS_KEY = 'BRVL_Effects_v2';
  const LS_OPACITY_KEY = 'BRVL_Opacity_v1';
  const LS_BLUR_KEY = 'BRVL_Blur_v1';
  const LS_EXTRA_EFFECTS_KEY = 'BRVL_Extra_Effects_v1';
  const LS_TEXT_GLOW_KEY = 'BRVL_TextGlow_v1';

  const THEME_PRESETS = [
    { name: 'Выкл (Стандарт)', type: 'normal' },
    {
      name: '🖼️ Установить свой фон...',
      type: 'custom_bg_trigger'
    },
    {
      name: '🎚️ Настроить прозрачность...',
      type: 'custom_opacity_trigger'
    },
    {
      name: '🌇 Авто (День/Ночь)',
      type: 'dynamic'
    },
    {
      name: '--- Премиум ---',
      type: 'header'
    },
    {
      name: '⚫ Нуар & Рубин',
      type: 'normal',
      textColor: '#F5F5F5', baseBgFrom: '#000000', baseBgTo: '#000000',
      borderColor: '#FF0000', accentColor: '#E50000', linkColor: '#FF4500',
      opacity: 0.6, blur: 2, pulse: true
    },
    {
      name: '💎 Нефрит & Золото',
      type: 'normal',
      textColor: '#E0E0E0', baseBgFrom: '#0A1A0A', baseBgTo: '#000000',
      borderColor: '#D4AF37', accentColor: '#00FF7F', linkColor: '#F0E68C',
      opacity: 0.5, blur: 4, pulse: true
    },
    {
      name: '🧊 Арктический Рассвет',
      type: 'light',
      textColor: '#0A1D2A', baseBgFrom: '#FFFFFF', baseBgTo: '#F0F8FF',
      borderColor: '#87CEEB', accentColor: '#00BFFF', linkColor: '#1E90FF',
      opacity: 0.7, blur: 8, pulse: false
    },
    {
      name: '🔮 Неон',
      type: 'normal',
      textColor: '#E0FFFF', baseBgFrom: '#0A0A2A', baseBgTo: '#000000',
      borderColor: '#FF00FF', accentColor: '#00FFFF', linkColor: '#FF00FF',
      opacity: 0.5, blur: 4, pulse: true
    },
    {
      name: '🍂 Горячий Шоколад',
      type: 'normal',
      textColor: '#FFF8E1', baseBgFrom: '#4E342E', baseBgTo: '#3E2723',
      borderColor: '#FF8A65', accentColor: '#FF7043', linkColor: '#FFB74D',
      opacity: 0.6, blur: 2, pulse: false
    },
    {
      name: '💎 Жидкое стекло',
      type: 'light',
      textColor: '#000000', baseBgFrom: '#F0F0F0', baseBgTo: '#FFFFFF',
      borderColor: '#007AFF', accentColor: '#007AFF', linkColor: '#0056B3',
      opacity: 0.7, blur: 10, pulse: false
    },
    {
      name: '💎 Техно-Титан',
      type: 'normal',
      textColor: '#E0FFFF', baseBgFrom: '#1A1A2A', baseBgTo: '#0A0A1A',
      borderColor: '#00FFFF', accentColor: '#00E5E5', linkColor: '#7FFFD4',
      opacity: 0.5, blur: 4, pulse: true
    },
    {
      name: '🐲 Красный Дракон',
      type: 'normal',
      textColor: '#F5F5F5', baseBgFrom: '#1A0A0A', baseBgTo: '#000000',
      borderColor: '#FF0000', accentColor: '#E50000', linkColor: '#FF4500',
      opacity: 0.5, blur: 4, pulse: true
    },
    {
      name: '👑 Королевский Пурпур',
      type: 'normal',
      textColor: '#F3E5F5', baseBgFrom: '#1A0A1A', baseBgTo: '#0A000A',
      borderColor: '#D4AF37', accentColor: '#FFD700', linkColor: '#E1BEE7',
      opacity: 0.5, blur: 1, pulse: true
    },
    {
      name: '🌳 Изумрудный Лес',
      type: 'normal',
      textColor: '#E8F5E9', baseBgFrom: '#0A1A0A', baseBgTo: '#000A00',
      borderColor: '#00FF00', accentColor: '#00E500', linkColor: '#7FFF7F',
      opacity: 0.5, blur: 1, pulse: true
    },
    {
      name: '🔥 Солнечная Вспышка',
      type: 'normal',
      textColor: '#FFF8E1', baseBgFrom: '#1A100A', baseBgTo: '#0A0500',
      borderColor: '#FF8C00', accentColor: '#FFA500', linkColor: '#FFD700',
      opacity: 0.5, blur: 1, pulse: true
    },
    {
      name: '--- Анимированные ---',
      type: 'header'
    },
    {
      name: '🌌 Аврора (Аним.)',
      type: 'animated',
      textColor: '#ffffff', baseBgFrom: '#0a0a1a', baseBgTo: '#0a0a1a',
      borderColor: '#8A2BE2', accentColor: '#BA55D3', linkColor: '#D8BFD8',
      opacity: 0.5, blur: 1, pulse: true
    },
    {
      name: '🧬 Матрица (Аним.)',
      type: 'animated',
      textColor: '#F0F0F0', baseBgFrom: '#001000', baseBgTo: '#000000',
      borderColor: '#00FF00', accentColor: '#33FF33', linkColor: '#66FF66',
      opacity: 0.6, blur: 2, pulse: true
    },
    {
      name: '--- Премиум 2 ---',
      type: 'header'
    },
    {
      name: '⚫️ Black & Gold',
      type: 'normal',
      textColor: '#E0E0E0', baseBgFrom: '#1A1A1A', baseBgTo: '#0A0A0A',
      borderColor: '#D4AF37', accentColor: '#FFD700', linkColor: '#F0E68C',
      opacity: 0.5, blur: 4, pulse: true
    },
    {
      name: '🌊 Океан (Глубина)',
      type: 'normal',
      textColor: '#E0FFFF', baseBgFrom: '#0D1A26', baseBgTo: '#000E1A',
      borderColor: '#1E90FF', accentColor: '#4169E1', linkColor: '#B0C4DE',
      opacity: 0.5, blur: 4, pulse: true
    },
    {
      name: '🔥 Огонь и Пепел',
      type: 'normal',
      textColor: '#F0F0F0', baseBgFrom: '#2a140e', baseBgTo: '#1a0a0a',
      borderColor: '#FF4500', accentColor: '#FF6347', linkColor: '#FFA07A',
      opacity: 0.5, blur: 4, pulse: true
    },
    {
      name: '🔮 Туманность',
      type: 'normal',
      textColor: '#F3E5F5', baseBgFrom: '#2A0A4A', baseBgTo: '#1A052E',
      borderColor: '#CE93D8', accentColor: '#AB47BC', linkColor: '#E1BEE7',
      opacity: 0.5, blur: 4, pulse: true
    },
    {
      name: '--- Светлые ---',
      type: 'header'
    },
    {
      name: '🧊 Холодное стекло',
      type: 'light',
      textColor: '#000000', baseBgFrom: '#FFFFFF', baseBgTo: '#EFEFEF',
      borderColor: '#007BFF', accentColor: '#0056b3', linkColor: '#004085',
      opacity: 0.6, blur: 5, pulse: false
    }
  ];

  function hexToRgb(hex) {
    if (!hex) return '0, 0, 0';
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0';
  }

  function ensureStyleNode(id) {
    let node = document.getElementById(id);
    if (!node) {
      node = document.createElement('style');
      node.id = id;
      (document.head || document.documentElement).appendChild(node);
    }
    return node;
  }

  function getAnimatedBgCSS(themeName, blurAmount) {
    if (themeName === '🌌 Аврора (Аним.)') {
      return `
        @keyframes aurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        html::before {
          content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2;
          background: linear-gradient(-45deg, #0a0a1a, #2a0a3a, #0a1a2a, #2a1a0a);
          background-size: 400% 400%;
          animation: aurora 15s ease infinite;
          transform: translateZ(0);
          filter: ${blurAmount};
        }
      `;
    }
    if (themeName === '🧬 Матрица (Аним.)') {
      return `
        html::before {
          content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2;
          background-color: #000;
          transform: translateZ(0);
          filter: ${blurAmount};
        }
      `;
    }
    return `html::before { background: transparent !important; filter: ${blurAmount}; }`;
  }

  function applyTheme(themeNameFromStorage) {
    const themeNode = ensureStyleNode('brvl-theme-styles');
    let themeName = themeNameFromStorage;

    if (themeName === '🌇 Авто (День/Ночь)') {
      const hour = new Date().getHours();
      themeName = (hour > 7 && hour < 19) ? '🧊 Арктический Рассвет (NEW)' : '⚫️ Black & Gold';
    }

    const theme = THEME_PRESETS.find(t => t.name === themeName);

    if (!theme || theme.name === 'Выкл (Стандарт)') {
      themeNode.textContent = '';
      if (themeNameFromStorage === 'Выкл (Стандарт)') {
        localStorage.setItem(LS_THEME_KEY, 'Выкл (Стандарт)');
      }
      return;
    }

    if (themeNameFromStorage !== '🌇 Авто (День/Ночь)') {
      localStorage.setItem(LS_THEME_KEY, theme.name);
    }

    const savedOpacity = localStorage.getItem(LS_OPACITY_KEY);
    const blurEnabled = localStorage.getItem(LS_BLUR_KEY) === 'true';
    const themeBlurAmount = (theme.blur || 0) + 'px';
    const finalBlurCSS = blurEnabled ? `blur(${themeBlurAmount})` : 'none';

    let backgroundCSS = '';
    const customBgUrl = localStorage.getItem(LS_CUSTOM_BG_KEY);

    if (customBgUrl) {
      backgroundCSS = `
        html::before {
          content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2;
          background-image: url(${customBgUrl});
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          transform: translateZ(0);
          filter: ${finalBlurCSS};
        }
      `;
    } else if (theme.type === 'animated') {
      backgroundCSS = getAnimatedBgCSS(theme.name, finalBlurCSS);
    } else {
      backgroundCSS = `html::before {
        background: transparent !important;
        transform: translateZ(0);
        filter: ${finalBlurCSS};
      }`;
    }

    const vars = `
      :root {
        --brvl-text-color: ${theme.textColor};
        --brvl-bg-from: ${theme.baseBgFrom};
        --brvl-bg-to: ${theme.baseBgTo};
        --brvl-border-color: ${theme.borderColor};
        --brvl-accent: ${theme.accentColor};
        --brvl-link: ${theme.linkColor};
        --brvl-card-radius: 16px;
        --brvl-button-radius: 10px;
        --brvl-opacity: ${savedOpacity || theme.opacity || 0.65};
        --brvl-shadow: 0 0 0 1px var(--brvl-border-color);
        --brvl-bg-from-rgb: ${hexToRgb(theme.baseBgFrom)};
        --brvl-bg-to-rgb: ${hexToRgb(theme.baseBgTo)};
        --brvl-accent-rgb: ${hexToRgb(theme.accentColor)};
      }
      html {
        scroll-behavior: smooth;
      }
      ${backgroundCSS}
    `;

    const effectsEnabled = localStorage.getItem(LS_EFFECTS_KEY) === 'true';
    const extraEffectsEnabled = localStorage.getItem(LS_EXTRA_EFFECTS_KEY) === 'true';
    const textGlowEnabled = localStorage.getItem(LS_TEXT_GLOW_KEY) === 'true';

    let mainAnimation = '';
    let extraAnimation = '';
    let textGlowCSS = '';

    if (effectsEnabled) {
      mainAnimation = `
        @keyframes animated-gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        body .username span[style*="color: rgb(255, 0, 0)"],
        body .username span[style*="color: rgb(0, 255, 255)"],
        body .username span[style*="color: rgb(255, 165, 0)"],
        body .username span[style*="color: rgb(0, 128, 0)"],
        body .username span[style*="color: rgb(218, 165, 32)"] {
          background: linear-gradient(90deg, var(--brvl-accent), var(--brvl-link), var(--brvl-accent));
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent !important;
          animation: animated-gradient-text 3s ease infinite;
          font-weight: bold;
        }

        @keyframes animated-gradient-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        body .message-avatar .avatar {
          padding: 1px;
          background: linear-gradient(60deg, var(--brvl-accent), var(--brvl-link), var(--brvl-accent));
          background-size: 200% 200%;
          animation: animated-gradient-border 4s ease-in-out infinite;
          border-radius: 50%;
        }
        body .message-avatar .avatar img { border-radius: 50%; }

        @keyframes subtle-glow {
          0%, 100% { box-shadow: 0 0 2px 0px rgba(var(--brvl-accent-rgb), 0.2); }
          50% { box-shadow: 0 0 6px 1px rgba(var(--brvl-accent-rgb), 0.6); }
        }
        body .structItem:hover, body .message-inner:hover {
          animation: subtle-glow 2.5s ease-in-out infinite;
        }
        
        body .message-cell--user:hover {
          filter: brightness(1.05);
          transform: scale(1.01);
        }
        body .message-cell--user:active {
          transform: scale(0.99);
          filter: brightness(0.95);
        }

        body .button.button--primary:hover, body .button.button--cta:hover {
            transform: translateY(-2px);
            filter: brightness(1.15);
            box-shadow: var(--brvl-shadow), 0 4px 8px rgba(var(--brvl-accent-rgb), 0.3);
        }
      `;

      if (theme.pulse) {
        mainAnimation += `
          @keyframes subtle-pulse {
            0% {
              box-shadow: 0 -2px var(--brvl-text-color) inset, 0 0 5px 0px rgba(var(--brvl-accent-rgb), 0.3);
            }
            50% {
              box-shadow: 0 -2px var(--brvl-text-color) inset, 0 0 10px 2px rgba(var(--brvl-accent-rgb), 0.7);
            }
            100% {
              box-shadow: 0 -2px var(--brvl-text-color) inset, 0 0 5px 0px rgba(var(--brvl-accent-rgb), 0.3);
            }
          }
          body .pageNav-page.pageNav-page--current {
            box-shadow: none;
            animation: subtle-pulse 2s ease-in-out infinite;
          }

          @keyframes animated-gradient-block-border {
            0% { border-image-source: linear-gradient(0deg, var(--brvl-accent), var(--brvl-link)); }
            25% { border-image-source: linear-gradient(90deg, var(--brvl-accent), var(--brvl-link)); }
            50% { border-image-source: linear-gradient(180deg, var(--brvl-accent), var(--brvl-link)); }
            75% { border-image-source: linear-gradient(270deg, var(--brvl-accent), var(--brvl-link)); }
            100% { border-image-source: linear-gradient(360deg, var(--brvl-accent), var(--brvl-link)); }
          }
          body .block-container, body .message-inner, body .structItem, body .p-nav, body .p-header, body .p-staffBar, body .p-footer-copyrightRow,
          body .overlay-content, body .userCard-content, body .tooltip-content, body .menu-content, body .input, body .fr-box.fr-basic, body .bbCodeBlock {
            border: 1px solid transparent !important;
            border-image-slice: 1;
            border-image-width: 1px;
            animation: animated-gradient-block-border 8s ease-in-out infinite alternate;
          }
          body .block-container, body .message-inner, body .structItem, body .p-nav, body .p-header, body .p-staffBar, body .p-footer-copyrightRow,
          body .overlay-content, body .userCard-content, body .tooltip-content, body .menu-content, body .input, body .fr-box.fr-basic, body .bbCodeBlock {
            box-shadow: none !important;
          }
        `;
      } else {
         mainAnimation += `
            body .pageNav-page.pageNav-page--current {
              box-shadow: var(--brvl-shadow);
            }
         `;
      }
    } else {
        mainAnimation += `
            body .pageNav-page.pageNav-page--current {
              box-shadow: var(--brvl-shadow);
            }
         `;
    }

    if (extraEffectsEnabled) {
      extraAnimation = `
        @keyframes fadeInScaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        body .overlay-content, body .tooltip-content, body .menu-content {
          animation: fadeInScaleUp 0.2s ease-out;
        }

        body .button--scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.3s ease, transform 0.3s ease !important;
        }
        body .button--scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        body .fr-box:focus-within,
        body .input:focus {
           box-shadow: var(--brvl-shadow), 0 0 10px 2px rgba(var(--brvl-accent-rgb), 0.7) !important;
        }

        @keyframes unreadPulse {
          0% { box-shadow: 0 0 0 0px rgba(var(--brvl-accent-rgb), 0.3); }
          50% { box-shadow: 0 0 0 3px rgba(var(--brvl-accent-rgb), 0.1); }
          100% { box-shadow: 0 0 0 0px rgba(var(--brvl-accent-rgb), 0.3); }
        }
        body .structItem.is-unread {
          animation: unreadPulse 3s ease-in-out infinite;
        }

        body .bbCodeSpoiler {
          transition: all 0.3s ease;
        }
        body .bbCodeSpoiler-content {
          max-height: 500px;
          overflow: hidden;
          transition: max-height 0.5s ease-in-out, opacity 0.3s ease;
        }
        body .bbCodeSpoiler:not(.is-active) .bbCodeSpoiler-content {
          max-height: 0;
          opacity: 0;
        }
      `;
    }

    if (textGlowEnabled) {
      textGlowCSS = `
        body, body .block-container, body .message-body, body .fr-element, body h1, body h2, body h3, body h4, body h5, body h6, body .block-minorHeader,
        body .block-tabHeader .tabs-tab.is-active, body .block-tabHeader .tabs>input:checked+.tabs-tab--radio, body .pageNav-page.pageNav-page--current,
        body .datalist-row.datalist-row--header .datalist-cell, body .p-nav-list .p-navEl a, body .input,
        body .p-nav-panel .p-navEl-link, body .message-user, body .message-userTitle, body .message-userBanner, body .bbCodeBlock, body .bbCodeBlock-title, body .bbCodeBlock-content,
        body .structItem-meta, body .pairs.pairs--inline, body .structItem-cell, body .userCard-content, body .userCard-row, body .userCard-name, body .menu-header, body .menu-footer,
        body .username, body .button .button-text {
            text-shadow: 0 0 8px rgba(var(--brvl-accent-rgb), 0.6), 0 0 12px rgba(var(--brvl-link), 0.4);
        }
      `;
    }

    const themeCSS = `
      body .structItem, body .button, body .p-navEl a, body .tabs-tab, body .menu-linkRow,
      body .message-cell--user, body .message-avatar .avatar, body .block-container,
      body .message-inner, body .p-nav, body .p-header, body .p-staffBar, body .input,
      body .bbCodeBlock, body .p-footer-copyrightRow, body .p-nav-panel, body .fr-box,
      body .p-body, body .overlay-content, body .userCard-content, body .tooltip-content, body .menu-content {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease, filter 0.25s ease, opacity 0.3s ease;
        transform: translateZ(0);
        border: none !important;
      }
      body .button:active, body .tabs-tab:active, body .p-navEl a:active {
        transform: scale(0.98);
      }
      body {
        background: transparent !important;
      }

      body, body .block-container, body .message-body, body .fr-element, body h1, body h2, body h3, body h4, body h5, body h6,
      body .block-minorHeader, body .block-tabHeader .tabs-tab.is-active, body .block-tabHeader .tabs>input:checked+.tabs-tab--radio,
      body .pageNav-page.pageNav-page--current, body .dataList-row.dataList-row--header .dataList-cell,
      body .p-nav-list .p-navEl a, body .input, body .p-nav-panel .p-navEl-link, body .message-user, body .message-userTitle,
      body .message-userBanner, body .bbCodeBlock, body .bbCodeBlock-title, body .bbCodeBlock-content,
      body .structItem-meta, body .pairs.pairs--inline, body .structItem-cell, body .userCard-content,
      body .userCard-row, body .userCard-name, body .menu-header, body .menu-footer {
        color: var(--brvl-text-color) !important;
      }

      body .block-container, body .message-responseRow, body .fr-box.fr-basic, body .pageNav-jump,
      body .block-minorHeader.uix_threadListSeparator, body .blockStatus, body .uix_nodeList .block-body,
      body .message-cell--user, body .bbCodeBlock-content, body .message-inner,
      body .message-editorWrapper, body .message-editor, body .structItem, body .block-body,
      body .p-body-main .p-body-content, body .node--forum .node-body, body .node--category .node-body {
        background-color: rgba(var(--brvl-bg-from-rgb), var(--brvl-opacity)) !important;
        box-shadow: var(--brvl-shadow);
        border-radius: var(--brvl-card-radius);
      }

      body .p-staffBar, body .p-header, body .p-footer-copyrightRow, body .p-footer-inner, body .p-nav,
      body .p-nav-panel, body .p-nav-panel .p-navEl {
        background-color: rgba(var(--brvl-bg-from-rgb), 0.9) !important;
        box-shadow: var(--brvl-shadow);
        color: var(--brvl-text-color) !important;
      }
      body .p-header, body .p-nav { border-bottom: none !important; }
      body .p-footer-copyrightRow, body .p-footer-inner { border-top: none !important; }
      body .p-nav-list .p-navEl.is-selected {
        background-color: rgba(var(--brvl-bg-from-rgb), .5) !important;
      }

      body .overlay-container .overlay, body .userCard, body .tooltip, body .menu {
        backdrop-filter: none !important;
        background: transparent !important;
      }
      body .overlay-content, body .userCard-content, body .tooltip-content, body .menu-content {
        background-color: rgba(var(--brvl-bg-from-rgb), 0.95) !important;
        box-shadow: var(--brvl-shadow), 0 5px 15px rgba(0,0,0,0.3);
        border-radius: var(--brvl-card-radius);
      }
      body .overlay-title { border-bottom: none !important; }

      body .button.button--link, body button.button a.button.button--link,
      body .button.button--primary, body button.button a.button.button--primary,
      body .button.button--cta, body button.button a.button.button--cta {
        color: var(--brvl-text-color) !important;
        box-shadow: var(--brvl-shadow);
        border-radius: var(--brvl-button-radius);
        background-color: rgba(var(--brvl-bg-from-rgb), 0.9) !important;
      }
      body .button.button--primary:active, body .button.button--cta:active {
        transform: translateY(1px) scale(0.98);
        filter: brightness(0.95);
        box-shadow: var(--brvl-shadow);
      }
      body .input {
        background-color: rgba(var(--brvl-bg-from-rgb), 0.9) !important;
        box-shadow: var(--brvl-shadow);
      }
      body .pageNav-page {
        background-color: rgba(var(--brvl-bg-to-rgb), 0.7);
      }
      body .block-tabHeader .tabs-tab:not(.is-readonly):hover {
        color: var(--brvl-text-color);
        background: rgba(255,255,255,.1);
      }
      body .block-tabHeader .tabs-tab.is-active, body .block-tabHeader .tabs>input:checked+.tabs-tab--radio {
        border-color: var(--brvl-border-color);
        text-shadow: 0 0 10px var(--brvl-text-color);
      }

      body a, body .link, body .contentRow-title a, body .structItem-title a {
        color: var(--brvl-accent) !important;
      }
      body .username {
        color: var(--brvl-accent) !important;
        font-weight: bold;
      }
      body .tabs-tab:hover, body .menu-linkRow:hover, body a:hover {
        filter: brightness(1.1);
      }
      body .p-staffBar .pageContent a {
        color: var(--brvl-link); font-weight: 900; transition-duration: .5s; font-style: italic;
        text-decoration: none; text-shadow: 0 0 10px #888;
      }

      body .message-cell--user { border-radius: var(--brvl-card-radius) 0 0 var(--brvl-card-radius); }
      body .message-inner { border-radius: 0 var(--brvl-card-radius) var(--brvl-card-radius) 0; }
      body .structItem { margin-bottom: 8px !important; }
      body .bbCodeBlock { background: transparent !important; box-shadow: var(--brvl-shadow); }
      body .message-cell.message-cell--action { background: none; border-right: none !important; }
      body .block--messages.block .message, body .js-quickReply.block .message, body .block--messages .block-row, body .js-quickReply .block-row,
      body .node-stats>dl.pairs.pairs--rows, body .node-body, body .node--depth2:nth-child(even) .node-body,
      body .structItem-cell, body .overlay-title, body .dataList-row.dataList-row--header .dataList-cell,
      body .dataList-cell.dataList-cell--alt, body .dataList-cell.dataList-cell--action, body .menu-header, body .menu-footer {
        background: none !important;
        box-shadow: none !important;
      }
      body .button.button--scroll, body button.button a.button.button--scroll, body .alert.is-unread {
        background-color: rgba(var(--brvl-bg-from-rgb), 0.8) !important;
      }
      body .p-body-sidebar .block-minorHeader { border-bottom: none !important; }

      body::-webkit-scrollbar { width: 16px; }
      body::-webkit-scrollbar-track { background: #808080 !important; }
      body::-webkit-scrollbar-thumb { background: linear-gradient(#808080, #fff, #808080) !important; }
    `;

    themeNode.textContent = vars + themeCSS + mainAnimation + extraAnimation + textGlowCSS;
  }

  applyTheme(localStorage.getItem(LS_THEME_KEY) || 'Выкл (Стандарт)');

  function initDelayed() {
    const addHandlebars = new Promise((resolve) => {
      const tag = document.createElement('script');
      tag.src = 'https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js';
      tag.onload = resolve;
      document.body.appendChild(tag);
    });

    const UNACCEPT_PREFIX = 4;
    const ACCEPT_PREFIX = 8;
    const PIN_PREFIX = 2;
    const GA_PREFIX = 12;
    const COMMAND_PREFIX = 10;
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECIAL_PREFIX = 11;

    // =========================================================================================
    //
   const buttons = [
        {
      title: `--------------------------------------------------------------------> АДМИН РАЗДЕЛ <------------------------------------------------`,
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

},

     {
	  title: `этот раздел пока не работает не трогать его!!!!!!!!!!!!`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS]этот раздел пока не работает не трогать его!!!!!!!!!!!![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)] С By.Fantom_Stark[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Неактивы`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления на неактив были успешно проверены![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)] С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Доп. Баллы`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши доп. баллы были успешно проверены![/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Имущество`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления покупку/продажу/обмен имущества были успешно проверены и одобрены![/COLOR]<br><br>`+
        `Отказанные заявки перечислил выше. Все взаимодействия с имуществом после 22:00, при репорте меньше 10.<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },
     {
	  title: `Снятие наказаний`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5)',
	  content:
		`[CENTER][COLOR=rgb(0, 255, 127)][FONT=Trebuchet MS] Уважаемая Администрация! Сообщаю вам, что ваши заявления на снятие наказаний были проверены и одобрены! Отказанные заявки отметил выше.[/COLOR]<br><br>`+
        `[COLOR=rgb(255, 0, 0)]С уважением, Руководство Сервера.[/FONT][/COLOR][/CENTER]`,
          prefix: 123,
	  status: false,
     },

{
      title: `-------------------------------------------------------------------> ПЕРЕАДРЕСАЦИИ <-----------------------------------------------`,
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

},
    {
      title: `Жалобу в адм раздел`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вам нужно обратиться в раздел жалоб на Администрацию → [/ICODE] [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3482/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `В раздел ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел Обжалование → [/ICODE] [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3485/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: `В раздел жалоб на игроков`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел жалоб на игроков  → [/ICODE] [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.3484/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `В раздел жалоб на лидеров`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел жалоб на лидеров  → [/ICODE] [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.3483/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
        prefix: CLOSE_PREFIX,
        status: false,
	},
    {
      title: `Жалобу на теха`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Вам нужно обратиться в раздел жалоб на технических специалистов → [/ICODE] [URL='https://forum.blackrussia.online/forums/Сервер-№78-vladimir.3463/']*Кликабельно*[/URL][/SIZE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0026][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
        prefix: CLOSE_PREFIX,
        status: false,
    },
         {
     title: '------------------------------------------------------------------->Передам(жб) <--------------------------------------------',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
        {
      title: 'для сакаро',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба была передана на рассмотрение [/ICODE][COLOR=#00FFFF][ICODE]Руководителю Модерации Дискорда.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: PIN_PREFIX,
	  status: true,
    },
    {
	  title: `Передать ЗГА ГОСС & ОПГ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Передаю вашу жалобу [/ICODE][COLOR=#FF0000][ICODE]Заместителю Главного Администратора по направлению ГОСС & ОПГ. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: `Передать  ОЗГА`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
                         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Передаю вашу жалобу[/ICODE][COLOR=#FF0000][ICODE] Основному Заместителю Главного Администратора. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: `Передать ГА`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
           "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Передаю вашу жалобу[/ICODE][COLOR=#FF0000][ICODE] Главному Администратору. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: `Спец. Админ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба передана[/ICODE][COLOR=#FF0000][ICODE] Специальной Администрации. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: SPECIAL_PREFIX,
      status: true,
    },
        {
     title: '-------------------------------------------------------------------> Передам(ОБЖ) <----------------------------------------------------',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
         {
      title: 'для сакаро',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба была передана на рассмотрение [/ICODE][COLOR=#00FFFF][ICODE]Руководителю Модерации Дискорда.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: PIN_PREFIX,
	  status: true,
    },
        {
	  title: `Передать ГА`,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
           "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Передаю вашу жалобу[/ICODE][COLOR=#FF0000][ICODE] Главному Администратору. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: GA_PREFIX,
	  status: true,
    },
           {
      title: `Спец. Админ`,
               dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба передана[/ICODE][COLOR=#FF0000][ICODE] Специальной Администрации. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: SPECIAL_PREFIX,
      status: true,
    },
         {
     title: '------------------------------------------------------------------->на рассмотрении <------------------------------------------------',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
        {
        title: `На рассмотрении(обжалование)`,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваше обжалование взято  [/ICODE][COLOR=#FFFF00][ICODE]на рассмотрение. [/ICODE][/COLOR]<br>[ICODE] Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00[ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
         prefix: PIN_PREFIX,
      status: true,
        },
             {
      title: `На рассмотрении(жб)`,
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE] Ваша жалоба взята [/ICODE][COLOR=#FFFF00][ICODE]на рассмотрение. [/ICODE][/COLOR]<br>[ICODE] Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: PIN_PREFIX,
      status: true,
    },
          {
      title: `ссылку на жб`,
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
                "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Прикрепите ссылку на данную жалобу в течении 24 часов.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
       prefix: PIN_PREFIX,
      status: 123,
    },

        {
      title: `ссылку на вк`,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Прикрепите ссылку на вашу страницу в ВК.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: PIN_PREFIX,
      status: 123,
    },
        {
     title: '-------------------------------------------------------------------> ДОКИ <---------------------------------------------',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

    },
         {
       title: `запрошу доки`,
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Запрошу доказательства у администратора.[/ICODE][COLOR=#FFFF00][ICODE]Ожидайте. [/ICODE][/COLOR]<br>[ICODE] пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
        prefix: PIN_PREFIX,
	  status: true,
        },
        {
      title: 'выдано верно',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Проверив доказательства администратора, было принято решение, что наказание было выдано верно.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'выдано не верно',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
                            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В следствие беседы с администратором, было выяснено, что наказание было выдано по ошибке. <br> Ваше наказание будет снято.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: ACCEPT_PREFIX,
	  status: false,
    },

{
	   title: `---------------------------------------------------> Раздел Жалоб на администрацию <---------------------------------------`,
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',

},
        {
      title: 'будет проинструктирован',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'проведу беседу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба была одобрена и будет проведена беседа с администратором. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'проведу строгую беседу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба была одобрена и будет проведена строгая беседа с администратором. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Адм будет наказан',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]]Ваша жалоба была одобрена и администратор получит наказание. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: ACCEPT_PREFIX,
	  status: false,
    },

        {
      title: 'не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию -[/ICODE] [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
               prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Нет /time',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В предоставленных доказательствах отсутствует /time.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'Нет /myreports',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В предоставленных доказательствах отсутствует /myreports.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'От 3 лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Жалобы написанные от 3-его лица не подлежат рассмотрению.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'Нужен фрапс',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Фрапс обрывается',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
               "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Дока-во отредактированы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Представленные доказательства были отредактированны, пожалуйста прикрепите оригинал.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Прошло более 48 часов',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'нет строки выдачи наказания',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]На ваших доказательствах отсутствует строка с выдачей наказания.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'нет окна бана',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]На ваших доказательствах отсутствует окно блокировки аккаунта. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
             prefix: CLOSE_PREFIX,
	  status: false,
    },
         {
      title: 'нет докв',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашей жалобе отсутствуют доказательства. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
              prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'не работают доки',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Предоставленные доказательства не рабочие. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'дубликат',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
              "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },

        {
      title: 'нет нарушений',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется! [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'адм снят/псж',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Администратор был снят/ушел с поста администратора.  [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'ошиблись сервером',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Вы ошиблись сервером. <br>Обратитесь в раздел жалоб на администрацию вашего сервера.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'нет ссылки на жб',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Нет ссылки на данную жалобу.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'не написал ник',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
            "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
	  title: 'перезагрузи роутер',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
             "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Перезагрузите роутер.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
            prefix: CLOSE_PREFIX,
	  status: false,
    },

{
            title: `--------------------------------------------------------------------> ОБЖАЛОВАНИЯ <---------------------------------------------------`,
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5)',
},
    {
      title: `Сократить наказание`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваше обжалование одобрено. Наказание будет снижено[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Снять наказание`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваше обжалование одобрено, наказание будет полностью снято.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#00FF00][ICODE]Одобрено.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Обжалование на рассмотрении`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваша тема взята на рассмотрение. Пожалуйста, не создавайте её копии.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ffffff][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
      status: true,
    },
    {
	  title: `Смена ника`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваш аккаунт будет разблокирован на 24 часа. За это время вы должны успеть поменять свой игровой nickname через /mm -> Смена имени или через /donate. После чего пришлите в данную тему скриншот с доказательтвом того, что вы изменили его. Если он не будет изменён, то аккаунт будет обратно заблокирован.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFF00][ICODE]На рассмотрении.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: `NonRP обман (разбан на 24 часа)`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Аккаунт разблокирован на 24 часа. За это время ущерб должен быть возмещен обманутой стороне в полном объёме.<br>Прикрепите фрапс обмена с /time в данную тему. [/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#ffffff][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: `Отказать ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В обжаловании отказано.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `ОБЖ не подлежит`,
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                 "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Данное наказание не подлежит обжалованию.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `NonRP обман (не тот написал)`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Если вы готовы возместить ущерб обманутой стороне, то самостоятельно свяжитесь с игроком в любым способом.<br>Для возврата имущества он должен оформить обжалование.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Обж не по форме`,
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Обжалование составлено не по форме, ознакомьтесь с правилами подачи обжалований →.[/ICODE][URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Кликабельно*[/URL]. <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нет док-в в ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашем обжаловании отсутствуют доказательства для дальнейшего расмотрения.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нерабочие док-ва в ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашем обжаловании не работают доказательства.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Дублирование ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ответ был дан в прошлой теме. Напоминаю, что за дублирование тем ваш форумный аккаунт будет заблокирован.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `ОБЖ уже на рассмотрении`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
                     "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Уже одно подобное обжалование от вашего лица находится на рассмотрении у Руководства сервера.<br>Пожалуйста, прекратите создавать повторяющиеся темы.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Неадекват ОБЖ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
          "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Обжалование составлено в неадекватном формате. Рассмотрению не подлежит.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Нет ссылки на VK`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]В вашем обжаловании отсутствует ссылка на вашу страницу VK. Прикрепите ее в следующем обращении для дальнейшего рассмотрения.[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: `вам надо  связаться в соц сетях`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]«Если вы хотите обжаловать данную блокировку вам необходимо связаться в соц сетях с игроком которого вы обманули и договориться о возврате имущества»[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FF0000][ICODE]Закрыто.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: `Обж для ГА`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
        "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Передаю ваше обжалование Главному Администратору[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: `ОБЖ для Спец. Админ`,
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
      content:
         "[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=ffffff][ICODE]Ваше обжалование передано Специальной Администрации на рассмотрение[/ICODE] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCG97p5p/Pics-Art-07-12-03-23-18-1.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][SIZE=4][COLOR=#FFFFFF][ICODE]Ожидайте ответа.[/ICODE][/SIZE][/COLOR]<br><br>" +
           "[I][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=#ffc6b4][B][SIZE=5] Vladimir[/SIZE][/B][/COLOR]",
      prefix: SPECIAL_PREFIX,
      status: true,
    },
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы

        addButton('Меню', 'selectAnswer', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255,  20, 147, 0.5);');
        addButton('Одобрить', 'accepted', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
        addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
        addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);');
        addButton('Отказать', 'unaccept', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton('Закрыть', 'closed', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton ('Спецу', 'specialAdmin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton ('ГА', 'mainAdmin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(235, 21, 21, 0.5);');
        addButton('КП', 'teamProject', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);');


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#closed`).click(() => editThreadData(COMMAND_PREFIX, false));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    const bgButtons = document.querySelector(".pageContent");
const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

    const Button2 = buttonConfig("Общие правила серверов", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/");

    bgButtons.append(Button2);

     function addAnswers() {
		$('.button--icon--reply').before(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectComplaintAnswer" style="oswald: 3px; margin-bottom: 5px; border-radius: 13px;">Меню</button>`,
	);
	}

      function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
    }

   function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

  function tasksMarkup(buttons) {
  return `<div class="select_answer">${buttons
    .map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button ` +
        `rippleButton" style="margin:6px; width:300px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}
    // =========================================================================================

    function addButton(name, id, style, container) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'button--primary button rippleButton';
      btn.id = id;
      btn.style = style;
      btn.textContent = name;
      container.insertBefore(btn, container.querySelector('.button--icon--reply'));
    }

    function buttonsMarkup(buttons) {
      return `<div class="select_answer">${buttons
        .map((btn, i) =>
          `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:4px; ${btn.dpstyle}">
            <span class="button-text">${btn.title}</span>
          </button>`
        )
        .join('')}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
      if (typeof Handlebars === 'undefined') { console.warn('Handlebars not ready'); return; }
      if (!buttons[id].content) return;

      const template = Handlebars.compile(buttons[id].content);
      const $placeholder = document.querySelector('.fr-element.fr-view p');
      if ($placeholder && $placeholder.textContent === '') $placeholder.innerHTML = '';

      const spanPH = document.querySelector('span.fr-placeholder');
      if (spanPH) spanPH.innerHTML = '';

      const editor = document.querySelector('div.fr-element.fr-view p');
      if (editor) editor.insertAdjacentHTML('beforeend', template(data));

      const closer = document.querySelector('a.overlay-titleCloser');
      closer && closer.click();

      if (send === true) {
        editThreadData(buttons[id].prefix, buttons[id].status);
        const sendBtn = document.querySelector('.button--icon.button--icon--reply.rippleButton');
        sendBtn && sendBtn.click();
      }
    }

    function getThreadData() {
      const author = document.querySelector('a.username');
      const authorID = author ? author.getAttribute('data-user-id') : '0';
      const authorName = author ? author.innerHTML : 'Игрок';
      const hours = new Date().getHours();
      return {
        user: {
          id: authorID,
          name: authorName,
          mention: `[USER=${authorID}]${authorName}[/USER]`,
        },
        greeting: () =>
          4 < hours && hours <= 11 ? 'Доброе утро' :
          11 < hours && hours <= 15 ? 'Добрый день' :
          15 < hours && hours <= 21 ? 'Добрый вечер' : 'Доброй ночи',
      };
    }

    function getFormData(data) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      return formData;
    }

    function editThreadData(prefix, pin = false) {
      const titleNode = document.querySelector('.p-title-value');
      const threadTitle = titleNode ? titleNode.lastChild.textContent : document.title;
      const url = `${document.URL}edit`;

      const bodyBase = {
        prefix_id: prefix,
        title: threadTitle,
        _xfToken: (window.XF && XF.config ? XF.config.csrf : ''),
        _xfRequestUri: (window.XF && XF.config ? document.URL.split(XF.config.url.fullBase)[1] : ''),
        _xfWithData: 1,
        _xfResponseType: 'json',
      };
      if (pin) bodyBase.sticky = 1;

      const formData = getFormData(bodyBase);
      fetch(url, { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'ok') {
            location.reload();
          } else if (data.errors) {
            console.error('Error editing thread:', data.errors);
          }
        })
        .catch(err => console.warn('editThreadData error', err));
    }

    function initAdminButtons() {
      const replyBtn = document.querySelector('.button--icon--reply');
      if (!replyBtn) return;
      const container = replyBtn.parentElement;
      if (!container) return;

      const adminButtons = [
        { id: 'selectAnswer', text: 'Меню', color: 'rgb(255, 20, 147, 0.5)' },
        { id: 'accepted', text: 'Одобрить', color: 'rgb(152, 251, 152, 0.5)', prefix: ACCEPT_PREFIX, status: false },
        { id: 'watched', text: 'Рассмотрено', color: 'rgb(152, 251, 152, 0.5)', prefix: WATCHED_PREFIX, status: false },
        { id: 'pin', text: 'На рассмотрение', color: 'rgb(236, 124, 38, 0.5)', prefix: PIN_PREFIX, status: true },
        { id: 'unaccept', text: 'Отказать', color: 'rgb(235, 21, 21, 0.5)', prefix: UNACCEPT_PREFIX, status: false },
        { id: 'closed', text: 'Закрыть', color: 'rgb(235, 21, 21, 0.5)', prefix: CLOSE_PREFIX, status: false },
        { id: 'specialAdmin', text: 'Спецу', color: 'rgb(235, 21, 21, 0.5)', prefix: SPECIAL_PREFIX, status: true },
        { id: 'mainAdmin', text: 'ГА', color: 'rgb(235, 21, 21, 0.5)', prefix: GA_PREFIX, status: true },
        { id: 'teamProject', text: 'КП', color: 'rgb(236, 124, 38, 0.5)', prefix: COMMAND_PREFIX, status: true },
      ];

      adminButtons.forEach(btn => {
        const style = `border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: ${btn.color};`;
        addButton(btn.text, btn.id, style, container);
      });

      const threadData = getThreadData();
      const byId = (id) => document.getElementById(id);

      adminButtons.forEach(btnConfig => {
        const btnElement = byId(btnConfig.id);
        if (btnElement) {
          if (btnConfig.id === 'selectAnswer') {
            btnElement.addEventListener('click', () => {
              if (!window.XF || !XF.alert) {
                alert('XF.alert недоступен');
                return;
              }
              XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
              buttons.forEach((btn, id) => {
                const b = document.getElementById(`answers-${id}`);
                if (!b) return;
                b.addEventListener('click', () => {
                  if (buttons[id].content) {
                    pasteContent(id, threadData, id > 1);
                  } else {
                    const closer = document.querySelector('a.overlay-titleCloser');
                    closer && closer.click();
                  }
                });
              });
            });
          } else {
            if (btnConfig.prefix !== undefined) {
                btnElement.addEventListener('click', () => editThreadData(btnConfig.prefix, btnConfig.status));
            }
          }
        }
      });

      const bgButtons = document.querySelector(".pageContent");
      if (bgButtons) {
        const buttonConfig = (text, href) => {
          const button = document.createElement("button");
          button.textContent = text;
          button.classList.add("bgButton");
          button.addEventListener("click", (e) => { window.location.href = href; });
          button.style.cssText = `
            margin: 6px;
            border: 1px solid var(--brvl-border-color, #888);
            border-radius: 10px;
            padding: 6px 10px;
            background: linear-gradient(90deg, var(--brvl-bg-from, #eee), var(--brvl-bg-to, #ccc));
            color: var(--brvl-text-color, #000);
          `;
          return button;
        };
        const Button2 = buttonConfig("Общие правила серверов", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/");
        bgButtons.append(Button2);
      }
    }

    function addThemeControls() {
      const replyBtn = document.querySelector('.button--icon--reply');
      if (!replyBtn) return;
      const container = replyBtn.parentElement;
      if (!container) return;

      const baseSelectStyle = `
        border-radius: 8px;
        background: #222;
        color: #f0f0f0;
        border: 1px solid #555;
        padding: 4px;
        font-size: 14px;
        margin-left: 4px;
      `;

      const themeLabel = document.createElement('label');
      themeLabel.textContent = 'Тема:';
      themeLabel.style.cssText = 'color: #ccc; font-size: 14px; margin-left: 10px;';

      const themeSelect = document.createElement('select');
      themeSelect.id = 'brvl-theme-select';
      themeSelect.style.cssText = baseSelectStyle;

      themeSelect.innerHTML = THEME_PRESETS.map(theme => {
        if (theme.type === 'header') {
          return `<option value="${theme.name}" disabled style="font-weight: bold; background: #111;">${theme.name}</option>`;
        }
        return `<option value="${theme.name}">${theme.name}</option>`;
      }).join('');

      themeSelect.value = localStorage.getItem(LS_THEME_KEY) || 'Выкл (Стандарт)';
      themeSelect.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        const currentTheme = localStorage.getItem(LS_THEME_KEY) || 'Выкл (Стандарт)';

        if (selectedValue === '🖼️ Установить свой фон...') {
          const url = prompt('Вставьте ПРЯМУЮ ССЫЛКА (URL) на фон.\n(Загрузите свое фото на Imgur/Postimages).\nОставьте пустым для сброса.', localStorage.getItem(LS_CUSTOM_BG_KEY) || '');
          if (url) {
            localStorage.setItem(LS_CUSTOM_BG_KEY, url);
          } else {
            localStorage.removeItem(LS_CUSTOM_BG_KEY);
          }
          applyTheme(currentTheme);
          themeSelect.value = currentTheme;
        } else if (selectedValue === '🎚️ Настроить прозрачность...') {
          const currentOpacity = localStorage.getItem(LS_OPACITY_KEY) || '0.8';
          const val = prompt('Введите прозрачность (от 0.1 до 1.0).\nНапример: 0.8\nОставьте пустым для сброса.', currentOpacity);
          const newOpacity = parseFloat(val);
          if (val && !isNaN(newOpacity) && newOpacity >= 0.1 && newOpacity >= 0.1 && newOpacity <= 1.0) {
            localStorage.setItem(LS_OPACITY_KEY, newOpacity.toString());
          } else if (val === '') {
            localStorage.removeItem(LS_OPACITY_KEY);
          }
          applyTheme(currentTheme);
          themeSelect.value = currentTheme;
        } else {
          applyTheme(selectedValue);
        }
      });

      const effectsLabel = document.createElement('label');
      effectsLabel.textContent = 'Эффекты:';
      effectsLabel.style.cssText = 'color: #ccc; font-size: 14px; margin-left: 10px;';

      const effectsSelect = document.createElement('select');
      effectsSelect.id = 'brvl-effects-select';
      effectsSelect.style.cssText = baseSelectStyle;

      function createEffectToggle(key, label) {
        const enabled = localStorage.getItem(key) === 'true';
        return {
          key,
          label,
          text: `${label}: [${enabled ? 'Вкл' : 'Выкл'}]`,
          enabled: enabled
        };
      }

      const toggles = {
        effects: createEffectToggle(LS_EFFECTS_KEY, '✨ Анимации'),
        blur: createEffectToggle(LS_BLUR_KEY, '🌀 Размытие'),
        extra: createEffectToggle(LS_EXTRA_EFFECTS_KEY, '🛠️ Доп. эффекты'),
        glow: createEffectToggle(LS_TEXT_GLOW_KEY, '🌟 Свечение'),
      };

      effectsSelect.innerHTML = `
        <option value="effects">${toggles.effects.text}</option>
        <option value="blur">${toggles.blur.text}</option>
        <option value="extra">${toggles.extra.text}</option>
        <option value="glow">${toggles.glow.text}</option>
      `;
      effectsSelect.value = 'effects';

      effectsSelect.addEventListener('change', (e) => {
        const selected = e.target.value;
        const toggle = toggles[selected];

        if (toggle) {
          const newState = !toggle.enabled;
          localStorage.setItem(toggle.key, newState ? 'true' : 'false');
          toggle.enabled = newState;

          const newLabel = `${toggle.label}: [${newState ? 'Вкл' : 'Выкл'}]`;
          const option = effectsSelect.querySelector(`option[value="${selected}"]`);
          if (option) option.textContent = newLabel;

          applyTheme(localStorage.getItem(LS_THEME_KEY) || 'Выкл (Стандарт)');
        }
        effectsSelect.value = selected;
      });

      container.prepend(effectsSelect);
      container.prepend(effectsLabel);
      container.prepend(themeSelect);
      container.prepend(themeLabel);
    }

    function initScrollEffects() {
      const scrollTopButton = document.querySelector('.button--scroll');
      if (!scrollTopButton) return;

      const extraEffectsEnabled = localStorage.getItem(LS_EXTRA_EFFECTS_KEY) === 'true';
      if (!extraEffectsEnabled) {
        scrollTopButton.classList.add('is-visible');
        return;
      }

      const checkScroll = () => {
        if (window.scrollY > 300) {
          scrollTopButton.classList.add('is-visible');
        } else {
          scrollTopButton.classList.remove('is-visible');
        }
      };
      document.addEventListener('scroll', checkScroll);
      checkScroll();
    }

    addHandlebars.then(() => {
      initAdminButtons();
      addThemeControls();
      initScrollEffects();
    });
  }

  if (document.readyState === 'loading' || document.readyState === 'interactive') {
    document.addEventListener('DOMContentLoaded', initDelayed);
  } else {
    initDelayed();
  }

})();

