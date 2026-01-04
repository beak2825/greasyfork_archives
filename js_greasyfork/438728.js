// ==UserScript==
// @name         豆瓣采集【内部工具】
// @namespace    https://hz.cn2down.com
// @version      0.1
// @description  豆瓣新书速递、最受关注、豆瓣阅读
// @author       zenghp2015
// @match        *://book.douban.com/latest*
// @match        *://book.douban.com/chart*
// @match        *://read.douban.com/category/*
// @match        *://book.douban.com/subject/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.0.0/jquery.js
// @icon         https://img3.doubanio.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        window.close
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438728/%E8%B1%86%E7%93%A3%E9%87%87%E9%9B%86%E3%80%90%E5%86%85%E9%83%A8%E5%B7%A5%E5%85%B7%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/438728/%E8%B1%86%E7%93%A3%E9%87%87%E9%9B%86%E3%80%90%E5%86%85%E9%83%A8%E5%B7%A5%E5%85%B7%E3%80%91.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const doubanURL = window.location.href;
  const cacheKeyName = 'cn2down_douban'

  const cache = {
    get(name){
      return GM_getValue(name)
    },
    set(name, value){
      GM_setValue(name, value)
    },
    delete(){
      GM_deleteValue();
    }
  }

  const app = {
    run: function(){
      if(/\/latest/.test(doubanURL)) {
        this.latest();
      } else if(/\/chart/.test(doubanURL)) {
      } else if(/\/category/.test(doubanURL)) {
      } else if(/\/subject/.test(doubanURL)) {
        this.bookInfo();
      }
    },
    // 新书速递
    latest: function(){
      const bookList = $('.chart-dashed-list li')
      // const newTable = GM_openInTab('https://book.douban.com/subject/35671232/')
      // newTable.onclose = function(res){
      //   console.log(res)
      // }
      // console.log(newTable)
      bookList.each((index, item) => {
        console.log(item)
      })
    },
    // 最受关注
    chart: function(){},
    // 豆瓣阅读
    read: function(){},
    // 书籍信息
    bookInfo: function() {
      if(!/collect/.test(doubanURL)) return;

      const doubanid = doubanURL.match(/\/subject\/(\d+)\//)[1]
      const title = $('h1').text().replace(/[\s\n]+/g, '')
      const author = $('#info span').eq(0).text().replace(/[\s\n]+/g, '').replace('作者:', '')
      const image = $('#mainpic img').attr('src');
      const bookInfo = $('#info').text();
      const subtitle = bookInfo.match(/副标题:\s+(.*)\n/)
      const originTitle = bookInfo.match(/原作名:\s+(.*)\n/)
      const translator = bookInfo.match(/译者:\s+(.*)\n/)
      const isbn = bookInfo.match(/ISBN:\s+([0-9\-]+)\n/)
      const binding = bookInfo.match(/装帧:\s+(.*)\n/)
      const publisher = bookInfo.match(/出版社:\s+(.*)\n/)
      const pubdate = bookInfo.match(/出版年:\s+(.*)\n/)
      const series = bookInfo.match(/丛书:\s+(.*)\n/)
      const price = bookInfo.match(/定价:\s+(.*)元\n/)
      const summary = $('.related_info .indent').eq(0).find('.intro').html() || ''
      const authorIntro = $('.related_info .indent').eq(1).find('.intro').html() || ''
      const catalog = $('.related_info .indent').eq(2).html() || ''

      const cacheName = `${cacheKeyName}_bookInfo_${doubanid}`
      GM_setValue(cacheName, {
        doubanid,
        title,
        image,
        author,
        subtitle: subtitle && subtitle[1] || '',
        originTitle: originTitle && originTitle[1] || '',
        translator: translator && translator[1] || '',
        isbn: isbn && isbn[1] || '',
        binding: binding && binding[1] || '',
        publisher: publisher && publisher[1] || '',
        pubdate: pubdate && pubdate[1] || '',
        series: series && series[1] || '',
        price: price && price[1] || '',
        summary,
        authorIntro,
        catalog
      })

      setTimeout(window.close, 300)
    },
    openTab: function(url, opts = {}){
      return new Promise(resolve => {
        const tab = GM_openInTab(url, opts);
        tab.onclose = function() {
          resolve();
        }
      })
    },
  };

  $(document).ready(function() {
    try {app.run()}catch(e){console.log(e)}
  });
})();