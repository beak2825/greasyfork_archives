// ==UserScript==
// @name         掘金文章等级标注
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在掘金文章的详情页，标注当前文章等级，Lv3 以下文章不建议阅读。
// @author       poozhu
// @include      https://juejin.cn/post/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424258/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E7%AD%89%E7%BA%A7%E6%A0%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/424258/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E7%AD%89%E7%BA%A7%E6%A0%87%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    let [url, config] = args;
    if (url.includes("/content_api/v1/article/detail")) {
      const originalRes = await originalFetch(url, config);

      const resJson = await originalRes.clone().json();
      const {
        data: {
          article_info: { collect_count, digg_count, view_count },
        },
      } = resJson;
      const score = digg_count * 0.25 + collect_count * 0.5;
      if (score < 50 || view_count < 1000) {
        return;
      }
      const level = Math.round((score * 100) / view_count);

      const buttonNode = document.createElement("div");
      buttonNode.innerText = `Lv ${level}`;
      buttonNode.style.marginBottom = "1.667rem";
      buttonNode.style.width = "4rem";
      buttonNode.style.height = "4rem";
      buttonNode.style.backgroundColor = `rgba(0, 127, 255, ${(level || 0.5) * 0.2})`;
      buttonNode.style.borderRadius = "50%";
      buttonNode.style.textAlign = "center";
      buttonNode.style.fontSize = "1.4rem";
      buttonNode.style.color = "#ffffff";
      buttonNode.style.fontWeight = "bold";
      buttonNode.style.lineHeight = "4rem";
      const panelNode = document.querySelector(".article-suspended-panel");
      panelNode.insertBefore(buttonNode, panelNode.childNodes[0]);

      return originalRes;
    }

    return originalFetch(url, config);
  };
})();
