// ==UserScript==
// @name         和谐3614之抖抖
// @namespace    chougou
// @version      2024-05-15
// @description  不准卖小面,由于抖音网页版react生成的类名,随时失效
// @author       You
// @match        https://live.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495059/%E5%92%8C%E8%B0%903614%E4%B9%8B%E6%8A%96%E6%8A%96.user.js
// @updateURL https://update.greasyfork.org/scripts/495059/%E5%92%8C%E8%B0%903614%E4%B9%8B%E6%8A%96%E6%8A%96.meta.js
// ==/UserScript==

(function () {
  'use strict';
  function main () {
    const d1 = document.querySelector('.C3RZrxtJ');
    const d2 = document.querySelector('#__living_frame_right_panel_id');
    [d1, d2].forEach(el => {
      el && el.remove()
    })
    const v_warp = document.querySelector('.xrnYRWXb')
    v_warp.style.marginRight = '0';
  };
  setTimeout(() => {
    main()
  }, 3000);
})();