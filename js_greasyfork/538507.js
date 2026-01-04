// ==UserScript==
// @name         t3 chat oled black
// @namespace    https://wearifulpoet.com/
// @version      1
// @description  pure black oled theme for t3 chat
// @match        https://t3.chat/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538507/t3%20chat%20oled%20black.user.js
// @updateURL https://update.greasyfork.org/scripts/538507/t3%20chat%20oled%20black.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STYLE_ID = 't3chat-oled-style';

  const forceDarkMode = () => {
    if (document.documentElement.getAttribute('data-theme') !== 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  };

  const styleSheet = `
    :root,[data-theme]{
      --b1:#000!important;--b2:#000!important;--b3:#000!important;
      --bc:#333!important;
      --pc:#fff!important;--sc:#fff!important;--nc:#fff!important;
      --ac:#fff!important;--in:#4ea1ff!important;--su:#4caf50!important;
      --wa:#ff9800!important;--er:#f44336!important;
      color-scheme:dark!important;
      background:#000!important;
    }
    html,body{background:#000!important;color:#fff!important}
    *{background-image:none!important}
    [class*="bg-"],
    .bg-base-50,.bg-base-100,.bg-base-200,.bg-base-300,.bg-base-400,.bg-base-500,
    .bg-gray-50,.bg-gray-100,.bg-gray-200,.bg-gray-300,
    .bg-white,.bg-neutral,.bg-neutral-focus{background:#000!important}
    .text-base-content,.text-neutral,
    .text-gray-700,.text-gray-800,.text-gray-900,.text-black{color:#fff!important}
    .border,.border-base-300,.border-gray-100,.border-gray-200,
    .border-gray-300,.border-gray-400{border-color:#333!important}
    a{color:#4ea1ff!important}
    ::-webkit-scrollbar{width:8px;height:8px}
    ::-webkit-scrollbar-track{background:#000}
    ::-webkit-scrollbar-thumb{background:#444;border-radius:4px}
    ::-webkit-scrollbar-thumb:hover{background:#666}
  `;

  const injectStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    if (typeof GM_addStyle !== 'undefined') {
      GM_addStyle(styleSheet).setAttribute('id', STYLE_ID);
    } else {
      const styleEl = document.createElement('style');
      styleEl.id = STYLE_ID;
      styleEl.textContent = styleSheet;
      (document.head || document.documentElement).appendChild(styleEl);
    }
  };

  forceDarkMode();
  injectStyles();

  new MutationObserver(forceDarkMode).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  new MutationObserver(injectStyles).observe(document.body, {
    childList: true,
    subtree: true
  });
})();