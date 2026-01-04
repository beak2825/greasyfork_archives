// ==UserScript==
// @name         机械工程唯一ID获取工具
// @namespace    http://tampermonkey.net/
// @version      2025-07-04
// @description  页面截图并保存到本地文件
// @author       恋恋小嘴花
// @match        https://lexue.bit.edu.cn/mod/quiz/review.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541593/%E6%9C%BA%E6%A2%B0%E5%B7%A5%E7%A8%8B%E5%94%AF%E4%B8%80ID%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/541593/%E6%9C%BA%E6%A2%B0%E5%B7%A5%E7%A8%8B%E5%94%AF%E4%B8%80ID%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  questionId = document.querySelector('.questionflagpostdata').value.split("&qid=")[1].split("&")[0];
  console.log(`当前题目ID: ${questionId}`);
  
  // 创建显示ID的浮动元素
  const idDisplay = document.createElement('div');
  idDisplay.innerHTML = `题目ID: ${questionId}`;
  idDisplay.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(45deg,rgb(17, 169, 207) 0%,rgb(39, 199, 186) 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    user-select: text;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.3);
  `;
  
  // 添加悬停效果
  idDisplay.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.05)';
    this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
  });
  
  idDisplay.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
  });
  
  // 点击复制ID到剪贴板
  idDisplay.addEventListener('click', function() {
    navigator.clipboard.writeText(questionId).then(() => {
      const originalText = this.innerHTML;
      this.innerHTML = '已复制!';
      setTimeout(() => {
        this.innerHTML = originalText;
      }, 1000);
    });
  });
  
  document.body.appendChild(idDisplay);
})();
