// ==UserScript==
// @name         Force LTR on KaTeX (ChatGPT/OpenAI)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add dir="ltr" to all .katex-html elements on ChatGPT/OpenAI
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://*.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535341/Force%20LTR%20on%20KaTeX%20%28ChatGPTOpenAI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535341/Force%20LTR%20on%20KaTeX%20%28ChatGPTOpenAI%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const setLTR = () => {
    document.querySelectorAll('.katex-html').forEach(el => {
      el.setAttribute('dir', 'ltr');
    });
  };

  const observer = new MutationObserver(setLTR);
  observer.observe(document.body, { childList: true, subtree: true });

  setLTR();
})();
