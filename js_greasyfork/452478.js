// ==UserScript==
// @name         网页翻译
// @namespace    https://github.com/mefengl
// @version      2.1.3
// @description  🍓 一个按钮的事，一点都不费事
// @author       mefengl & zyb19981014
// @match        http://*/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=translate.google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452478/%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/452478/%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function createButton() {
    // if origin end with '.translate.goog', then return
    if (window.location.origin.endsWith(".translate.goog")) return;

    // if title contains Chinese, then make button less visible
    const hideRight = document.title.match(/[\u4e00-\u9fa5]/) ? "-130px" : "-120px";

    // create the button
    const button = document.createElement("button");
    button.innerHTML = "翻译网页";
    button.style.position = "fixed";
    button.style.width = "140px";
    button.style.top = "120px";
    button.style.right = hideRight;
    button.style.zIndex = "999999";
    button.style.backgroundColor = "#4285f4";
    button.style.color = "#fff";
    button.style.opacity = "0.8";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.padding = "10px 16px";
    button.style.fontSize = "18px";
    button.style.cursor = "pointer";
    button.style.transition = "right 0.3s";
    document.body.appendChild(button);

    // hover to show, and hide when not hover
    button.addEventListener("mouseenter", () => {
      button.style.right = "-10px";
    });
    button.addEventListener("mouseleave", () => {
      button.style.right = hideRight;
    });

    // hide button if full screen
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        button.style.display = "none";
      } else {
        button.style.display = "block";
      }
    });

    // set button click action
    button.addEventListener("click", () => {
      window.location.href = `https://translate.google.com/translate?sl=auto&tl=zh-CN&u=${window.location.href}`;
    });
  }

  window.addEventListener("load", createButton);
})();
