// ==UserScript==
// @id            xuqb@lib.pku.edu.cn
// @name          豆瓣读书导出到 EndNote
// @namespace     lib.pku.edu.cn
// @version       1.0
// @description   从豆瓣读书的图书页面一键获取 EndNote Import 类型参考文献文件
// @author        馆君
// @match         https://book.douban.com/subject/*
// @connect       api.douban.com
// @grant         GM_xmlhttpRequest
// @grant         GM_setClipboard
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/31009/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E5%AF%BC%E5%87%BA%E5%88%B0%20EndNote.user.js
// @updateURL https://update.greasyfork.org/scripts/31009/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E5%AF%BC%E5%87%BA%E5%88%B0%20EndNote.meta.js
// ==/UserScript==
var styles = "@charset utf-8;";
styles += " .icoPlus {display: inline-block; zoom: 1; width: 10px; height: 16px; vertical-align: middle; overflow: hidden; background: #fff url(https://img3.doubanio.com/f/sns/61cc48ba7c40e0272d46bb93fe0dc514f3b71ec5/pics/add-doulist.gif) no-repeat 0 0;}";
GM_addStyle(styles); // 油猴脚本附加 CSS


function getJSON(url, meta, callback) { // XHR 回调函数模板——使用该函数可成功跨域请求 JSON
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    headers: {
      'User-agent': window.navigator.userAgent,
      //'Content-type': 'application/json',
      'Accept': 'application/atom+xml,application/xml,text/xml'
    },
    onload: function(responseDetail) {
      var doc = {};
      if (responseDetail.status == 200) {
        doc = $.parseJSON(responseDetail.responseText);
      }
      callback(doc, responseDetail, meta);
    }
  });
}


(function() {
  'use strict';
  var hostName = window.location.hostname; // 当前网址的域名
  var pathName = window.location.pathname; // 当前网址的路径
  if (hostName == "book.douban.com" && /^\/subject\/\d+\/$/.test(pathName)) {
    // 豆瓣读书的图书页面，在写笔记之前添加一个按钮
    $(".ul_subject_menu").prepend("<li><i class='icoPlus'></i><a id='downloadEndNoteImport'>导出到 EndNote</a></li>");
    getJSON("https://api.douban.com/v2/book/" + window.location.pathname.match(/\d+/)[0], null, function(thisBook, resp, meta) {
      var content = "%0 Book\n%T " + thisBook.title; // Reference Types + Title
      $("#downloadEndNoteImport").attr("download", "[豆瓣图书]" + thisBook.title + ".txt");
      try {
        content += "\n%T " + thisBook.subtitle; // Title
        content += "\n%Q " + thisBook.alt_title; // Translated Title
        if (thisBook.series)
          content += "\n%B " + thisBook.series.title; // Series Title
        content += "\n%A " + thisBook.author.join("\n%A ").replace(/\[/,"［").replace(/]/, "］"); // Author
        content += "\n%? " + thisBook.translator.join("\n%? "); // Translator
        content += "\n%I " + thisBook.publisher; // Publisher
        content += "\n%D " + thisBook.pubdate.match(/\d{4}/)[0]; // Year
        content += "\n%8 " + thisBook.pubdate; // Date
        content += "\n%@ " + (thisBook.isbn13 ? thisBook.isbn13 : (thisBook.isbn10 ? thisBook.isbn10.replace(/^SH/, "统一书号 ") :"（无）")); // ISBN
        content += "\n%& " + thisBook.pages; // Pages
        content += "\n%U " + thisBook.alt; // URL
      } catch (e) {console.log(e);} // 主要是缺少属性的错误，直接忽略
      $("#downloadEndNoteImport").attr("href", "data:text/plain;charset=UTF-8," + encodeURIComponent(content));
    });
  }
})();