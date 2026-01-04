// ==UserScript==
// @name         purify-zhihu
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  屏蔽知乎首页视频
// @author       You
// @match        https://www.zhihu.com/*
// @icon         https://pic4.zhimg.com/80/v2-88158afcff1e7f4b8b00a1ba81171b61_720w.png
// @grant        none

//1. 去除非登录下的弹框
//2. 去除视频推送
// @downloadURL https://update.greasyfork.org/scripts/432582/purify-zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/432582/purify-zhihu.meta.js
// ==/UserScript==
const inv = 1000 * 1; // 1 s

// 去除视频
const f1 = () => {
  const hasVideo = (div) => {
    const info = div.getAttribute("data-za-extra-module");
    return info && JSON.parse(info)?.card?.has_video;
  };
  const q = ".Card.TopstoryItem.TopstoryItem > .Feed ";
  const check = (dom) => {
    const div = dom.querySelector(".ContentItem");
    if (dom.classList.contains("Modal-wrapper")) return true;
    if (hasVideo(dom) || hasVideo(div)) {
      return true;
    }
    return false;
  };
  const list = Array.from(document.querySelectorAll(q));
  for (const item of list) {
    if (check(item)) {
      item.parentElement?.remove?.();
    }
  }
};

// 去除登录弹框
const f2 = () => {
  const q = ".Modal-wrapper";
  const dom = document.querySelector(q);
  if (!dom) return;
  const s = ".Button.Modal-closeButton.Button--plain";
  const b = document.querySelector(s);
  b?.click?.();
};
const run = () => {
  [f1, f2].forEach((f) => f());
};
(function () {
  "use strict";
  run();
  setInterval(run, inv);
})();
