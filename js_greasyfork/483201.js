// ==UserScript==
// @name        Blue Archive Minigame DoubleClick Fullscreen
// @name:zh-CN  蔚蓝档案网页迷你游戏双击全屏
// @name:zh-TW  蔚藍檔案網頁迷你遊戲雙擊全螢幕
// @description After the mini-game is loaded, double-click the mini-game area to play in full screen.
// @description:zh-CN 等待小游戏加载完成后，双击小游戏区域即可全屏游玩
// @description:zh-TW 等待小遊戲載入完成後，雙擊小遊戲區域即可全螢幕遊玩
// @license MIT
// @namespace   https://greasyfork.org/zh-CN/users/220174-linepro
// @match       *://bluearchive.nexon.com/events/2023/12/minigame
// @match       *://*/events/2023/12/minigame
// @grant       none
// @version     1.1
// @author      LinePro
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/483201/Blue%20Archive%20Minigame%20DoubleClick%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/483201/Blue%20Archive%20Minigame%20DoubleClick%20Fullscreen.meta.js
// ==/UserScript==
// const minigameElem = document.querySelector("div.minigame");
const canvasElem = document.querySelector("canvas#unity-canvas");
canvasElem.ondblclick = function () {
  if (!document.fullscreenElement) {
    canvasElem.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
console.log("fullscreen enabled");