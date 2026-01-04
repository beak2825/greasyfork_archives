// ==UserScript==
// @name         Fck 知识星球
// @license      MIT
// @namespace    zam157.fck-zsxq
// @match        *://*.zsxq.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @version      0.1.0
// @author       Zam157
// @homepageURL  https://github.com/zam157/tamper/tree/master/scripts/fck-zsxq
// @supportURL   https://github.com/zam157/tamper/tree/master/scripts/fck-zsxq
// @description  知识星球去水印、可复制
// @downloadURL https://update.greasyfork.org/scripts/526494/Fck%20%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83.user.js
// @updateURL https://update.greasyfork.org/scripts/526494/Fck%20%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83.meta.js
// ==/UserScript==

(function () {
  'use strict'
  const styles = `
    .topic-container > div,
    .topic-detail-panel {
      background-image: none !important;
    }
    .disabled-copy {
      user-select: auto !important;
    }
  `
  GM_addStyle(styles)

  // 改写addEventListener，禁止注册copy事件
  const originalAEL = EventTarget.prototype.addEventListener
  EventTarget.prototype.addEventListener = function (...arg) {
    if (arg?.[0] === 'copy') {
      // console.log(arg)
      // 成功劫持到目标事件后将addEventListener还原
      // EventTarget.prototype.addEventListener = originalAEL
      return
    }
    originalAEL.apply(this, arg)
  }
})()
