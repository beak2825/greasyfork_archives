// ==UserScript==
// @name         豆瓣读书添加其他页面检索
// @namespace    https://github.com/awyugan
// @version      0.3.1.2
// @description  豆瓣读书添加其他页面检索。参考脚本替换链接即可在豆瓣添加检索。
// @author       awyugan
// @match        https://book.douban.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472385/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E6%B7%BB%E5%8A%A0%E5%85%B6%E4%BB%96%E9%A1%B5%E9%9D%A2%E6%A3%80%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/472385/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E6%B7%BB%E5%8A%A0%E5%85%B6%E4%BB%96%E9%A1%B5%E9%9D%A2%E6%A3%80%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function addSearchLink(baseUrl, searchTerm, linkText) {
    let title = document.getElementsByTagName('h1')[0].children[0].innerText;
    let info = document.getElementById('info');
    let liblink = document.createElement('a');
    let isbn = info.innerText.match(/\d{13}|\d{10}/)[0];
    liblink.href = baseUrl + encodeURIComponent(searchTerm === 'isbn' ? isbn : searchTerm);
    liblink.target = '_blank';
    liblink.innerText = linkText;
    info.appendChild(liblink);
  }

  addSearchLink('https://www.duozhuayu.com/search/book/', 'isbn', '多抓鱼搜索\n');
  addSearchLink('https://search.kongfz.com/product_result/?key=', 'isbn', '孔夫子旧书网搜索\n');
  addSearchLink('http://opac.nlc.cn/F/F134YHU1YX7GAUXVSMDHU26B8NLQP1PTM1H6LB25S2TTX3JG1F-22724?func=find-b&find_code=ISB&request=', 'isbn', '去国家图书馆搜索\n');
  addSearchLink('https://discover.lib.tsinghua.edu.cn/entrance/searchEntrance/sortList?query=any,contains,', 'isbn', '去清华大学图书馆搜索\n');
  addSearchLink('https://sc.lcsd.gov.hk/TuniS/webcat.hkpl.gov.hk/search/query?match_1=MUST&field_1=isbn&term_1=', 'isbn', '去香港公共图书馆搜索\n');
  addSearchLink('https://www.goodreads.com/search?q=', 'isbn', '去goodreads搜索\n');
  addSearchLink('https://z-library.sk/s/', 'isbn', '去zlib搜索isbn ');
  addSearchLink('https://z-library.sk/s/','"' + document.getElementsByTagName('h1')[0].children[0].innerText + '"', '/书名\n');
  addSearchLink('https://zh.annas-archive.org/search?q=', 'isbn', '去安娜搜索isbn ');
  addSearchLink('https://zh.annas-archive.org/search?q=', '"' + document.getElementsByTagName('h1')[0].children[0].innerText + '"', '/书名\n');
})();

// 如果想添加链接，可以向AI提问修改
// 示范⬇️
//   addSearchLink('检索链接', '检索字段', '显示名称\n（换行符）');