// ==UserScript==
// @name                Coursera 小窗放大 隐藏侧栏
// @name:zh-CN          Coursera 小窗放大 隐藏侧栏
// @name:zh-TK          Coursera 小窗放大 隱藏側欄
// @name:zh-HK          Coursera 小窗放大 隱藏側欄
// @name:en             Coursera-Enhanced
// @description         自动隐藏侧边栏，更大的小窗
// @description:zh-CN   自动隐藏侧边栏，更大的小窗
// @description:zh-TW   自動隱藏側邊欄，更大的小窗
// @description:zh-HK   自動隱藏側邊欄，更大的小窗
// @description:en      Auto-hide sidebar, bigger small window

// @namespace    https://github.com/Nyaasu66/Coursera-Enhanced
// @version      0.0.1
// @author       Nyaasu
// @match        http*://www.coursera.org/learn/*
// @run-at       document-end
// @grant        none
// @license      CC-BY-NC-3.0
// @supportURL   https://github.com/Nyaasu66/Coursera-Enhanced/issues
// @date         08/14/2022
// @downloadURL https://update.greasyfork.org/scripts/449496/Coursera%20%E5%B0%8F%E7%AA%97%E6%94%BE%E5%A4%A7%20%E9%9A%90%E8%97%8F%E4%BE%A7%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/449496/Coursera%20%E5%B0%8F%E7%AA%97%E6%94%BE%E5%A4%A7%20%E9%9A%90%E8%97%8F%E4%BE%A7%E6%A0%8F.meta.js
// ==/UserScript==

(function () {
  "use strict";
  try {
    let side = "block";
    const btn = document.createElement("button");
    const btnStyle = {
      position: "fixed",
      top: "1px",
      left: "1px",
      zIndex: 99999,
      width: "20px",
      height: "20px",
      fontSize: "6px",
      padding: "1px",
    };
    Object.assign(btn.style, btnStyle);
    btn.textContent = "H";
    btn.onclick = hide;

    setTimeout(() => {
      hide();
      document.querySelector("body").appendChild(btn);
      addScrollListener(document.querySelector(".ItemPageLayout_content_body"));
    }, 5000);

    function addScrollListener(ele) {
      ele.addEventListener("scroll", () => {
        if (ele.scrollTop >= 677) {
          document.body.classList.add("enabled-userscript");
        } else if (ele.scrollTop < 460) {
          document.body.classList.remove("enabled-userscript");
        }
      });
    }

    function hide() {
      side === "none"
        ? ((side = "block"), (btn.textContent = "H"))
        : ((side = "none"), (btn.textContent = "S"));

      document.querySelector(
        ".ItemPageLayout_content_navigation"
      ).style.display = side;
    }

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `

    .enabled-userscript .rc-VideoMiniPlayer.mini .rc-VideoMiniControls, .rc-VideoMiniPlayer.mini .video-main-player-container {
      width: 820px;
    }

    .enabled-userscript .ItemPageLayout_content_body {
      margin-left: -170px
    }
  `;
    document.head.appendChild(style);
  } catch (e) {
    console.warn("脚本错误:\n", e);
  }
})();
