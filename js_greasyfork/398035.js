// ==UserScript==
// @name        知乎右上角显示编辑时间
// @name:zh-TW  知乎右上角顯示編輯時間
// @name:en     Show Editing Time at Top-right
// @namespace   https://greasyfork.org/en/users/211578
// @description 在内容右上角显示编辑时间
// @description:zh-TW  在内容右上角顯示編輯時間
// @description:en  Move the editing time of posts to their top right corners.
// @version     1.0
// @match       https://*.zhihu.com/*
// @run-at      document-idle
// @inject-into auto
// @grant       GM_addStyle
// @author      twchen
// @downloadURL https://update.greasyfork.org/scripts/398035/%E7%9F%A5%E4%B9%8E%E5%8F%B3%E4%B8%8A%E8%A7%92%E6%98%BE%E7%A4%BA%E7%BC%96%E8%BE%91%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/398035/%E7%9F%A5%E4%B9%8E%E5%8F%B3%E4%B8%8A%E8%A7%92%E6%98%BE%E7%A4%BA%E7%BC%96%E8%BE%91%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

if (typeof GM_addStyle == "undefined") {
  this.GM_addStyle = css => {
    const style = document.createElement("style");
    style.textContent = css;
    document.documentElement.appendChild(style);
    return style;
  };
}

const url = window.location.href;
if (url.includes("zhuanlan")) {
  const container = document.querySelector(".Post-RichTextContainer");
  const time = document.querySelector(".ContentItem-time");
  container.appendChild(time);
  GM_addStyle(`
    .Post-RichTextContainer {
      position: relative;
    }
    .ContentItem-time {
      position: absolute;
      top: -1rem;
      right: 0;
      margin: 0;
      padding: 0;
    }
  `);
} else if (url.includes("collection")) {
  GM_addStyle(`
    .answer-date-link {
      position: absolute;
      top: 0;
      right: 0;
    }
  `);
} else {
  GM_addStyle(`
    .RichContent {
      position: relative;
    }
    .ContentItem-time {
      position: absolute;
      top: -1.5rem;
      right: 0;
      margin: 0;
      padding: 0;
    }
  `);
}
