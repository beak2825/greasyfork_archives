// ==UserScript==
// @name         群晖DSM6 FileStation导航
// @namespace    http://tampermonkey.net/
// @version      2024-10-29
// @description  为群晖DSM系统添加鼠标侧键功能
// @author       xiyuesaves,tuwei
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.synology.cn
// @grant        none
// @license      GPL-3.0

// @downloadURL https://update.greasyfork.org/scripts/514589/%E7%BE%A4%E6%99%96DSM6%20FileStation%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/514589/%E7%BE%A4%E6%99%96DSM6%20FileStation%E5%AF%BC%E8%88%AA.meta.js
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
      // 套件中心
      const syonAppWindow = event.target.closest(".x-window,.sds-window-v5");
      // 套件中心
      if (syonWindow) {
        const homeBtn = syonWindow.querySelector('[syno-id="home-button"]');
        // const backBtn = syonWindow.querySelector(".x-btn.syno-sds-fs-tbar-back-wrap:not(.x-item-disabled),.x-btn.synopkg-toolbar-back-btn:not(.x-item-disabled)");
        // const nextBtn = syonWindow.querySelector(".x-btn.syno-sds-fs-tbar-next-wrap:not(.x-item-disabled),.x-btn.synopkg-toolbar-next-btn:not(.x-item-disabled)");
        const backBtn = syonWindow.querySelector(".syno-sds-fs-tbar-back[aria-disabled=false]");
        const nextBtn = syonWindow.querySelector(".syno-sds-fs-tbar-next[aria-disabled=false]");
        if (button === BACK_BUTTON && backBtn) {
          backBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("mousedown"));
          backBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("mouseup"));
          backBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("click"));
          return;
        }
        if (button === BACK_BUTTON && homeBtn) {
          homeBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("mousedown"));
          homeBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("mouseup"));
          homeBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("click"));
          return;
        }
        if (button === FORWARD_BUTTON && nextBtn) {
          nextBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("mousedown"));
          nextBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("mouseup"));
          nextBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("click"));
          return;
        }
      }
      if (syonAppWindow) {
        const backBtn = syonWindow.querySelector(".syno-pkg-backbtn[aria-disabled=false]");
        const nextBtn = syonWindow.querySelector(".syno-pkg-nextbtn[aria-disabled=false]");
        if (button === BACK_BUTTON && backBtn) {
          backBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("mousedown"));
          backBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("mouseup"));
          backBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("click"));
          return;
        }

        if (button === FORWARD_BUTTON && nextBtn) {
          nextBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("mousedown"));
          nextBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("mouseup"));
          nextBtn.parentElement.parentElement.dispatchEvent(new MouseEvent("click"));
          return;
        }
      }
    }
  });
})();
