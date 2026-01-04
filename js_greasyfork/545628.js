// ==UserScript==
// @name         自动点赞
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  抖音直播自动点赞
// @author       Bossmei
// @match        https://live.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545628/%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/545628/%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function () {
  let state = false; // 是否开启点击状态
  // 步骤 1：创建按钮元素
  const newButton = document.createElement("button");
  // 步骤 2：配置按钮内容和样式
  newButton.textContent = "开始"; // 更明确的按钮文本
  newButton.style.padding = "10px 18px"; // 优化内边距
  newButton.style.fontSize = "16px";
  newButton.style.fontWeight = "500"; // 加粗字体
  newButton.style.cursor = "pointer";
  newButton.style.position = "fixed";
  newButton.style.bottom = "100px"; // 距离顶部 10px
  newButton.style.left = "30px"; // 距离左侧 10px
  newButton.style.zIndex = "1000";
  newButton.style.backgroundColor = "#409EFF"; // Element Plus主色调
  newButton.style.color = "#ffffff"; // 白色文本
  newButton.style.border = "none"; // 明确去掉边框
  newButton.style.borderRadius = "8px"; // 优化圆角
  newButton.style.boxShadow = "0 4px 12px rgba(64, 158, 255, 0.3)"; // 添加阴影
  newButton.style.transition = "all 0.3s ease"; // 过渡动画
  // 添加悬停效果
  newButton.addEventListener("mouseenter", () => {
    newButton.style.backgroundColor = "#337ecc";
    newButton.style.boxShadow = "0 6px 16px rgba(64, 158, 255, 0.4)";
  });
  document.body.appendChild(newButton);
  // 步骤 3：添加点击事件监听器
  newButton.addEventListener("click", () => {
    state = !state;
    newButton.textContent = state ? "停止" : "开始";
  });
  setTimeout(() => {
    // 目标元素：document
    const target = document.querySelector("#LikeLayout > div");
    setInterval(() => {
      if (state) {
        // 模拟第一次 click
        target.dispatchEvent(createClickEvent(500, 500));
        // 模拟第二次 click（间隔约 100ms，小于浏览器默认的 300ms 检测阈值）
        setTimeout(() => {
          target.dispatchEvent(createClickEvent(502, 502)); // 坐标轻微偏移（模拟真实点击误差）
        }, 100);
      }
    }, 400);
  }, 5000);
  // 辅助函数：创建 click 事件对象
  const createClickEvent = (x, y, isSecondClick = false) => {
    return new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      button: 0,
      buttons: 1,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      altKey: false,
      // 模拟第二次点击时的时间戳（略大于第一次，避免被浏览器忽略）
      timeStamp: isSecondClick ? performance.now() + 50 : performance.now()
    });
  };
})();