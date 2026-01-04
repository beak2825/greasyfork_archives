// ==UserScript==
// @name         豆瓣小组去除标题省略号
// @namespace    https://littlee.github.io/
// @version      0.1
// @description  去除豆瓣小组的标题省略号，显示完整标题
// @author       Littlee
// @match        https://www.douban.com/group/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40140/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E5%8E%BB%E9%99%A4%E6%A0%87%E9%A2%98%E7%9C%81%E7%95%A5%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/40140/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E5%8E%BB%E9%99%A4%E6%A0%87%E9%A2%98%E7%9C%81%E7%95%A5%E5%8F%B7.meta.js
// ==/UserScript==
(function() {
  $('.olt')
    .find('td.title > a, td.td-subject > a')
    .each(function() {
      var $this = $(this);
      $this.text($this.attr('title'));
    });
})();