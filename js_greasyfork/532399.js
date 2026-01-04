// ==UserScript==
// @name         どこでもフルスクリーン
// @namespace    https://github.com/himuro-majika
// @version      2025-04-10
// @description  メニューにフルスクリーンボタンを追加
// @author       himuro_majika
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532399/%E3%81%A9%E3%81%93%E3%81%A7%E3%82%82%E3%83%95%E3%83%AB%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/532399/%E3%81%A9%E3%81%93%E3%81%A7%E3%82%82%E3%83%95%E3%83%AB%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function showFullscreenButton() {
    const button = document.createElement("div");
    button.id = "__GM_fe";
    button.style.cssText = `
      position: fixed;
      height: 100vh;
      width: 100vw;
      z-index: 1;
      left: 0;
      top: 0;
      background-color: #fffa;
    `;
    button.addEventListener("click", () => {
      button.remove();
      toggleFullScreen();
    });
    document.querySelector("body").append(button);
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(()=>{
        showFullscreenButton();
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  GM_registerMenuCommand("フルスクリーン切り替え", function() {
    toggleFullScreen();
  }, "l");

})();