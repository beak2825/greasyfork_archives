// ==UserScript==
// @name         B站直播间黑听模式
// @namespace    http://shenhaisu.cc/
// @version      1.5
// @description  使用按钮隐藏播放器的显示，但是能听得到并且可以发弹幕
// @author       ShenHaiSu_KimSama
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458208/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E9%BB%91%E5%90%AC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/458208/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E9%BB%91%E5%90%AC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  let displayMode = true;
  let newNode = document.createElement("button");
  let targetElement = null;
  newNode.innerText = "显";
  newNode.className = "icon-item danmu-block-icon live-skin-main-text";
  newNode.style.minWidth = "24px";
  newNode.style.minHeight = "24px";
  newNode.style.fontSize = "14px";
  newNode.style.padding = "0";
  newNode.style.backgroundColor = "black";

  newNode.addEventListener("click", () => {
    targetElement = document.querySelector("video[id]");
    displayMode = !displayMode;
    newNode.innerText = displayMode ? "显" : "隐";
    targetElement.style.display = displayMode ? "" : "none";
  });

  setTimeout(() => {
    document.querySelector(".icon-left-part").appendChild(newNode);
    document.querySelector("div.shop-popover").style.display = "none";
  }, 5000);

  setInterval(function(){
    targetElement = document.querySelector("video[id]");
    newNode.innerText = displayMode ? "显" : "隐";
    targetElement.style.display = displayMode ? "" : "none";
  }, 5000);
})();
