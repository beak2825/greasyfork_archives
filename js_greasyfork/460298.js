// ==UserScript==
// @name         百度脑图主题修改
// @namespace    https://blog.csdn.net/Fun12306
// @include      *://naotu.baidu.com/file/*
// @version      0.2
// @description  修改了百度脑图的页面样式，粉色不好看！
// @author       supfun
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460298/%E7%99%BE%E5%BA%A6%E8%84%91%E5%9B%BE%E4%B8%BB%E9%A2%98%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/460298/%E7%99%BE%E5%BA%A6%E8%84%91%E5%9B%BE%E4%B8%BB%E9%A2%98%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

// 添加 css 样式
function addStyle() {
    let css = `
   .file-menu{
        background-color: #393f4f
    }
   .file-menu:hover{
       background-color: #272d3c;
   }
    .moreservice{
       background-color: #393f4f;
    }
    .moreservice:hover{
        background-color: #272d3c;
    }
    .main-menu{
    border:none;
    }
    .main-menu .tab-head{
    background-color: #3475ed;
    }
    .main-menu .tab-head li.active{
    background-color: #6a95e5;
    }
    .main-menu .tab-head li:hover{
        background-color: #0559f3;
    }

    .nav-bar{
    background: #52555c;
    }

    `

    GM_addStyle(css)
}


(function() {
    'use strict';
    addStyle()
})();