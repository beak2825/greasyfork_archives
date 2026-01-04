// ==UserScript==
// @name         腾讯动漫增加外链搜索
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://v.qq.com/*
// @grant        unsafeWindow
//@require       https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374278/%E8%85%BE%E8%AE%AF%E5%8A%A8%E6%BC%AB%E5%A2%9E%E5%8A%A0%E5%A4%96%E9%93%BE%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/374278/%E8%85%BE%E8%AE%AF%E5%8A%A8%E6%BC%AB%E5%A2%9E%E5%8A%A0%E5%A4%96%E9%93%BE%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let startsearch = document.createElement('a');
    startsearch.id = 'startsearch';
    startsearch.className = 'btn-red';
    startsearch.innerHTML = '开始搜索';
    $('ul > li').append(startsearch);
    startsearch.style.background = '#0077D1';
    startsearch.style.cursor = 'pointer';
    $('.btn-red').click(function(){
        var searchkey=$(this).prev().children('strong')[0].innerText;searchkey=searchkey.split(' ')[0];
        var url1="http://aaqqy.com/vod-search-pg-1-wd-"+searchkey+".html",url2="http://ifkdy.com/?q="+searchkey,url3="https://www.cilimao.me/search?word="+searchkey;
        unsafeWindow.open(url1);unsafeWindow.open(url2);unsafeWindow.open(url3)
    });
    // Your code here...
})();