// ==UserScript==
// @name         掘金沸点优化
// @namespace    https://greasyfork.org/en/scripts/538542-%E6%8E%98%E9%87%91%E6%B2%B8%E7%82%B9%E4%BC%98%E5%8C%96
// @version      0.1
// @description  掘金沸点优化，屏蔽圈子，hrd图片优化
// @author       Allen-1998
// @match        *://juejin.cn/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538542/%E6%8E%98%E9%87%91%E6%B2%B8%E7%82%B9%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/538542/%E6%8E%98%E9%87%91%E6%B2%B8%E7%82%B9%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 屏蔽圈子
  {
    const blackClubs = ["Trae 用户交流圈", "理财交流圈"];
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          filterBlackClubs(mutation.addedNodes);
        }
      });
    });

    function filterBlackClubs(nodes = []) {
      nodes.forEach((node) => {
        const club = node.querySelector(".pin-club-box .club span");
        if (club && blackClubs.includes(club.textContent)) {
          node.remove();
        }
      });
    }

    // 检测selector是否已经渲染
    function waitForSelector(selector) {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (document.querySelector(selector)) {
            clearInterval(interval);
            resolve(true);
          }
        }, 100);
      });
    }

    async function createObserver() {
      observer.disconnect();
      await waitForSelector(".pin-list > li");
      filterBlackClubs(document.querySelectorAll(".pin-list > li"));
      observer.observe(document.querySelector(".pin-list"), {
        childList: true,
      });
    }

    window.addEventListener("load", () => {
      createObserver();
    });

    const originalPushState = history.pushState;
    history.pushState = function () {
      originalPushState.apply(this, arguments);
      window.dispatchEvent(new Event("pushstate"));
    };

    window.addEventListener("pushstate", () => {
      createObserver();
    });

    window.addEventListener("unload", () => {
      observer.disconnect();
    });
  }

  // hrd图片优化
  {
    const head = document.querySelector("head");
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText = `
img {
  filter: opacity(1);
}
`;
    head.append(style);
  }
})();
