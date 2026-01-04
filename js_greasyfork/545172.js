// ==UserScript==
// @name         Pinterest — Black
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Чёрная тема.
// @match        https://www.pinterest.com/*
// @match        https://ru.pinterest.com/*
// @run-at       document-start
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545172/Pinterest%20%E2%80%94%20Black.user.js
// @updateURL https://update.greasyfork.org/scripts/545172/Pinterest%20%E2%80%94%20Black.meta.js
// ==/UserScript==
(() => {
  'use strict';

  // Убрать любые мои старые стили
  document.querySelectorAll('style[id^="tm-pinterest-"]').forEach(n => n.remove());

  const css = `
    /* База */
    :root { color-scheme: dark !important; }
    html, body { background:#000 !important; color:#fff !important; }
    header, nav, main, aside, footer, [data-test-id="app-content"], [role="main"] {
      background:#000 !important; box-shadow:none !important;
    }

    /* Текст интерфейса (НЕ медиа/кнопки/формы) — чтобы подписи не пропадали */
    [data-test-id="app-content"] *:not(img):not(video):not(canvas):not(svg):not(picture):not(source):not(button):not([role="button"]):not(input):not(textarea) {
      color:#fff !important;
    }

    /* Поиск */
    [data-test-id="search-box"] input, input[role="combobox"] {
      background:#121212 !important; color:#fff !important;
      border:1px solid #2a2a2a !important; caret-color:#fff !important;
    }
    #SuggestionsMenu, [data-test-id="search-box-container"] [role="listbox"] {
      background:#0b0b0b !important; color:#fff !important;
      border:1px solid #1e1e1e !important; box-shadow:none !important;
    }

    /* Левая панель — иконки белые, фон чёрный */
    #VerticalNavContent, nav#VerticalNavContent, nav[aria-label], nav[role="navigation"] { background:#000 !important; }
    #VerticalNavContent [role="button"] { background:transparent !important; border-color:transparent !important; box-shadow:none !important; }
    #VerticalNavContent svg { color:#fff !important; fill:#fff !important; stroke:#fff !important; }

    /* ===== Карточные подложки (универсально) =====
       У Pinterest карточные оболочки часто имеют классы .a3i.imm.zI7 или инлайновый светлый background.
       Делаем их прозрачными везде, где это не медиа/кнопка/форма. */

    /* 1) Частые «карточки» */
    .a3i.imm.zI7,
    .imm.zI7,
    .a3i.zI7 {
      background:transparent !important; box-shadow:none !important; border-color:transparent !important;
    }

    /* 2) Любые внутренние оболочки со светлым инлайновым фоном */
    *[style*="background"]:not(img):not(video):not(canvas):not(svg):not(picture):not(source):not(button):not([role="button"]):not(input):not(textarea) {
      /* Прозрачный слой вместо белого/серого */
      background:transparent !important; box-shadow:none !important; border-color:transparent !important;
    }

    /* 3) Специально для просмотра пина (closeup): верхняя планка и обрамление вокруг арта */
    [data-test-id="closeup-action-bar"],
    [data-test-id="closeupActionBar"],
    [data-test-id="closeup-body-sticky-content"],
    [data-test-id*="closeup"] [role="toolbar"],
    .reactCloseupScrollContainer .a3i.imm.zI7 {
      background:transparent !important; box-shadow:none !important; border-color:transparent !important;
    }
    [data-test-id="closeup-legacy-container"],
    [data-test-id="closeup-legacy-content"],
    [data-test-id="closeup-body-style"] {
      background:#000 !important; color:#fff !important; border-color:#111 !important; box-shadow:none !important;
    }

    /* Плитки справа — без светлой подложки */
    [data-grid-item] { background:transparent !important; box-shadow:none !important; border-color:transparent !important; }
    [data-grid-item] :not(img):not(video):not(canvas):not(svg) { color:#fff !important; }

    /* Медиа и иконки — не трогаем */
    img, video, canvas, picture, source, svg { background:transparent !important; filter:none !important; mix-blend-mode:normal !important; opacity:1 !important; }
  `;

  const style = document.createElement('style');
  style.id = 'tm-pinterest-black-v81';
  style.textContent = css;
  document.documentElement.appendChild(style);
})();
