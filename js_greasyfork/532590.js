// ==UserScript==
// @name         网页自定义截图工具
// @namespace    https://github.com/2019-02-18
// @version      0.1
// @description  根据页面中的id或者class使用html2canvas-pro实现网页长截图，支持多元素拼接
// @author       2019-02-18
// @match        *://*/*
// @grant        none
// @license MIT
// @require https://update.greasyfork.org/scripts/457525/1134363/html2canvas%20141.js
// @downloadURL https://update.greasyfork.org/scripts/532590/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E6%88%AA%E5%9B%BE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/532590/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E6%88%AA%E5%9B%BE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建控制面板
  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;background:#fff;padding:10px;border:1px solid #ccc;';
  
  // 创建输入框
  const input = document.createElement('textarea');
  input.placeholder = '输入目标元素的id或class，多个元素用逗号分隔';
  input.style.marginRight = '10px';
  input.style.width = '200px';
  input.style.height = '60px';
  
  // 创建截图按钮
  const button = document.createElement('button');
  button.textContent = '截图';
  button.style.display = 'block';
  button.style.marginTop = '5px';
  
  // 创建单元素截图按钮
  const singleButton = document.createElement('button');
  singleButton.textContent = '单元素截图';
  singleButton.style.display = 'block';
  singleButton.style.marginTop = '5px';
  
  // 添加元素到面板
  panel.appendChild(input);
  panel.appendChild(singleButton);
  panel.appendChild(button);
  document.body.appendChild(panel);

  // 单元素截图功能
  singleButton.addEventListener('click', async () => {
      const selector = input.value.trim();
      if (!selector) {
          alert('请输入选择器');
          return;
      }
      
      let target;
      
      // 查找目标元素
      if (selector.startsWith('#')) {
          target = document.getElementById(selector.slice(1));
      } else if (selector.startsWith('.')) {
          target = document.querySelector(selector);
      } else {
          alert('请输入正确的id或class选择器（以#或.开头）');
          return;
      }

      if (!target) {
          alert('未找到目标元素');
          return;
      }

      try {
          await captureAndDownload([target]);
      } catch (error) {
          console.error('截图失败:', error);
          alert('截图失败，请检查控制台获取详细信息');
      }
  });

  // 多元素拼接截图功能
  button.addEventListener('click', async () => {
      const selectors = input.value.split(',').map(s => s.trim()).filter(s => s);
      
      if (selectors.length === 0) {
          alert('请输入至少一个选择器');
          return;
      }
      
      const targets = [];
      
      // 查找所有目标元素
      for (const selector of selectors) {
          let target;
          
          if (selector.startsWith('#')) {
              target = document.getElementById(selector.slice(1));
          } else if (selector.startsWith('.')) {
              target = document.querySelector(selector);
          } else {
              alert(`请输入正确的id或class选择器（以#或.开头）: ${selector}`);
              return;
          }
          
          if (!target) {
              alert(`未找到目标元素: ${selector}`);
              return;
          }
          
          targets.push(target);
      }

      try {
          await captureAndDownload(targets);
      } catch (error) {
          console.error('截图失败:', error);
          alert('截图失败，请检查控制台获取详细信息');
      }
  });
  
  // 截图并下载函数
  async function captureAndDownload(elements) {
      if (!elements || elements.length === 0) return;
      
      // 如果只有一个元素，直接截图并下载
      if (elements.length === 1) {
          const canvas = await html2canvas(elements[0], {
              useCORS: true,
              scrollX: 0,
              scrollY: 0,
              windowWidth: document.documentElement.offsetWidth,
              windowHeight: document.documentElement.offsetHeight,
              scale: window.devicePixelRatio
          });
          
          downloadImage(canvas);
          return;
      }
      
      // 多个元素，需要拼接
      const canvases = [];
      let totalHeight = 0;
      let maxWidth = 0;
      
      // 先截取所有元素
      for (const element of elements) {
          const canvas = await html2canvas(element, {
              useCORS: true,
              scrollX: 0,
              scrollY: 0,
              windowWidth: document.documentElement.offsetWidth,
              windowHeight: document.documentElement.offsetHeight,
              scale: window.devicePixelRatio
          });
          
          canvases.push(canvas);
          totalHeight += canvas.height;
          maxWidth = Math.max(maxWidth, canvas.width);
      }
      
      // 创建新画布并拼接
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = maxWidth;
      finalCanvas.height = totalHeight;
      
      const ctx = finalCanvas.getContext('2d');
      let currentY = 0;
      
      // 将每个画布绘制到最终画布上
      for (const canvas of canvases) {
          // 居中绘制
          const x = (maxWidth - canvas.width) / 2;
          ctx.drawImage(canvas, x, currentY);
          currentY += canvas.height;
      }
      
      // 下载拼接后的图片
      downloadImage(finalCanvas);
  }
  
  // 下载图片函数
  function downloadImage(canvas) {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      //文件名称使用当前日期加页面标题
      let date = new Date();
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
      let filename = year + '-' + month + '-' + day + '-' + document.title + '.png';
      link.download = filename;
      link.href = image;
      link.click();
  }
})();
