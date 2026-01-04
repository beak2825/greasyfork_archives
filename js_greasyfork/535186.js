// ==UserScript==
// @name         DeepWiki 增强
// @namespace    http://tampermonkey.net/
// @version      2025-05-08
// @description  对文档的 svg 元素功能增强
// @author       MUTTERTOOLS
// @match        https://deepwiki.com/*
// @icon         https://deepwiki.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535186/DeepWiki%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/535186/DeepWiki%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

function bindSvgEvent(dom) {
  const selector = "div[role=dialog] svg[id|=mermaid]";
  dom.matches(selector) && bindEvent(dom);

  const svgs = dom.querySelectorAll(selector);
  svgs.forEach((svg) => bindEvent(svg));

  function bindEvent(svg) {
    if (svg.binded) return;
    svg.binded = true;

    clearStyle(svg);

    // 初始化缩放和位移参数
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX, startY;

    const dialog = svg.closest("div[role=dialog]");

    // 滚轮缩放功能
    dialog.addEventListener("wheel", (e) => {
      e.preventDefault(); // 阻止页面滚动
      const { deltaY } = e;
      const { clientWidth, clientHeight } = document.documentElement;

      // 根据滚轮方向增加或减少缩放比例
      const delta = deltaY > 0 ? -0.2 : 0.2;
      scale = Math.max(0.1, scale + delta); // 确保缩放不会小于0.1

      // 应用变换
      applyTransform();
    });

    // 鼠标按下事件 - 开始拖拽
    dialog.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;

      // 记录起始位置
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;

      // 设置鼠标样式
      svg.style.cursor = "grabbing";
    });

    // 鼠标移动事件 - 拖拽过程
    dialog.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      // 计算新的偏移量
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;

      // 应用变换
      applyTransform();
    });

    // 鼠标释放事件 - 结束拖拽
    dialog.addEventListener("mouseup", () => {
      isDragging = false;
      svg.style.cursor = "grab";
    });

    // 鼠标离开事件 - 结束拖拽
    dialog.addEventListener("mouseleave", () => {
      isDragging = false;
      svg.style.cursor = "grab";
    });

    // 应用变换的辅助函数
    function applyTransform() {
      svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      svg.style.transformOrigin = "center";
    }

    // 初始化样式
    svg.style.cursor = "grab";
    svg.style.transition = "transform 0.1s";
  }

  function clearStyle(dom) {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          mutation.target.style.transition = '';
        }
      }
    });

    observer.observe(dom, {
      attributes: true,
      childList: false,
      subtree: false,
    });
  }
}

function setDialogStyle(dom) {
  const selector = "div[role=dialog]";
  dom.matches(selector) && setStyle(dom);

  const dialogs = dom.querySelectorAll(selector);
  dialogs.forEach((dialog) => setStyle(dialog));

  function setStyle(dialog) {
    dialog.style.width = "90vw";
    dialog.style.height = "70vh";
  }
}

const observer = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      const dom = mutation.target;
      bindSvgEvent(dom);
      setDialogStyle(dom);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  attributes: false,
  subtree: true,
});


})();