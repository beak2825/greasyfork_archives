// ==UserScript==
// @name         DMM圖片助手 v1.11
// @namespace    https://www.facebook.com/airlife917339
// @version      1.11
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @match        https://www.dmm.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376878/DMM%E5%9C%96%E7%89%87%E5%8A%A9%E6%89%8B%20v111.user.js
// @updateURL https://update.greasyfork.org/scripts/376878/DMM%E5%9C%96%E7%89%87%E5%8A%A9%E6%89%8B%20v111.meta.js
// ==/UserScript==

//抓取img的div
var img_div = document.getElementById('sample-image-block');

//抓取a圖片
var img_a = img_div.getElementsByTagName('a');

//圖片數量
var img_count = img_a.length;

//小大圖宣告
var url_s;
var url;

//替換小圖後在縮圖
for(var i=0; i<=img_count; i++) {
    url_s = img_a[i].getElementsByTagName('img')[0].src;
    url = url_s.replace(/(\w+)\s*-\s*(\w+)/, "$1jp-$2");
    img_a[i].getElementsByTagName('img')[0].src = url;
    img_a[i].getElementsByTagName('img')[0].width = 150;
    img_a[i].getElementsByTagName('img')[0].height = 100;
}