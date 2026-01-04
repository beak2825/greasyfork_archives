// ==UserScript==
// @name         豆瓣读书直达江苏大学图书馆搜索
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.3
// @description  豆瓣读书直达江苏大学图书馆搜索，方便找书
// @author       tmr
// @include      https://book.douban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373109/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E7%9B%B4%E8%BE%BE%E6%B1%9F%E8%8B%8F%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/373109/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E7%9B%B4%E8%BE%BE%E6%B1%9F%E8%8B%8F%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let title = document.getElementsByTagName('h1')[0].children[0].innerText;
  let info = document.getElementById('info');
  let liblink = document.createElement('a');
  let isbn = info.innerText.match(/\d{13}|\d{10}/)[0];
  liblink.href =
    'http://huiwen.ujs.edu.cn:8080/opac/openlink.php?strSearchType=isbn&match_flag=full&historyCount=1&strText=' +
    isbn +
    '&doctype=ALL&with_ebook=on&displaypg=20&showmode=list&sort=CATA_DATE&orderby=desc&location=ALL';
  liblink.target = '_blank';
  liblink.innerText = '去江苏大学图书馆搜索';
  info.appendChild(liblink);
})();
