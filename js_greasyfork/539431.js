// ==UserScript==
// @name         Qwen Chat: Wide Layout + Wider Scrollbar + Sticky Code Buttons
// @name:ru      Qwen Chat: Широкий макет + толстая прокрутка + липкие кнопки кода
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       a114_you
// @description     Customizable width percentage, removes max-width, enhances scrollbar, and adds sticky code buttons.
// @description:ru  Настраиваемая ширина, убирает ограничения ширины, улучшает скроллбар и добавляет липкие кнопки кода
// @match        https://chat.qwen.ai/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539431/Qwen%20Chat%3A%20Wide%20Layout%20%2B%20Wider%20Scrollbar%20%2B%20Sticky%20Code%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/539431/Qwen%20Chat%3A%20Wide%20Layout%20%2B%20Wider%20Scrollbar%20%2B%20Sticky%20Code%20Buttons.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // --- НАСТРОЙКИ ---
  const CFG = {
    contentWidth: 99,   // Ширина контента в процентах (50-100) - Content width in percentage (50-100)
    top: 40,            // Отступ сверху для липких кнопок      - Top padding for sticky buttons
    right: 15,          // Отступ справа для липких кнопок      - Right padding for sticky buttons
    size: '14px',       // Размер значков липких кнопок         - Sticky Button Icon Size
    bg: '#232326',      // Цвет фона липких кнопок              - Sticky Buttons Background Color
    scrollbarWidth: 16  // Ширина скроллбара в пикселях         - Scrollbar width in pixels
  };

  // Валидация настроек
  CFG.contentWidth = Math.max(50, Math.min(100, CFG.contentWidth));
  CFG.scrollbarWidth = Math.max(8, Math.min(32, CFG.scrollbarWidth));

  const css = `
    /* Универсальный box-sizing */
    *, *::before, *::after {
      box-sizing: border-box;
    }

    /* Убираем все ограничения ширины на всем пути от html до контента */
    html, body {
      overflow-x: hidden !important;
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Основной контейнер приложения */
    #app, .app-layout {
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
    }

    /* Основной контент чата */
    .chat-container {
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* ЦЕНТРАЛЬНЫЙ КОНТЕЙНЕР С НАСТРАИВАЕМОЙ ШИРИНОЙ */
    #chat-message-container,
    #chat-message-container > div,
    .chat-messages {
      max-width: none !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow-x: hidden !important;
    }

    /* Добавляем наш собственный центрирующий контейнер */
    #chat-message-container::before {
      content: '';
      display: block;
      width: ${CFG.contentWidth}%;
      max-width: ${CFG.contentWidth}%;
      height: 1px;
      margin: 0 auto;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: -1;
    }

    #chat-message-container > div {
      width: ${CFG.contentWidth}% !important;
      max-width: ${CFG.contentWidth}% !important;
      margin-left: auto !important;
      margin-right: auto !important;
      position: relative !important;
    }

    /* СТИЛИ ВЕРТИКАЛЬНОГО СКРОЛЛБАРА */
    ::-webkit-scrollbar {
      width: ${CFG.scrollbarWidth}px !important;
    }

    ::-webkit-scrollbar-track {
      background: transparent !important;
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(130,130,130,.7) !important;
      border-radius: ${CFG.scrollbarWidth/2}px !important;
      border: 4px solid transparent !important;
      background-clip: content-box !important;
      min-height: 50px !important;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: rgba(150,150,150,.8) !important;
    }

    /* Для контейнера чата */
    .chat-messages {
      overflow-x: hidden !important;
    }

    .chat-messages::-webkit-scrollbar {
      width: ${CFG.scrollbarWidth}px !important;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(130,130,130,.7) !important;
      border-radius: ${CFG.scrollbarWidth/2}px !important;
      border: 4px solid transparent !important;
      background-clip: content-box !important;
    }

    /* Липкие кнопки кода */
    .sticky-buttons-clone {
      position: fixed !important;
      z-index: 99999;
      display: flex;
      gap: 10px;
      background: ${CFG.bg} !important;
      border-radius: 6px;
      padding: 6px 8px;
      opacity: 0;
      transition: opacity .1s;
      pointer-events: auto;
      border: none !important;
      box-shadow: none !important;
    }
    .sticky-buttons-clone.visible {
      opacity: 1;
    }
    .sticky-buttons-clone div {
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    /* Значки кнопок */
    .sticky-buttons-clone svg {
      color: rgba(255,255,255,.8) !important;
      fill: rgba(255,255,255,.8) !important;
      width: ${CFG.size} !important;
      height: ${CFG.size} !important;
    }
    .sticky-buttons-clone div:hover svg {
      color: #fff !important;
      fill: #fff !important;
    }
    .hidden-by-sticky {
      opacity: 0 !important;
      pointer-events: none !important;
    }

    /* Защита от скролла */
    .flex.flex-col.h-full {
      overflow: hidden !important;
    }
    .flex-1.overflow-y-auto {
      overflow-x: hidden !important;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // --- ОСТАЛЬНОЙ КОД БЕЗ ИЗМЕНЕНИЙ ---
  const activeClones = new Map();
  const knownBlocks = new Set();

  const update = () => {
    knownBlocks.forEach(block => {
      if (!document.contains(block)) {
        const data = activeClones.get(block);
        if (data) data.clone.remove();
        activeClones.delete(block);
        knownBlocks.delete(block);
        return;
      }

      const header = block.querySelector('.qwen-markdown-code-header');
      const actions = block.querySelector('.qwen-markdown-code-header-actions');
      if (!header || !actions) return;

      const bRect = block.getBoundingClientRect();
      const hRect = header.getBoundingClientRect();

      const shouldShow = hRect.bottom < (CFG.top + 2) && bRect.bottom > 50;

      let data = activeClones.get(block);

      if (shouldShow) {
        if (!data) {
          const clone = actions.cloneNode(true);
          clone.className = 'sticky-buttons-clone';
          const origBtns = actions.querySelectorAll('.qwen-markdown-code-header-action-item');
          clone.querySelectorAll('.qwen-markdown-code-header-action-item').forEach((btn, i) => {
            btn.onclick = (e) => { e.stopPropagation(); origBtns[i]?.click(); };
          });
          document.body.appendChild(clone);
          requestAnimationFrame(() => clone.classList.add('visible'));
          data = { clone, actions };
          activeClones.set(block, data);
        }

        actions.classList.add('hidden-by-sticky');
        const h = data.clone.offsetHeight || 28;
        const top = Math.min(CFG.top, bRect.bottom - h - 10);
        data.clone.style.top = top + 'px';
        data.clone.style.right = (window.innerWidth - bRect.right + CFG.right) + 'px';
      } else if (data) {
        data.clone.classList.remove('visible');
        data.actions.classList.remove('hidden-by-sticky');
        setTimeout(() => {
          if (!data.clone.classList.contains('visible')) {
            data.clone.remove();
            activeClones.delete(block);
          }
        }, 100);
      }
    });
  };

  const domObserver = new MutationObserver((mutations) => {
    mutations.forEach(m => m.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        const blocks = node.classList?.contains('qwen-markdown-code') ? [node] : node.querySelectorAll('.qwen-markdown-code');
        blocks.forEach(b => {
            knownBlocks.add(b);
            update();
        });
      }
    }));
  });

  let frame;
  const onEvent = () => {
    if (!frame) {
      frame = requestAnimationFrame(() => {
        update();
        frame = null;
      });
    }
  };

  const init = () => {
    window.addEventListener('scroll', onEvent, { passive: true, capture: true });
    window.addEventListener('resize', onEvent, { passive: true });

    document.querySelectorAll('.qwen-markdown-code').forEach(b => knownBlocks.add(b));

    domObserver.observe(document.body, { childList: true, subtree: true });
    update();
  };

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();