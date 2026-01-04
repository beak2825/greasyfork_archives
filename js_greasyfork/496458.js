// ==UserScript==
// @name         AIIRL
// @version      1.0.1
// @description  REAL LIFE AI
// @author       jamesliu96
// @license      MIT
// @namespace    https://jamesliu.info/
// @homepage     https://gist.github.com/jamesliu96/fcdf86b41d9bd2e768e288cb7b36744f
// @match        https://www.doubao.com/*
// @match        https://www.ciciai.com/*
// @icon         https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/web/logo-icon.png
// @icon         https://sf-flow-web-cdn.ciciaicdn.com/obj/ocean-flow-web-sg/cici_web/logo-icon-cici.png
// @connect      doubao.com
// @connect      ciciai.com
// @downloadURL https://update.greasyfork.org/scripts/496458/AIIRL.user.js
// @updateURL https://update.greasyfork.org/scripts/496458/AIIRL.meta.js
// ==/UserScript==

addEventListener('load', () => {
  setInterval(() => {
    const el = Array.from(document.querySelectorAll('span')).find(
      (x) =>
        x.className.includes('disclaimer-text') ||
        (x.textContent.includes('不能完全') && x.textContent.match(/might/i))
    );
    if (el && el.textContent) {
      el.textContent = el.textContent
        .replace(/(不能)(完全)/, '$2$1')
        .replace(/might/i, 'Must');
    }
  }, 100);
});
