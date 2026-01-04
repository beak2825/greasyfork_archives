// ==UserScript==
// @name         删除图怪兽海报背景水印
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删除图怪兽ue.818ps.com海报编辑/预览页面背景水印
// @author       Handsomefly
// @license      MIT
// @match        https://ue.818ps.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465022/%E5%88%A0%E9%99%A4%E5%9B%BE%E6%80%AA%E5%85%BD%E6%B5%B7%E6%8A%A5%E8%83%8C%E6%99%AF%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/465022/%E5%88%A0%E9%99%A4%E5%9B%BE%E6%80%AA%E5%85%BD%E6%B5%B7%E6%8A%A5%E8%83%8C%E6%99%AF%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

const watermarkDivs = document.querySelectorAll('div.image-watermark');
const previewButton = document.querySelectorAll('div.headerBtnItem')[8];
// 监听preview按钮点击
previewButton.addEventListener('click', () => {
  removeWatermarks();
});

function removeWatermarks() {
  const watermarkDivs = document.querySelectorAll('div.image-watermark');
  for (let i = 0; i < watermarkDivs.length; i++) {
    watermarkDivs[i].remove();
  }
}

// 使用MutationObserver监听DOM变化
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length > 0) {
      removeWatermarks();
    }
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 3秒检查一次,以防未捕获某些变化
setInterval(() => {
  removeWatermarks();
}, 3000);

// ==/UserScript==