// ==UserScript==
// @name         Remove_Live_Room
// @name:zh-CN   去除b站直播间播放器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  模仿b站Chr_老师做的
// @description:zh-CN  模仿b站Chr_老师做的
// @author       lvti
// @match        https://live.bilibili.com/*
// @icon         https://gitee.com/zhou-saisai/frok/raw/master/img/min-hudie.gif
// @license      AGPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457094/Remove_Live_Room.user.js
// @updateURL https://update.greasyfork.org/scripts/457094/Remove_Live_Room.meta.js
// ==/UserScript==

(() => {
  "use strict";
  // 去除播放器的开关
  let VEnable = localStorage.getItem("VEnable") === "true";
  if(VEnable) {
    setTimeout(() => {
      document.getElementById("live-player").remove();
    }, 3000);
  }
  let btnArea = document.querySelector(".right-ctnr");
  let btn = document.createElement("button");
  btn.id = "removeLive";
  btn.textContent = VEnable ? "恢复播放器" : "移除播放器";
  btn.addEventListener("click", () => {
    VEnable = !VEnable;
    localStorage.setItem("VEnable", VEnable);
    btn.textContent = VEnable ? "恢复播放器" : "移除播放器";
    if(VEnable){
      document.getElementById("live-player").remove();
    } else {
      location.reload();
    }
  });
  btnArea.insertBefore(btn, btnArea.children[0]);
})();