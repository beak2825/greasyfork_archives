// ==UserScript==
// @name         AnimeStars Full Black Theme (v3.0 beta)
// @namespace    http://tampermonkey.net/
// @version      3.0 B
// @description  Чёрная тема, исправление ошибок, обновление и доработка интерфейса
// @author       VladLIO
// @match        https://animestars.org/*
// @match        *://asstars.tv/*
// @match        *://astars.club/*
// @match        *://asstars.online/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545111/AnimeStars%20Full%20Black%20Theme%20%28v30%20beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545111/AnimeStars%20Full%20Black%20Theme%20%28v30%20beta%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ========= CONFIGURATION ========= */
  const SETTINGS = {
      SAFE_SIDE_GAP: 20,
      HEADER_MIN_HEIGHT: '220px', // Немного увеличили для гармонии
      BANNER_ANCHOR: 'poster',
      BANNER_TOP_OFFSET: 10,      // Подняли чуть выше для выравнивания с верхом постера
      POSTER_TOP_OFFSET: 50,
      MIN_BANNER_TOP: 60,
      BOTTOM_GAP: 20,
      MAX_HEADER_PADDING: 400,
      ALIGN_TO_POSTER_LEFT: true,
      TITLE_MAX_LINES: 3,         // Разрешаем 3 строки
      AUTO_FIT_ONE_LINE: true,
      MIN_TITLE_WIDTH: 320,
      MIN_FONT_PX: 24,            // Минимальный размер шрифта
      MAX_FONT_PX: 52             // Максимальный размер (гармоничный)
  };

  /* ========= SELECTORS ========= */

  const BLACK_SELECTORS = [
    'body', 'html', '.wrapper-as', '.wrapper-main', 'footer', '.page-padding',
    '.ncards', '.carou', '.sect__header', '.content', 'main',
    '.sect', '.footer', '.menu', '.desc', '.page__content', '.sect__padding',
    'header.header',
    '.anime-cards', '.anime-cards--full-page',
    '.nclub__sect', '.sect__content', '.remelt__inventory',
    '.card-filter-list', '.ncard__menu-content',
    '.dpm-dialog', '.dpm-editor-wrapper',
    '.menus', '.tabs-block__select',
    '.trade_inventory', '.trade__container', '.history', '.noffer__bg',
    'nav.filter-blockcat', '.flex-row-cat',
    '.login-modal', '.login-box', '.ui-dialog',
    '#alertsDropdownList', '.dropdown-list', '.dropdown-menu',
    '.card-awakening-list', '.awakening__main-items', '.awakening_main-items',
    '.awakening__main-user', '.awakening__controls', '.card-awakening-form',
    '.card-filter-form', '.card-filter-form__controls', 
    // Кнопки скриптов исключены
    '.b-translators__block', '.b-translators__list',
    '#kodik_player_ajax', '.video-inside',
    '.fdesc', '.full-text',
    '.pmovie__player-controls', '.pmovie_player-controls',
    '.sect.pmovie__franchise',
    '.page__fix-grid',
    '.tabs-block__content',
    '.stone_inventory', '.stone__inventory', '.stone_inner',
    '.stone__main-items', '.stone_main-items', '.stone_main', '.stone_charge-panel',
    '.ncomm-root',
    '.pmovie__player',
    '.multirating-wrapper'
  ].join(', ');

  const TRANSPARENT_SELECTORS = [
    '#asbm_bar', '#asbm_container', '.speedbar',
    'header + .page-padding', '.topline', '.breadcrumbs', '.toolbar',
    '.pcoln__header', '.pcoln_header',
    '.pcoln__info2',
    '.ncard__header',
    '.card-user-header',
    '.wrapper-container > .sect:first-child',
    '.user-profile-header'
  ].join(', ');

  /* ========= CSS STYLES ========= */
  const CSS = `
  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 10px; height: 10px; background: #080808; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #555; }
  ::-webkit-scrollbar-corner { background: #080808; }

  /* =========================================================================
     DARK THEME LOGIC
     ========================================================================= */

  /* 1. Global Black Backgrounds */
  body[data-theme="dark"] {
      background-color: #000 !important;
      color: #eee !important;
  }

  body[data-theme="dark"] :where(${BLACK_SELECTORS}) {
    background: #000 !important;
    background-color: #000 !important;
    background-image: none !important;
    border-color: #111 !important;
    color: #eee !important;
    box-shadow: none !important;
  }

  /* 2. AVATAR FIXES (Square) */
  body[data-theme="dark"] .ncomm__avatar img,
  body[data-theme="dark"] .avatar img,
  body[data-theme="dark"] img.avatar,
  body[data-theme="dark"] .ncomm__avatar {
      filter: none !important;
      opacity: 1 !important;
      background: transparent !important;
      box-shadow: none !important;
  }
  
  body[data-theme="dark"] img.avatar,
  body[data-theme="dark"] .avatar img {
      border-radius: 4px !important;
      object-fit: cover !important;
  }

  body[data-theme="dark"] img.profile-frame,
  body[data-theme="dark"] .profile-frame img,
  body[data-theme="dark"] img.avatar[src*="frame"],
  body[data-theme="dark"] img.avatar[src*="Frame"] {
      border-radius: 0 !important; 
      object-fit: contain !important;
  }

  /* 3. TOGGLE SWITCHES */
  body[data-theme="dark"] input[type="checkbox"] {
      -webkit-appearance: none !important;
      appearance: none !important;
      width: 40px !important;
      height: 20px !important;
      background: #4a1b1b !important; 
      border: 1px solid #666 !important;
      border-radius: 20px !important;
      cursor: pointer !important;
      outline: none !important;
      transition: background 0.3s, border-color 0.3s !important;
      display: inline-block !important;
      vertical-align: middle !important;
      position: relative !important;
      top: -2px !important;
      margin: 0 5px !important;
  }

  body[data-theme="dark"] input[type="checkbox"]::after {
      content: '' !important;
      position: absolute !important;
      top: 2px !important;
      left: 2px !important;
      width: 14px !important;
      height: 14px !important;
      background: #aaa !important; 
      border-radius: 50% !important;
      transition: left 0.3s, background 0.3s !important;
      box-shadow: 1px 1px 2px rgba(0,0,0,0.5) !important;
  }

  body[data-theme="dark"] input[type="checkbox"]:checked {
      background: #1b4a1b !important;
      border-color: #2e7d32 !important;
  }

  body[data-theme="dark"] input[type="checkbox"]:checked::after {
      left: 22px !important;
      background: #fff !important;
  }
  
  body[data-theme="dark"] input[type="checkbox"]:checked::before {
      display: none !important;
  }

  /* 4. Modern Button Grid */
  body[data-theme="dark"] .ncard__menu-tabs,
  body[data-theme="dark"] .ncard__subtabs,
  body[data-theme="dark"] .tabs-block:not(.pmovie__player) {
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: center !important;
      gap: 10px !important;
      margin-bottom: 20px !important;
  }
  
  body[data-theme="dark"] .pmovie__player.tabs-block,
  body[data-theme="dark"] .pmovie__player {
      display: block !important;
      flex: none !important;
      width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
  }

  body[data-theme="dark"] .ncard__menu-tabs a,
  body[data-theme="dark"] .ncard__subtabs a,
  body[data-theme="dark"] .ncard__subtabs span > a,
  body[data-theme="dark"] .watchlist__sort-active,
  body[data-theme="dark"] .kind_active > a {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: #1a1a1a !important;
      border: 1px solid #333 !important;
      border-radius: 8px !important;
      padding: 10px 20px !important;
      margin: 0 !important;
      color: #aaa !important;
      font-weight: 600 !important;
      font-size: 13px !important;
      text-transform: uppercase !important;
      text-decoration: none !important;
      transition: all 0.2s ease !important;
      min-width: 120px !important;
  }

  body[data-theme="dark"] .ncard__menu-tabs a:hover,
  body[data-theme="dark"] .watchlist__sort-active,
  body[data-theme="dark"] .kind_active > a {
      background: #333 !important;
      border-color: #555 !important;
      color: #fff !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
  }

  /* Form Buttons */
  body[data-theme="dark"] .form__btn,
  body[data-theme="dark"] .button[class*="create"],
  body[data-theme="dark"] button.form_btn,
  body[data-theme="dark"] .add-comments-form__btn {
      background: #222 !important;
      background-color: #222 !important;
      border: 1px solid #444 !important;
      color: #ddd !important;
      border-radius: 6px !important;
      transition: 0.2s !important;
  }
  
  body[data-theme="dark"] .add-comments-form__btn,
  body[data-theme="dark"] button[name="submit"] {
      color: #fff !important; 
      font-weight: bold !important;
  }

  body[data-theme="dark"] .form__btn:hover,
  body[data-theme="dark"] .add-comments-form__btn:hover {
      background: #444 !important;
      color: #fff !important;
  }

  /* 5. Rating Fix */
  body[data-theme="dark"] .multirating-wrapper {
      background: #000 !important;
      border: 1px solid #222 !important;
      width: 100% !important;
      box-sizing: border-box !important;
      border-radius: 6px !important;
      padding: 10px !important;
  }
  body[data-theme="dark"] .multirating-items-wrapper,
  body[data-theme="dark"] .multirating-item {
      background: transparent !important;
      border: none !important;
  }
  body[data-theme="dark"] .multirating-item * {
      text-shadow: none !important;
      color: #eee !important;
  }

  /* 6. Comment Fix */
  body[data-theme="dark"] .ncomm__text,
  body[data-theme="dark"] .ncomm__text.full-text,
  body[data-theme="dark"] .dpm-dialog-message-text {
      background: #111 !important;
      border: 1px solid #222 !important;
      border-radius: 8px !important;
      color: #ccc !important;
      padding: 12px !important;
  }
  body[data-theme="dark"] .ncomm__text *,
  body[data-theme="dark"] .dpm-dialog-message-text * {
      background: transparent !important;
      border: none !important;
      color: inherit !important;
  }
  body[data-theme="dark"] .ncomm__text::before,
  body[data-theme="dark"] .ncomm__text::after,
  body[data-theme="dark"] .dpm-dialog-message-text::before {
      content: none !important; display: none !important;
  }
  body[data-theme="dark"] .ncomm__header,
  body[data-theme="dark"] .ncomm__footer {
      opacity: 0.7; margin-bottom: 5px !important;
  }

  /* 7. PLAYER ALIGNMENT ULTIMATE FIX */
  body[data-theme="dark"] .pmovie__player,
  body[data-theme="dark"] .tabs-block__content {
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      border: none !important;
  }

  body[data-theme="dark"] #kodik-tab-player,
  body[data-theme="dark"] .video-inside,
  body[data-theme="dark"] #player, 
  body[data-theme="dark"] .b-player {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      margin: 0 !important; 
      padding: 0 !important;
      border-radius: 6px !important;
      overflow: hidden !important;
  }

  /* 8. HEADER ALIGNMENT & ROUNDING */
  body[data-theme="dark"] .pcoln,
  body[data-theme="dark"] .pcoln_header {
      width: 100% !important;
      max-width: 100% !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      border-radius: 12px !important;
      overflow: hidden !important; 
      box-sizing: border-box !important;
  }
  body[data-theme="dark"] .pcoln .blurred-bg,
  body[data-theme="dark"] .pcoln .bg {
      border-radius: 12px !important;
      left: 0 !important;
      width: 100% !important;
  }

  /* 9. Sidebar & Layout */
  body[data-theme="dark"] aside.col-side,
  body[data-theme="dark"] .col-side,
  body[data-theme="dark"] .col-side .side_block {
      background: #000 !important;
      border: none !important;
      box-shadow: none !important;
  }
  body[data-theme="dark"] .col-side a,
  body[data-theme="dark"] .col-side li {
      background: transparent !important;
      transition: background 0.2s ease;
  }
  body[data-theme="dark"] .col-side a:hover,
  body[data-theme="dark"] .col-side li:hover > a {
      background-color: rgba(255,255,255,0.1) !important;
      border-radius: 5px;
  }
  body[data-theme="dark"] aside.col-side::before,
  body[data-theme="dark"] aside.col-side::after { display: none !important; }

  /* Transparent Elements */
  body[data-theme="dark"] :where(${TRANSPARENT_SELECTORS}) {
    background: transparent !important;
    box-shadow: none !important;
    border-color: transparent !important;
  }

  /* Inputs */
  body[data-theme="dark"] input,
  body[data-theme="dark"] textarea,
  body[data-theme="dark"] select,
  body[data-theme="dark"] .form__field {
    background-color: #111 !important;
    color: #fff !important;
    border: 1px solid #333 !important;
  }

  /* Dropdowns */
  body[data-theme="dark"] .dropdown-menu,
  body[data-theme="dark"] .dropdown-list {
     background: #000 !important;
     box-shadow: 0 5px 15px rgba(255,255,255,0.15) !important;
     border: 1px solid #333 !important;
  }

  /* 10. Header/Banner Logic */
  body[data-theme="dark"] .pcoln_header .blurred-bg,
  body[data-theme="dark"] .pcoln_header .bg,
  body[data-theme="dark"] .pcoln_header .poster_overlay,
  body[data-theme="dark"] .pcoln_header .pcoln__overlay {
    opacity: 0 !important; visibility: hidden !important; display: none !important;
  }

  body[data-theme="dark"] .pcoln__info2 {
      background: transparent !important;
      box-shadow: none !important;
      border: none !important;
  }
  body[data-theme="dark"] .pcoln__info2 * {
      text-shadow: 1px 1px 3px #000, 0 0 5px #000 !important;
      color: #fff !important;
  }
  body[data-theme="dark"] .pcoln__info2 button {
      background: initial !important; background-color: initial !important;
  }

  /* Custom Title Banner */
  .asbm-title-banner { display: none !important; }

  body[data-theme="dark"] .asbm-title-banner {
    display: block !important;
    position: absolute !important;
    z-index: 200 !important;
    background: transparent !important;
    pointer-events: none !important;
    will-change: top, left;
  }

  body[data-theme="dark"].asbm-banner-ready h1[itemprop="name"],
  body[data-theme="dark"].asbm-banner-ready .movie__original-title,
  body[data-theme="dark"].asbm-banner-ready .pmovie__original-title {
     opacity: 0 !important; visibility: hidden !important;
     position: absolute !important; pointer-events: none;
  }

  /* New Title Styling */
  .asbm-title-box {
    display: block !important; margin: 0 !important;
    text-align: left !important; font-weight: 800 !important;
    line-height: 1.15 !important;
    color: #fff !important;
    -webkit-text-fill-color: #fff !important;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.6) !important;
    white-space: nowrap !important; overflow: hidden !important;
    padding: 0 4px !important; pointer-events: none !important;
  }
  .asbm-title-box.asbm-ml {
    white-space: normal !important;
    word-break: break-word !important;
    display: -webkit-box !important;
    -webkit-box-orient: vertical !important;
    text-overflow: ellipsis !important;
  }
  `;

  /* ========= LOGIC ========= */

  function injectStyles() {
    const id = 'asbm-style-global';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
  }

  function resetLayout() {
      const header = document.querySelector('.pcoln__header, .pcoln_header');
      if (header) {
          header.style.removeProperty('padding-top');
          header.style.removeProperty('min-height');
          header.style.removeProperty('overflow');
      }
      document.body.classList.remove('asbm-banner-ready');
  }

  function applyDarkLayout() {
    if (!document.body.matches('[data-theme="dark"]')) {
        resetLayout();
        return;
    }

    const header = document.querySelector('.pcoln__header, .pcoln_header');
    if (!header) return;

    const textEl = document.querySelector('h1[itemprop="name"], .movie__original-title, .pmovie__original-title, meta[itemprop="name"]');
    const text = textEl ? (textEl.textContent || textEl.content || '').trim() : '';
    if (!text) return;

    document.body.classList.add('asbm-banner-ready');

    let banner = header.querySelector('.asbm-title-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'asbm-title-banner';
      header.prepend(banner);
    }

    let box = banner.querySelector('.asbm-title-box');
    if (!box) {
      box = document.createElement('div');
      box.className = 'asbm-title-box';
      banner.appendChild(box);
    }
    if (box.textContent !== text) box.textContent = text;

    calculatePosition(header, banner, box);
  }

  function calculatePosition(header, banner, box) {
    try {
      if (header.style.minHeight !== SETTINGS.HEADER_MIN_HEIGHT) {
          header.style.minHeight = SETTINGS.HEADER_MIN_HEIGHT;
      }
      header.style.overflow = 'visible';

      const hdrRect = header.getBoundingClientRect();
      if (hdrRect.width === 0) return;

      const poster = header.querySelector('.pcoln__poster, .pcoln__img, .pcoln__left img') || header;
      const posterRect = poster.getBoundingClientRect();

      let left = SETTINGS.SAFE_SIDE_GAP;
      if (SETTINGS.ALIGN_TO_POSTER_LEFT && poster !== header) {
          left = Math.max(SETTINGS.SAFE_SIDE_GAP, Math.round(posterRect.left - hdrRect.left));
      }

      // WIDTH CALCULATION (Smart)
      // Берем ширину от края постера до начала правого блока инфо (если он есть)
      let rightLimit = hdrRect.width - SETTINGS.SAFE_SIDE_GAP;
      const info2 = header.querySelector('.pcoln__info2');
      if (info2) {
          const infoRect = info2.getBoundingClientRect();
          if (infoRect.left > hdrRect.left) {
             rightLimit = Math.min(rightLimit, infoRect.left - hdrRect.left - 15);
          }
      }
      let availWidth = Math.max(SETTINGS.MIN_TITLE_WIDTH, rightLimit - left);

      // TOP Position
      let topCalc = SETTINGS.BANNER_TOP_OFFSET;
      if (SETTINGS.BANNER_ANCHOR === 'poster' && poster !== header) {
          topCalc = (posterRect.top - hdrRect.top) + SETTINGS.POSTER_TOP_OFFSET;
      }
      const finalTop = Math.max(topCalc, SETTINGS.MIN_BANNER_TOP);

      // APPLY
      banner.style.top = `${finalTop}px`;
      banner.style.left = `${left}px`;
      box.style.maxWidth = `${availWidth}px`;

      box.classList.remove('asbm-ml');
      box.style.fontSize = '';
      
      // LOGIC: Если текст не влазит в 1 строку - разрешаем многострочность
      if (box.scrollWidth > box.clientWidth) {
         if (SETTINGS.TITLE_MAX_LINES > 1) {
             box.classList.add('asbm-ml');
             box.style.webkitLineClamp = SETTINGS.TITLE_MAX_LINES;
             
             // Если даже в 3 строки не влазит - уменьшаем шрифт
             let s = SETTINGS.MAX_FONT_PX;
             box.style.fontSize = s + 'px';
             // Проверяем переполнение по высоте
             while(box.scrollHeight > box.clientHeight && s > SETTINGS.MIN_FONT_PX) {
                 s -= 2;
                 box.style.fontSize = s + 'px';
             }
         } else if (SETTINGS.AUTO_FIT_ONE_LINE) {
             let s = SETTINGS.MAX_FONT_PX;
             box.style.fontSize = s + 'px';
             while(box.scrollWidth > box.clientWidth && s > SETTINGS.MIN_FONT_PX) {
                 s -= 2;
                 box.style.fontSize = s + 'px';
             }
         }
      } else {
         // Пытаемся сделать шрифт побольше, если место позволяет
         let s = SETTINGS.MAX_FONT_PX;
         box.style.fontSize = s + 'px';
         while(box.scrollWidth > box.clientWidth && s > SETTINGS.MIN_FONT_PX) {
             s -= 4;
             box.style.fontSize = s + 'px';
         }
      }

      const bh = banner.offsetHeight;
      const newPad = Math.min(finalTop + bh + SETTINGS.BOTTOM_GAP, SETTINGS.MAX_HEADER_PADDING);
      const curPad = parseFloat(header.style.paddingTop) || 0;

      if (Math.abs(curPad - newPad) > 2) {
         header.style.paddingTop = `${newPad}px`;
      }

    } catch(e) {}
  }

  /* ========= INITIALIZATION ========= */
  injectStyles();

  let updateTimer;
  const update = () => {
      if(updateTimer) clearTimeout(updateTimer);
      updateTimer = setTimeout(() => {
          requestAnimationFrame(applyDarkLayout);
      }, 100);
  };

  const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
            if (m.type === 'attributes' && m.attributeName === 'data-theme') {
                applyDarkLayout();
            }
      });
  });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

  const contentObserver = new MutationObserver(update);
  contentObserver.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('resize', update);
  window.addEventListener('load', applyDarkLayout);
  window.addEventListener('popstate', () => setTimeout(applyDarkLayout, 200));

})();