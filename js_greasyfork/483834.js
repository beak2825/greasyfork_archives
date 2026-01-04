// ==UserScript==
// @name         展示 Jellyfin 剧照（Show Jellyfin Extrafanarts via clicking）.
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Display Extrafanarts in a waterfall stream
// @author       Apricity
// @match        http://v6.yunpengtai.top:8096/web/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/483834/%E5%B1%95%E7%A4%BA%20Jellyfin%20%E5%89%A7%E7%85%A7%EF%BC%88Show%20Jellyfin%20Extrafanarts%20via%20clicking%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/483834/%E5%B1%95%E7%A4%BA%20Jellyfin%20%E5%89%A7%E7%85%A7%EF%BC%88Show%20Jellyfin%20Extrafanarts%20via%20clicking%EF%BC%89.meta.js
// ==/UserScript==

async function showfunction(waterfallContainer) {
  const backdrop = document.querySelector(".backdropImage");
  const bgImage = backdrop.getAttribute("data-url");

  for (let i = 1; i <= 20; i++) {
    const newSrc = bgImage.replace(/Backdrop\/\d+/, `Backdrop/${i}`);
    try {
      const response = await fetch(newSrc, { method: "HEAD" });
      if (!response.ok) throw new Error("Image not found.");

      const img = document.createElement("img");
      img.src = newSrc;
      img.style.maxWidth = "200px";
      img.style.maxHeight = "200px";
      img.style.margin = "10px";
      img.style.cursor = "zoom-in";
      waterfallContainer.appendChild(img);
    } catch (error) {
      console.error("An image failed to load:", error);
      break; // 图片不存在时退出循环
    }
  }

  // 显示瀑布流容器并调整位置
  waterfallContainer.style.display = "block";
  waterfallContainer.style.top = "30%";
}

(function () {
  "use strict";

  // 动态创建瀑布流容器
  const waterfallContainer = document.createElement("div");
  waterfallContainer.id = "waterfall-container";
  waterfallContainer.style.position = "absolute";
  waterfallContainer.style.zIndex = "10000";
  waterfallContainer.style.display = "none";
  waterfallContainer.style.border = "1px solid #ccc";
  waterfallContainer.style.backgroundColor = "#e4efff"; // 淡蓝色背景
  waterfallContainer.style.padding = "10px";
  waterfallContainer.style.borderRadius = "25px";
  document.body.appendChild(waterfallContainer);

  // 创建关闭按钮
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.style.position = "absolute";
  closeButton.style.top = "5px";
  closeButton.style.right = "5px";
  closeButton.onclick = function () {
    waterfallContainer.style.display = "none";
  };
  waterfallContainer.appendChild(closeButton);

  document.addEventListener("keydown", function (e) {
    // 检查是否按下了Ctrl和`键
    // `键的keyCode是192
    if (e.ctrlKey && e.keyCode == 192) {
      waterfallContainer.innerHTML = "";
      waterfallContainer.appendChild(closeButton); // 重新添加关闭按钮
      showfunction(waterfallContainer);
    }
  });

  // 阻止事件冒泡到mouseout事件
  waterfallContainer.addEventListener("click", function (event) {
    event.stopPropagation();
  });
})();