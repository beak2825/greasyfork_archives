// ==UserScript==
// @name         bilibili 风纪委员增强
// @namespace    https://github.com/sparanoid/userscript
// @supportURL   https://github.com/sparanoid/userscript/issues
// @version      0.0.3
// @description  bilibili 风纪委员自动勾选表单，默认匿名发布
// @author       Sparanoid
// @license      AGPL
// @compatible   chrome 80 or later
// @compatible   edge 80 or later
// @compatible   firefox 74 or later
// @compatible   safari 13.1 or later
// @match        https://www.bilibili.com/*
// @icon         https://experiments.sparanoid.net/favicons/v2/www.bilibili.com.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/437932/bilibili%20%E9%A3%8E%E7%BA%AA%E5%A7%94%E5%91%98%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/437932/bilibili%20%E9%A3%8E%E7%BA%AA%E5%A7%94%E5%91%98%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

const DEBUG = true;
const NAMESPACE = 'bilibili-judgement-enhanced';
const apiBase = 'https://api.bilibili.com';
const feedbackUrl = 'https://t.bilibili.com/545085157213602473';

console.log(`${NAMESPACE} loaded`);

function debug(description = '', msg = '', force = false) {
  if (DEBUG || force) {
    console.log(`${NAMESPACE}: ${description}`, msg)
  }
}

((open) => {
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener("readystatechange", () => {
      const url = this?.responseURL && new URL(this.responseURL);
      // debug('url?.pathname', url?.pathname);

      // Check when vote API fires
      if (url?.pathname === '/x/credit/v2/jury/vote') {

        if (this.readyState === 4) {
          document.querySelector('.vote-btns .btn-group button:first-child')?.click();
          document.querySelector('.will-you-watch button:last-child')?.click();
          document.querySelector('.vote-anonymous > div')?.click();
          if (document.querySelector('.card-public-point')) {
            document.querySelector('.card-public-point > div:last-child').style.display = 'block';
          }
        }
      }
    }, false);
    open.apply(this, arguments);
  };
})(XMLHttpRequest.prototype.open);
