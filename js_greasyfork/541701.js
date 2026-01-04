// ==UserScript==
// @name         falcon css
// @description  a
// @match        https://chat.falconllm.tii.ae/*
// @version 0.0.1.20251216044644
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/541701/falcon%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/541701/falcon%20css.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement('style');
  style.id = 'falconCssStyleId';

  style.textContent = `:root {
      color-scheme: light dark !important;
    }

    div.app > div, div.app > div > div {
      background-color: revert !important;
    }

    div[class*="bg-gradient"] {
      bottom: unset !important;
      height: 100% !important;
    }

    a[href="https://openinnovation.ai"] {
      display: none !important;
    }

    .chat-user > div > div > div.rounded-3xl:has(> p) {
      background-color: red !important;
      color: black !important;
    }

    div:has(> div > div > div > div > form > div > div> div > div > #chat-input) > div > div:nth-of-type(1) {
      display: none !important;
    }

    .katex {
      overflow-x: auto !important;
      overflow-y: hidden !important;
    }

    .blob {
      display: none !important;
    }

    .animated-gradient-text {
      color: revert !important;
    }

    `;
  document.head.appendChild(style);
})();