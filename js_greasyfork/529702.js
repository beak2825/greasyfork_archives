// ==UserScript==
// @name         红色有角三倍速
// @namespace    http://yunagi.dev/
// @version      1.0.4
// @description  增加B站的倍速可选项
// @author       Itsuki Moroshima
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/529702/%E7%BA%A2%E8%89%B2%E6%9C%89%E8%A7%92%E4%B8%89%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/529702/%E7%BA%A2%E8%89%B2%E6%9C%89%E8%A7%92%E4%B8%89%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        // 判断目标元素是否被渲染
        const targetElement = document.querySelector(
          ".bpx-player-ctrl-playbackrate-menu"
        );
        if (targetElement) {
          const speeds = ["3.0", "4.0"];

          const parent = document.getElementsByClassName(
            "bpx-player-ctrl-playbackrate-menu"
          )[0];

          speeds.forEach((speed) => {
            const li = document.createElement("li");
            li.className = "bpx-player-ctrl-playbackrate-menu-item";
            li.dataset.value = speed;
            li.textContent = `${speed}x`;
            parent.prepend(li);
          });

          observer.disconnect();
        }
      }
    }
  };

  const observer = new MutationObserver(callback);

  observer.observe(document.body, { childList: true, subtree: true });
})();