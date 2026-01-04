// ==UserScript==
// @name         雪阅模式|SNOREAD-横向滚动组件
// @namespace    https://userscript.snomiao.com/
// @version      0.2(20191119)
// @description  【自用，目前还有很多BUG】 从雪阅模式 分离出来的 横向滚动组件，适用于只有纵向滚轮的鼠标。具有如下特性： 1. 在滚动页面的时候，首先会执行横向滚动，然后才是纵向。 2. 按元素大小成比例滚动，鼠标滚轮 一格 = 0.5 屏
// @author       snomiao@gmail.com
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439214/%E9%9B%AA%E9%98%85%E6%A8%A1%E5%BC%8F%7CSNOREAD-%E6%A8%AA%E5%90%91%E6%BB%9A%E5%8A%A8%E7%BB%84%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/439214/%E9%9B%AA%E9%98%85%E6%A8%A1%E5%BC%8F%7CSNOREAD-%E6%A8%AA%E5%90%91%E6%BB%9A%E5%8A%A8%E7%BB%84%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var 监听滚动 = (e) => {
    [...e.children].map(监听滚动);
    if (e.flag_已监听滚动) return;
    e.flag_已监听滚动 = 1;

    var handleScroll = (事件) => {
      if (事件.altKey || 事件.ctrlKey || 事件.shiftKey) return;
      var scrollRate = ((事件.detail || -事件.wheelDelta) / 120) * 0.5;
      var scrolled_x =
        e.scrollLeft !=
        ((e.scrollLeft += scrollRate * e.clientWidth), e.scrollLeft);
      if (scrolled_x) {
        e.scrollIntoViewIfNeeded();
        事件.preventDefault();
        事件.stopPropagation();
        return false;
      }
      var scrolled_y =
        e.scrollTop !=
        ((e.scrollTop += scrollRate * e.clientHeight), e.scrollTop);
      if (scrolled_y) {
        e.scrollIntoViewIfNeeded();
        事件.preventDefault();
        事件.stopPropagation();
        return false;
      }
      // 横竖都滚到底了
      [...e.children].map(监听滚动);
    };
    e.addEventListener("mousewheel", handleScroll, {
      capture: false,
      passive: false,
    }); // Chrome/Edge
    e.addEventListener("DOMMouseScroll", handleScroll, {
      capture: false,
      passive: false,
    }); // FF
  };
  var 入口 = () => 监听滚动(document.body);
  document.addEventListener("load", 入口);
  window.addEventListener("load", 入口);
  入口();
})();
