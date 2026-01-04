// ==UserScript==
// @name         订烟自动化
// @version      0.1
// @description  自动点击加号订购所有可用量
// @author       Muvn
// @match        https://sx.jinye.cn/*
// @icon         https://www.jinye.cn/marketing-orderplatform/ui/images/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/1353694
// @downloadURL https://update.greasyfork.org/scripts/504040/%E8%AE%A2%E7%83%9F%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/504040/%E8%AE%A2%E7%83%9F%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 延迟执行脚本，等待页面加载完成
  setTimeout(function() {
    // 获取所有 "buy_main_grid_add" 元素
    const addButtons = document.querySelectorAll('.buy_main_grid_add');

    // 点击所有 "buy_main_grid_add" 元素
    addButtons.forEach(button => button.click());

    // 获取所有商品行
    const productRows = document.querySelectorAll('.buy_main_grid_row');

    // 遍历所有商品行
    productRows.forEach(row => {
      // 获取商品数量
      const quantityElement = row.querySelector('.buy_main_grid_header_col_9');
      const quantity = parseInt(quantityElement.textContent.trim());

      // 获取商品输入框
      const inputBox = row.querySelector('.buy_main_grid_inpbox');

      // 设置商品输入框的值
      if (quantity > 0) {
        inputBox.value = quantity;
      } else {
        inputBox.value = 0;
      }
    });
  }, 3000); // 延迟 3 秒执行
})();
