// ==UserScript==
// @name         Digivice FileIsland 去预览图
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  预览图去除后，就可以看到纯粹的像素图画廊，然后就能方便得下载到本地，进行Digivice游戏创作啦！
// @author       lnwazg
// @match        http://lcd.withthewill.net/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/407390/Digivice%20FileIsland%20%E5%8E%BB%E9%A2%84%E8%A7%88%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/407390/Digivice%20FileIsland%20%E5%8E%BB%E9%A2%84%E8%A7%88%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    console.log("【Digivice】begin to remove preview imgs...");
    $("img.dmpic").remove();
    $("img[title='WikiImage']").remove();//D-Scanner 图片删除
    console.log("【Digivice】End remove preview title.");
})();