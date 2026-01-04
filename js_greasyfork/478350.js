// ==UserScript==
// @name          哔哩哔哩新版动态页面回到旧版(bilibili)
// @namespace     http://tampermonkey.net/
// @version       1.1.0
// @author        Ling2Ling4
// @description   自动点击 个人空间/专栏/动态 的"回到旧版"按钮
// @license MIT
// @icon data:image/png;base64,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
// @match         *://space.bilibili.com/*
// @match         *://www.bilibili.com/read/*
// @match         *://www.bilibili.com/opus/*
// @match         *://t.bilibili.com/*
// @run-at        document-end
// @compatible    chrome
// @compatible    edge
// @compatible    firefox
// @downloadURL https://update.greasyfork.org/scripts/478350/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%96%B0%E7%89%88%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88%28bilibili%29.user.js
// @updateURL https://update.greasyfork.org/scripts/478350/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%96%B0%E7%89%88%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88%28bilibili%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 个人空间
  if (window.location.href.includes("space.bilibili.com/")) {
    clickBtn(".space-float > div:nth-child(2) > div", ["回到旧版", "返回旧版"]);
  }
  // 专栏页面
  if (window.location.href.includes("bilibili.com/read/")) {
    clickBtn(".side-toolbar__btn", ["回到旧版", "返回旧版"]);
  }
  // 动态页面
  if (window.location.href.includes("bilibili.com/opus/") || window.location.href.includes("t.bilibili.com/")) {
    clickBtn(".side-toolbar__btn", ["回到旧版", "返回旧版"]);
  }

  // 自动点击包含指定文本的按钮
  function clickBtn(selector, textList, retryCount = 3) {
    const ele = document.querySelector(selector);
    // console.log(ele);
    if (!ele) {
      if (retryCount > 0) {
        retryCount--;
        setTimeout(() => {
          // 每隔0.5秒重试一次
          clickBtn(selector, textList);
        }, 500);
      }
      return;
    }
    const f = textList.some((text) => ele.textContent.includes(text));
    if (f) {
      // 自动点击"回到旧版"按钮
      ele.click();
    }
  }
})();
