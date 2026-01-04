// ==UserScript==
// @name         百度贴吧自动收起回复
// @namespace    http://shenhaisu.cc/
// @version      1.0
// @description  进入贴吧正文内容自动收起单楼回复，仅显示楼的主题内容
// @author       You
// @match        https://tieba.baidu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/465260/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E6%94%B6%E8%B5%B7%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/465260/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E6%94%B6%E8%B5%B7%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
  // 定义主方法
  const closeTab = () => {
    document
      .querySelectorAll("div.j_lzl_r.p_reply>span.lzl_link_fold")
      .forEach((item) => item.click());
  };
  const watchChange = () => {
    let obsTarget = document.querySelector("div.loading-tip");
    new MutationObserver((mutations) => {
      console.log("检测到变动", mutations);
      setTimeout(() => {
        watchChange();
        closeTab();
      }, 2000);
    }).observe(obsTarget, {
      attributes: true,
      attributeOldValue: true,
    });
  };

  // 首次打开帖子自动收起
  closeTab();

  // 监听翻页加载
  watchChange();
})();
