// ==UserScript==
// @name         Temu降价 半自动选择“我不接受”
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  半自动选择我不接受按钮,半自动更安全
// @author       likang0110
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502163/Temu%E9%99%8D%E4%BB%B7%20%E5%8D%8A%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E2%80%9C%E6%88%91%E4%B8%8D%E6%8E%A5%E5%8F%97%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/502163/Temu%E9%99%8D%E4%BB%B7%20%E5%8D%8A%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E2%80%9C%E6%88%91%E4%B8%8D%E6%8E%A5%E5%8F%97%E2%80%9D.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // 等待弹窗元素加载完成
  setTimeout(function() {
    // 获取当前页面所有弹窗
    var dialogs = document.querySelectorAll('[data-testid="beast-core-modal"]');
    // 遍历每个弹窗
    dialogs.forEach(function(dialog) {
      // 检查弹窗的加载状态
      if (dialog.querySelector('.MDL_footer_5-111-0')) {
        // 创建一个开始按钮
        var startButton = document.createElement('button');
        startButton.textContent = '全选我不接受';
        startButton.style.position = 'absolute';
        startButton.style.top = '10px';
        startButton.style.right = '10px';
        startButton.style.zIndex = '1000';
        startButton.style.backgroundColor = 'red'; // 设置按钮背景颜色为红色
        startButton.style.color = 'white'; // 设置按钮字体颜色为白色
        startButton.style.padding = '10px'; // 增加按钮的内边距
        startButton.style.border = 'none'; // 移除按钮的边框
        startButton.style.borderRadius = '5px'; // 使按钮边角圆润
        startButton.style.width = '120px'; // 设置按钮宽度
        startButton.style.height = '40px'; // 设置按钮高度
        dialog.appendChild(startButton);
        // 点击开始按钮后执行选择“我不接受”
        startButton.addEventListener('click', function() {
          // 获取弹窗中的输入元素
          var inputs = dialog.querySelectorAll('.RD_input_5-111-0');
          // 遍历每个输入元素
          inputs.forEach(function(input) {
            // 如果输入元素的父元素包含文本“我不接受”，则选中它
            if (input.parentNode.parentNode.querySelector('.RD_textWrapper_5-111-0.RD_prevRadio_5-111-0').textContent === '我不接受') {
              input.click();
            }
          });
        });
      }
    });
  }, 3000);
})();