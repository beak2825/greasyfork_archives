// ==UserScript==
// @author       YuXianwen
// @name         Tapd 文档页面查看
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  tapd文档查看页面优化目录显示
// @match        https://www.tapd.cn/59941941/documents/show/*
// @icon         https://www.google.com/s2/favicons?domain=tapd.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427533/Tapd%20%E6%96%87%E6%A1%A3%E9%A1%B5%E9%9D%A2%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427533/Tapd%20%E6%96%87%E6%A1%A3%E9%A1%B5%E9%9D%A2%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 加载样式

    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode(`.wiki-toc{

    font-size: 14px;
    }

    .wiki-toc .category{
    display:none}
    .wiki-toc .content div div {
    padding:6px 0;

    }
    .wiki-toc .content div div:hover{
    background-color:#f5f2f2}
    `);

    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);

    console.log('init')
    $('#toggleCategory').click();
    $('.detail-tab-ul').prepend('<li class="detail-tab-li" id="li-wiki-toc"><a rel="wiki-toc-tpl">目录</a></li>')

    var doc = $('.wiki-toc').clone()
    $('.wiki-toc').hide()
    var script=$('<script id="wiki-toc-tpl" type="text/html">这是目录<\/script>');

    $('body').append(script);
    $('#li-wiki-toc').on('click',function(){
         $("#detail-content").html(doc)
    })


        setTimeout(function(){
        $('#li-wiki-toc').click();
         $('.fd-comments').hide()
        })



})();