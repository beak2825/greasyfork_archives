// ==UserScript==
// @name         洛谷顶栏添加其他链接
// @description  洛谷顶栏添加其他链接，可自定义
// @namespace    https://greasyfork.org/zh-CN/users/772347
// @version      1.2
// @author       WYXkk
// @match        https://www.luogu.com.cn/
// @match        https://www.luogu.com.cn/chat*
// @match        https://www.luogu.com.cn/notification*
// @match        https://www.luogu.com.cn/user/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446615/%E6%B4%9B%E8%B0%B7%E9%A1%B6%E6%A0%8F%E6%B7%BB%E5%8A%A0%E5%85%B6%E4%BB%96%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/446615/%E6%B4%9B%E8%B0%B7%E9%A1%B6%E6%A0%8F%E6%B7%BB%E5%8A%A0%E5%85%B6%E4%BB%96%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    //将网站的链接及文本在下方添加即可，下面只是一个示例
    var x=[
        {link:'https://www.bilibili.com',text:'Bilibili'},
        ];
    function add()
    {
        if(document.querySelectorAll('.link-container')[0]==undefined) setTimeout(function(){add()},50);
        else setTimeout(function(){for(var i in x){
            var a=document.createElement("a");document.querySelectorAll('.link-container')[0].append(a);a.outerHTML=
        '<a href=\"'+x[i].link+'\" target=\"_blank\" colorscheme=\"none\" class=\"header-link color-none\" style="vertical-align: middle;margin-right: 2em;color: #262626;text-decoration: none;">'+x[i].text+'</a>'
        ;}},100);
    }
    add();
})();