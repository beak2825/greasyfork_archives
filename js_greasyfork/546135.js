// ==UserScript==
// @name         BlackRussia Forum — MAGADAN PremiumStyle
// @namespace    AzimutElemental
// @version      1.5
// @description  Красивое оформление форума: мягкий шрифт, яркие разделители и аккуратные эффекты без смены исходного фона форума
// @author       Azimut
// @match        https://forum.blackrussia.online/*
// @run-at       document-end
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546135/BlackRussia%20Forum%20%E2%80%94%20MAGADAN%20PremiumStyle.user.js
// @updateURL https://update.greasyfork.org/scripts/546135/BlackRussia%20Forum%20%E2%80%94%20MAGADAN%20PremiumStyle.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Подключаем шрифт
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  // Подключаем FontAwesome
  const fa = document.createElement("link");
  fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  fa.rel = "stylesheet";
  document.head.appendChild(fa);

  GM_addStyle(`
    body, .p-pageWrapper {
      font-family: 'Nunito', sans-serif !important;
    }

    /* Шапка и навигация */
    .p-header, .p-nav {
      background: rgba(0, 0, 0, 0.65) !important;
      backdrop-filter: blur(6px);
      border-bottom: 2px solid rgba(0, 200, 255, 0.6) !important;
      box-shadow: 0 2px 14px rgba(0,200,255,0.3);
    }

    /* Блоки сообщений */
    .message-inner {
      background: rgba(0, 0, 0, 0.55) !important;
      border: 2px solid rgba(0, 200, 255, 0.6) !important;
      border-radius: 14px;
      padding: 14px;
      box-shadow: 0 0 16px rgba(0,200,255,0.25);
    }

    /* Разделители, линии */
    hr, .block-separator, .p-sectionLinks, .menu-separator, .structItem--thread {
      border-color: rgba(0, 200, 255, 0.8) !important;
      box-shadow: 0 0 8px rgba(0,200,255,0.4);
    }

    /* Кнопки */
    .button {
      background: rgba(255,255,255,0.08) !important;
      border: 2px solid rgba(0, 200, 255, 0.6) !important;
      color: inherit !important;
      border-radius: 12px !important;
      padding: 7px 16px !important;
      font-weight: 600 !important;
      transition: transform 0.2s ease, box-shadow 0.3s ease;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 14px rgba(0,200,255,0.7);
    }

    /* Аватарки */
    .message-avatar img, .avatar img {
      border-radius: 50%;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
      border: 2px solid rgba(0,200,255,0.6);
    }
    .message-avatar img:hover, .avatar img:hover {
      box-shadow: 0 0 24px rgba(0, 200, 255, 0.9);
      transform: scale(1.07);
    }

    /* Цитаты */
    blockquote {
      background: rgba(0, 0, 0, 0.6) !important;
      border-left: 4px solid rgba(0,200,255,0.7) !important;
      box-shadow: inset 0 0 12px rgba(0,200,255,0.25);
    }

    /* Поля ввода */
    input, textarea {
      background: rgba(0,0,0,0.7) !important;
      border: 2px solid rgba(0,200,255,0.6) !important;
      border-radius: 10px;
      padding: 7px;
      color: inherit !important;
    }

    /* Иконки рядом с темами */
    .structItem-title:before {
      font-family: "Font Awesome 6 Free";
      font-weight: 900;
      content: "\\f0a4"; /* стрелочка */
      margin-right: 8px;
      color: rgba(0,200,255,0.9);
      text-shadow: 0 0 8px rgba(0,200,255,0.6);
      display: inline-block;
      transition: transform 0.3s ease;
    }
    .structItem-title:hover:before {
      transform: translateX(5px) scale(1.15);
    }
  `);
})();
