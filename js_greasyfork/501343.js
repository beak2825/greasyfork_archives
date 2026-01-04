// ==UserScript==
// @name        WhaleScroll
// @namespace   https://greasyfork.org/zh-CN/users/1337574-mirakelor
// @description 双击切换自动滚屏 - 基于AutoScroll by OscarKoo
// @match             *://*/*
// @version     2024.07.22
// @author      Mirakelor
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501343/WhaleScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/501343/WhaleScroll.meta.js
// ==/UserScript==

(function(document) {

  var scrollingEnabled = false;
  var scrollTimerId = 0;


  /**
   * 处理双击事件：反转滚动状态并触发滚动逻辑。
   */
  var toggleScroll = function() {
    scrollingEnabled = !scrollingEnabled;
    clearTimeout(scrollTimerId);
    if (scrollingEnabled) startScroll();
  };



  /**
   * 实现自动滚屏，每间隔一定的延迟进行滚动操作。
   */
  var startScroll = function() {

    window.scrollTo(0, window.scrollY + 1);
    scrollTimerId = setTimeout(startScroll, 15); // 可配置滚动速度
  };




  // 将双击事件与处理函数绑定，注意使用一次移除旧事件
  document.body.removeEventListener('dblclick', toggleScroll);
  document.body.addEventListener('dblclick', toggleScroll);

})(document);