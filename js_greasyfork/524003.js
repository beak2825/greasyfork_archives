// ==UserScript==
// @name         剑网三万宝楼点击高亮
// @namespace    https://github.com/bosens-China/wanbaolou-click-highlight
// @version      1.0.1
// @description  剑网三万宝楼点击高亮，用于避免重复点击。
// @author       yliu
// @match        https://jx3.seasunwbl.com/buyer?t=role
// @match        https://jx3.seasunwbl.com/follow?t=role
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524003/%E5%89%91%E7%BD%91%E4%B8%89%E4%B8%87%E5%AE%9D%E6%A5%BC%E7%82%B9%E5%87%BB%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/524003/%E5%89%91%E7%BD%91%E4%B8%89%E4%B8%87%E5%AE%9D%E6%A5%BC%E7%82%B9%E5%87%BB%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const bg = `rgb(234 223 223)`;
  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element && e.target.textContent === "\u8BE6\u60C5")) {
      return;
    }
    const parentElement = e.target.closest('[class*="__roleItem--"]') || e.target.closest(
      '[class*="-components-m__followItemWrap--"]'
    );
    if (!parentElement) {
      return;
    }
    parentElement.style.background = bg;
  });

})();
