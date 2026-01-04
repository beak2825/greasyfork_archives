// ==UserScript==
// @name         贴吧wap版
// @namespace    http://tampermonkey.net/
// @version      2024-10-29
// @description  贴吧wap版，无法回帖
// @author       You
// @match        http://tieba.baidu.com/mo/*
// @match        https://tieba.baidu.com/mo/*
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/514963/%E8%B4%B4%E5%90%A7wap%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/514963/%E8%B4%B4%E5%90%A7wap%E7%89%88.meta.js
// ==/UserScript==

function viewport() {
    if (document.querySelector('meta[name="viewport"]')) {
      return;
    }
    const el = document.createElement("meta");
    el.name = "viewport";
    el.content = "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no";
    document.head.append(el);
}

(function() {
    'use strict';

viewport();
 var mycss1 = `
 body {
    font-size: 16px!important;
    line-height: auto!important;
    margin: 1px;
}
.i{line-break: anywhere;}
img{width:auto;}
`;

GM_addStyle(mycss1);


$('.i a').attr('target', '_blank');


$('a').each(function() {
    if ($(this).text() === "图") {
        // 获取图片的 URL
        var imgUrl = $(this).attr('href');

        // 创建 img 标签
        var imgTag = $('<img>').attr('src', imgUrl).css({}); // 可调整大小

        // 用 img 标签替换 a 标签内容
        $(this).html(imgTag);
    }
});


})();