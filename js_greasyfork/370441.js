// ==UserScript==
// @name         瓣书
// @namespace    http://cn.sepiggy/
// @version      0.0.2
// @description  提供图书资源地址 (支持 CSDN)
// @author       sepiggy
// @match        *://book.douban.com/subject/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370441/%E7%93%A3%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/370441/%E7%93%A3%E4%B9%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var csdnURL = "https://download.csdn.net/psearch/0/10/0/2/1/"
    var $bookName = $('h1 span').html();
    var $author = $('#info span:contains("作者") ~ a').html();
    // var queryURL = csdnURL + $bookName + " " + $author;
    var queryURL = csdnURL + $bookName;
    $('#info').append('<span class="pl">下载: </span>');
    $('#info').append('<a href="' + queryURL + '">csdn</a>');
})();
