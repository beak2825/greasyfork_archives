// ==UserScript==
// @name         SkeletonScript
// @namespace    https://github.com/popring/vite-skeleton
// @version      2024-09-23
// @description  Generate Skeleton
// @author       popring
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509875/SkeletonScript.user.js
// @updateURL https://update.greasyfork.org/scripts/509875/SkeletonScript.meta.js
// ==/UserScript==

// 递归生成骨架图
function processElement(el, skeletonOverlay, bodyRect) {
  const children = el.children;

  if (children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      processElement(children[i], skeletonOverlay, bodyRect);
    }
  } else {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const skeletonElement = document.createElement('div');
      skeletonElement.className = 'skeleton-box';
      skeletonElement.style.position = 'absolute';
      skeletonElement.style.top = rect.top - bodyRect.top + 'px';
      skeletonElement.style.left = rect.left - bodyRect.left + 'px';
      skeletonElement.style.width = rect.width + 'px';
      skeletonElement.style.height = rect.height + 'px';
      skeletonOverlay.appendChild(skeletonElement);
    }
  }
}

// 覆盖页面并生成骨架图
function generateSkeleton() {
  if (document.getElementById('skeleton-overlay')) return;

  const skeletonOverlay = document.createElement('div');
  skeletonOverlay.id = 'skeleton-overlay';
  skeletonOverlay.style.position = 'fixed';
  skeletonOverlay.style.top = 0;
  skeletonOverlay.style.left = 0;
  skeletonOverlay.style.width = '100%';
  skeletonOverlay.style.height = '100%';
  skeletonOverlay.style.zIndex = 9999;
  skeletonOverlay.style.backgroundColor = 'rgba(255, 255, 255, 1)';

  const bodyRect = document.body.getBoundingClientRect();

  // 排除 <br> 标签
  document
    .querySelectorAll('div, p, h1, h2, h3, h4, h5, h6, a, img, span, em')
    .forEach((el) => {
      processElement(el, skeletonOverlay, bodyRect);
    });

  insertSkeletonStyles(skeletonOverlay);
  document.body.appendChild(skeletonOverlay);
}

// 骨架图样式函数
function insertSkeletonStyles(skeletonOverlay) {
  const skeletonStyles = `
    .skeleton-box {
      background-color: #f0f0f0;
      animation: skeleton-loading 1.5s infinite;
      border-radius: 4px;
    }
    @keyframes skeleton-loading {
      0% {
        background-color: #f0f0f0;
      }
      50% {
        background-color: #e0e0e0;
      }
      100% {
        background-color: #f0f0f0;
      }
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerHTML = skeletonStyles;
  skeletonOverlay.appendChild(styleSheet);
}

// 切换骨架图的显示和隐藏
function toggleSkeleton() {
  const skeletonOverlay = document.getElementById('skeleton-overlay');
  if (skeletonOverlay) {
    skeletonOverlay.style.display =
      skeletonOverlay.style.display === 'none' ? 'block' : 'none';
  } else {
    generateSkeleton();
  }
}

// 添加控制按钮
function addToggleButton() {
  const button = document.createElement('button');
  button.innerText = '切换骨架图显示';
  button.style.position = 'fixed';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.zIndex = 10000;
  button.onclick = toggleSkeleton;

  document.body.appendChild(button);
}

// 初始化函数，添加按钮
function init() {
  addToggleButton();
}

// 将核心函数绑定到 window 对象上
window.generateSkeleton = generateSkeleton;
window.toggleSkeleton = toggleSkeleton;

// 初始化
init();
