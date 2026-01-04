// ==UserScript==
// @name 鼎盛论坛高亮显示三天内查看数超过500的帖子
// @description 适用于鼎盛论坛
// @namespace https://top81.ws/list.php?f=1&p=1
// @include https://top81.ws/list.php?*
// @version 0.1.0
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527408/%E9%BC%8E%E7%9B%9B%E8%AE%BA%E5%9D%9B%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E4%B8%89%E5%A4%A9%E5%86%85%E6%9F%A5%E7%9C%8B%E6%95%B0%E8%B6%85%E8%BF%87500%E7%9A%84%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/527408/%E9%BC%8E%E7%9B%9B%E8%AE%BA%E5%9D%9B%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E4%B8%89%E5%A4%A9%E5%86%85%E6%9F%A5%E7%9C%8B%E6%95%B0%E8%B6%85%E8%BF%87500%E7%9A%84%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

// 获取当前日期
const currentDate = new Date();

// 计算三天前的日期
const threeDaysAgo = new Date();
threeDaysAgo.setDate(currentDate.getDate() - 3);

// 获取所有帖子元素
const postItems = document.querySelectorAll('li.o');

// 遍历帖子元素
postItems.forEach(item => {
  // 获取帖子链接
  const postLink = item.querySelector('a');

  // 获取帖子标题
  const postTitle = postLink.textContent;

  // 获取帖子日期和查看数
  const postInfo = item.querySelector('font[color="black"]').textContent;
  const postDateStr = postInfo.match(/\d{4}-\d{2}-\d{2}/)[0];
  const postViewsStr = postInfo.match(/\[(\d+)\]/)[1];

  // 将日期字符串转换为 Date 对象
  const postDate = new Date(postDateStr);

  // 将查看数字符串转换为数字
  const postViews = parseInt(postViewsStr);

  // 判断是否为最近三天内且查看数超过 500
  if (postDate >= threeDaysAgo && postViews > 500) {
    // 高亮显示标题行
    item.style.backgroundColor = 'ADFF2F'; // 可以自定义高亮颜色
  }
});