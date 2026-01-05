// ==UserScript==
// @name        煎蛋精神病人隔离计划
// @namespace   无
// @author      睫毛小金刚
// @description 屏蔽煎蛋某些用户的无聊图和文章的评论
// @include     http://jandan.net/xxoo*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25892/%E7%85%8E%E8%9B%8B%E7%B2%BE%E7%A5%9E%E7%97%85%E4%BA%BA%E9%9A%94%E7%A6%BB%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/25892/%E7%85%8E%E8%9B%8B%E7%B2%BE%E7%A5%9E%E7%97%85%E4%BA%BA%E9%9A%94%E7%A6%BB%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==
var allElements,
thisElement;
allElements = document.getElementsByTagName('strong');
for (var i = allElements.length - 1; i >= 0; i--) {
  thisElement = allElements[i];
  // 使用 thisElement
  var ID = thisElement.firstChild.nodeValue;
  if (ID == 'sein' || ID == '小宝') //这里设置成要屏蔽的ID
  {
    thisElement.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(thisElement.parentNode.parentNode.parentNode.parentNode); //删除其发表的无聊图
  }
}