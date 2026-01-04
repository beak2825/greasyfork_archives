// ==UserScript==
// @name        百度首页自定义导航-> 取消默认推荐
// @namespace   Violentmonkey Scripts
// @match       https://www.baidu.com/
// @grant       none
// @version     1.3.1
// @author      liuml
// @license MIT
// @description 2023/7/30 14:32:53
// @downloadURL https://update.greasyfork.org/scripts/471898/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AF%BC%E8%88%AA-%3E%20%E5%8F%96%E6%B6%88%E9%BB%98%E8%AE%A4%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/471898/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AF%BC%E8%88%AA-%3E%20%E5%8F%96%E6%B6%88%E9%BB%98%E8%AE%A4%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

// 等待页面加载完成后执行代码
window.onload = function() {
     // 获取 s_xmancard_news_new 节点
  const xmancardNode = document.querySelector("#s_xmancard_news_new");

  // 检查是否找到 s_xmancard_news_new 节点
  if (xmancardNode) {
    // 将 s_xmancard_news_new 节点的样式设置为隐藏
    xmancardNode.style.display = "none";
    console.log("已隐藏 s_xmancard_news_new 节点");
  } else {
    console.log("未找到 s_xmancard_news_new 节点");
  }
const searchButton = document.querySelector("#s_menu_mine");

  // 模拟点击搜索按钮
  if (searchButton) {
    searchButton.click();
    console.log("已模拟点击我的关注");
  } else {
    console.log("未找到我的关注元素");
  }

};