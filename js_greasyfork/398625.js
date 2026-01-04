// ==UserScript==
// @name         建筑出版社下载电子书
// @namespace    https://greasyfork.org/zh-CN/scripts/398625-%E5%BB%BA%E7%AD%91%E5%87%BA%E7%89%88%E7%A4%BE%E4%B8%8B%E8%BD%BD%E7%94%B5%E5%AD%90%E4%B9%A6
// @version      1.1
// @description  try to take over the world!
// @author       Cesaryuan
// @match        http*://dlib.cabplink.com/*
// @match        http://book.cabplink.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398625/%E5%BB%BA%E7%AD%91%E5%87%BA%E7%89%88%E7%A4%BE%E4%B8%8B%E8%BD%BD%E7%94%B5%E5%AD%90%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/398625/%E5%BB%BA%E7%AD%91%E5%87%BA%E7%89%88%E7%A4%BE%E4%B8%8B%E8%BD%BD%E7%94%B5%E5%AD%90%E4%B9%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (/book\.cabplink\.com\/bookdetail\.jsp\?id=/.test(document.location.href)) {
        var parent = document.querySelector('.information_but2');
        var book_id = /(?<=征订号：)\d+/.exec(document.body.innerText)
        }
    else if(/dlib\.cabplink\.com\/book\/\d+\.shtml/.test(document.location.href)){
        var download_button = document.createElement('a')
        download_button.innerText = '下载'
        download_button.style.cssText =
            "margin: 8px 0px 0px 28px;"+
            "padding: 9px 50px 12px 50px;"+
            "border-radius: 3px;"+
            "display: inline-block;"+
            "text-align: center;"+
            "color: #ffffff!important;"+
            "background: #f30000;"
        parent = document.querySelector('.book_detail_oper');
        book_id = /\d+(?=\.shtml)/.exec(document.location.href);
        parent.appendChild(download_button);
        let imgUrl = document.querySelector('.book_detail_img img').src;
        let book_url = 'http://dlib.cabplink.com/upload' + /(?<=upload).+(?=\d\.)/.exec(imgUrl) + '0.pdf';
        download_button.href = book_url;
        download_button.download = document.querySelector('title').innerText
    }
    else if(/.*\/book\/catBooks\/.*/.test(document.location.href)){
        var book = document.querySelectorAll('.cate_list_item');
        var bookName = document.querySelectorAll('.cate_list_item .cate_item_detail a');
        var img = document.querySelectorAll('.cate_list_item img');
        var downloadArea = document.querySelectorAll('.cate_list_item .item_detail_price');
        for(var i = 0; i<book.length; i++){
            var d = document.createElement('a');
            d.innerText = '下载';
            let imgUrl = img[i].src;
            let book_url = 'http://dlib.cabplink.com/upload' + /(?<=upload).+(?=\d\.)/.exec(imgUrl) + '0.pdf';
            d.href = book_url;
            d.download = bookName[i].title;
            downloadArea[i].appendChild(d);
        }}

    // Your code here...
})();