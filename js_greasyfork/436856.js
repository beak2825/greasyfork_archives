// ==UserScript==
// @name         bilibili 评论审核检测
// @namespace    https://github.com/sparanoid/userscript
// @supportURL   https://github.com/sparanoid/userscript/issues
// @version      0.1.1
// @description  bilibili 评论审核检测，可在回复/评论提交后实时反馈该内容是否对他人可见
// @author       Sparanoid
// @license      AGPL
// @compatible   chrome 80 or later
// @compatible   edge 80 or later
// @compatible   firefox 74 or later
// @compatible   safari 13.1 or later
// @match        https://*.bilibili.com/*
// @icon         https://experiments.sparanoid.net/favicons/v2/www.bilibili.com.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/436856/bilibili%20%E8%AF%84%E8%AE%BA%E5%AE%A1%E6%A0%B8%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/436856/bilibili%20%E8%AF%84%E8%AE%BA%E5%AE%A1%E6%A0%B8%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

// Debugging pages:
// - https://t.bilibili.com/594017148390748345
// - https://www.bilibili.com/read/cv13871002
// - https://space.bilibili.com/703007996/fans/follow
// - https://www.bilibili.com/video/BV1Ar4y1C77P
// - https://www.bilibili.com/video/BV1KL411g7om (colab)

window.addEventListener('load', () => {
  const DEBUG = true;
  const NAMESPACE = 'bilibili-censor-detect';
  const apiBase = 'https://api.bilibili.com';
  const feedbackUrl = 'https://t.bilibili.com/545085157213602473';

  console.log(`${NAMESPACE} loaded`);

  async function fetchResult(url = '', data = {}) {
    const response = await fetch(url, {
      credentials: 'include',
    });
    return response.json();
  }

  function debug(description = '', msg = '', force = false) {
    if (DEBUG || force) {
      console.log(`${NAMESPACE}: ${description}`, msg)
    }
  }

  ((open) => {
    XMLHttpRequest.prototype.open = function() {
      this.addEventListener("readystatechange", () => {
        const url = this?.responseURL && new URL(this.responseURL);

        // Check for reply API endpoints
        if (url?.pathname === '/x/v2/reply/add') {
          if (this.readyState === 4) {
            const resp = JSON.parse(this.response);
            const state = resp?.data?.reply?.state;
            debug(state);

            if (state !== 0) {
              alert(`回复已被ban，状态码：${state}`)
            }
          }
        }
      }, false);
      open.apply(this, arguments);
    };
  })(XMLHttpRequest.prototype.open);

}, false);
