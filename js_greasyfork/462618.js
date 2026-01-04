// ==UserScript==
// @name         百度贴吧 - 移除图片折叠
// @version      0.1.0
// @description  移除图片折叠
// @author       pana
// @namespace    https://greasyfork.org/zh-CN/users/193133-pana
// @license      GNU General Public License v3.0 or later
// @match        *://tieba.baidu.com/p/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/462618/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%20-%20%E7%A7%BB%E9%99%A4%E5%9B%BE%E7%89%87%E6%8A%98%E5%8F%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/462618/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%20-%20%E7%A7%BB%E9%99%A4%E5%9B%BE%E7%89%87%E6%8A%98%E5%8F%A0.meta.js
// ==/UserScript==
(function () {
  'use strict';
  window.onload = () => {
    document.querySelectorAll('.replace_tip').forEach(ele => {
      ele.style.display = 'none';
      const parent = ele.parentElement;
      parent && (parent.style.height = 'auto');
      const content = ele.closest('.j_d_post_content');
      if (content) {
        const area = content.querySelector('.cnt_act_vote_area');
        area && (area.style.zIndex = '10');
      }
    });
  };
})();
