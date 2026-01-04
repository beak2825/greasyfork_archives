// ==UserScript==
// @name        【知识星球】自动化网页标题
// @namespace   Zsxq-AutoTitle
// @match       https://wx.zsxq.com/dweb2/index/*
// @match       https://wx.zsxq.com/dweb2/index/footprint/*
// @version     1.0
// @author      linying
// @license     要重新发布请联系我，谢谢
// @description 2024/5/20
// @downloadURL https://update.greasyfork.org/scripts/497873/%E3%80%90%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E3%80%91%E8%87%AA%E5%8A%A8%E5%8C%96%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/497873/%E3%80%90%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E3%80%91%E8%87%AA%E5%8A%A8%E5%8C%96%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

// 异步版本的 document.querySelector
async function asyncQuerySelector(selector) {
  return new Promise(function(resolve, reject) {
    const interval = 100;
    const timeout = 10000;
    let pastTime = 0;
    const timer = setInterval(() => {
      pastTime += interval;
      if (pastTime > timeout) {
        clearInterval(timer);
        reject(`通过 ${selector} 无法查询到元素！`);
        return;
      }
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        resolve(el);
      }
    }, interval);
  });
}

(async () => {
  if (location.href.indexOf("/footprint/") !== -1) {
    // 个人页面
    const user = await asyncQuerySelector("app-footprint div.user span.name");
    document.title = `${user.innerText} - 个人主页 - 知识星球`;
  } else {
    // 内容页面
    const user = await asyncQuerySelector("app-topic-header div.role");
    let content = document.querySelector("app-talk-content").innerText;
    if (content) {
      content = content.split(/\n/g)[0];
    }
    document.title = `${user.innerText} - ${content} - 知识星球`;
  }
})();
