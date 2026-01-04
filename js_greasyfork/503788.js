// ==UserScript==
// @name         群晖DSM鼠标侧键功能补充
// @namespace    http://tampermonkey.net/
// @version      2024-08-20
// @description  为群晖DSM系统添加鼠标侧键功能
// @author       xiyuesaves
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.synology.cn
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/503788/%E7%BE%A4%E6%99%96DSM%E9%BC%A0%E6%A0%87%E4%BE%A7%E9%94%AE%E5%8A%9F%E8%83%BD%E8%A1%A5%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/503788/%E7%BE%A4%E6%99%96DSM%E9%BC%A0%E6%A0%87%E4%BE%A7%E9%94%AE%E5%8A%9F%E8%83%BD%E8%A1%A5%E5%85%85.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if(!document.querySelector("#sds-wallpaper")){
    console.log("已退出")
    return
  }
  const BACK_BUTTON = 3;
  const FORWARD_BUTTON = 4;
  const blockedButtons = new Set([BACK_BUTTON, FORWARD_BUTTON]);
  window.addEventListener("mouseup", (event) => {
    const button = event.button;
    if (blockedButtons.has(button)) {
      event.stopPropagation();
      event.preventDefault();
      const syonWindow = event.target.closest(".x-window,.v-window");
      if (syonWindow) {
        const homeBtn = syonWindow.querySelector(`[syno-id="home-button"]`);
        const backBtn = syonWindow.querySelector(".x-btn.syno-sds-fs-tbar-back-wrap:not(.x-item-disabled),.x-btn.synopkg-toolbar-back-btn:not(.x-item-disabled)");
        const nextBtn = syonWindow.querySelector(".x-btn.syno-sds-fs-tbar-next-wrap:not(.x-item-disabled),.x-btn.synopkg-toolbar-next-btn:not(.x-item-disabled)");
        if (button === BACK_BUTTON && backBtn) {
          backBtn.dispatchEvent(new MouseEvent("mousedown"));
          backBtn.dispatchEvent(new MouseEvent("mouseup"));
          backBtn.dispatchEvent(new MouseEvent("click"));
          return;
        }
        if (button === BACK_BUTTON && homeBtn) {
          homeBtn.dispatchEvent(new MouseEvent("mousedown"));
          homeBtn.dispatchEvent(new MouseEvent("mouseup"));
          homeBtn.dispatchEvent(new MouseEvent("click"));
          return;
        }
        if (button === FORWARD_BUTTON && nextBtn) {
          nextBtn.dispatchEvent(new MouseEvent("mousedown"));
          nextBtn.dispatchEvent(new MouseEvent("mouseup"));
          nextBtn.dispatchEvent(new MouseEvent("click"));
          return;
        }
      }
    }
  });
})();
