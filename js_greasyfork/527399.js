// ==UserScript==
// @name         Chiphell高亮显示三天内回复数超过50或查看数超过1000的帖子
// @description  适用于 Chiphell 论坛
// @namespace    https://www.chiphell.com
// @include      https://www.chiphell.com/*
// @version      0.1.3
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527399/Chiphell%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E4%B8%89%E5%A4%A9%E5%86%85%E5%9B%9E%E5%A4%8D%E6%95%B0%E8%B6%85%E8%BF%8750%E6%88%96%E6%9F%A5%E7%9C%8B%E6%95%B0%E8%B6%85%E8%BF%871000%E7%9A%84%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/527399/Chiphell%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E4%B8%89%E5%A4%A9%E5%86%85%E5%9B%9E%E5%A4%8D%E6%95%B0%E8%B6%85%E8%BF%8750%E6%88%96%E6%9F%A5%E7%9C%8B%E6%95%B0%E8%B6%85%E8%BF%871000%E7%9A%84%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==
// 获取所有帖子
const threadRows = document.querySelectorAll('tbody[id^="normalthread_"]');

threadRows.forEach(row => {
  // 获取回复数
  const replyCountElement = row.querySelector('td.num a.xi2');
  if (replyCountElement) {
    const replyCount = parseInt(replyCountElement.textContent);

    // 获取发布日期和时间
    const dateTimeElement = row.querySelector('td.by em span');
    if (dateTimeElement) {
      const dateTimeString = dateTimeElement.textContent;

      // 将日期和时间字符串转换为 Date 对象
      const [datePart, timePart] = dateTimeString.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      const postDate = new Date(year, month - 1, day, hour, minute);

      // 获取当前日期
      const currentDate = new Date();

      // 计算日期差（毫秒）
      const timeDiff = currentDate.getTime() - postDate.getTime();

      // 3天的时间戳（毫秒）
      const threeDays = 3 * 24 * 60 * 60 * 1000;

      // 如果回复数超过 50 且是最近 3 天内的帖子
      if (replyCount > 50 && timeDiff <= threeDays) {
        // 获取标题行  修改后的选择器
        const titleRow = row.querySelector('th.common');

        // 高亮显示标题行
        if (titleRow) {
          titleRow.style.backgroundColor = '#FFE0F0'; // 可以自定义颜色
        }
      }
    }
  }
});