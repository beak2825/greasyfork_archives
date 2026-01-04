// ==UserScript==
// @name         《Flutter实战》电子书的暗黑模式
// @namespace    courin
// @version      0.1
// @description  更改样式实现《Flutter实战》电子书的暗黑模式，以便夜间阅读
// @author       courin
// @match        *://book.flutterchina.club/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425329/%E3%80%8AFlutter%E5%AE%9E%E6%88%98%E3%80%8B%E7%94%B5%E5%AD%90%E4%B9%A6%E7%9A%84%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/425329/%E3%80%8AFlutter%E5%AE%9E%E6%88%98%E3%80%8B%E7%94%B5%E5%AD%90%E4%B9%A6%E7%9A%84%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
        'use strict';
        var style = '<style>'+
            '::-webkit-scrollbar { width: 12px;} '+ // 滚动条整体
            '::-webkit-scrollbar-thumb { border-radius: 4px; box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); background: #aaa;} '+ //滚动条里面小方块
            '::-webkit-scrollbar-track-piece  { box-shadow: inset 0 0 5px rgba(0,0,0,0.2); background: #333;} '+ //滚动条里面轨道
            '.theme-default-content:not(.custom) { max-width: 900px;} '+ // 右边正文的最大宽度
            'html, body { color: #ccc; background: #090C10;} '+ // 页面背景色
            '.navbar .site-name { color: #ddd} '+ // 左上角的书名
            '.sidebar,.navbar,.links { background: #161B22!important;} '+ //导航栏和侧边栏的链接文字
            '.sidebar { border-right: 1px solid #333;} '+ //侧边栏
            '.navbar { border-bottom: none;} '+  // 导航栏栏
            '.search-box input { background-color:#222!important; border: 1px solid #555;} '+ // 搜索框
            '.nav-links a.router-link-active,.nav-links a:hover { color: #fff;} '+ // 导航栏链接的hover高亮
            'a.sidebar-link { color: #bbb} '+ // 侧边栏目录中的小标题
            '.sidebar-heading { color: #ccc} '+ // 侧边栏目录中的大标题
            '</style>';
        var element=document.createElement('div');
        element.innerHTML=style;
        document.documentElement.appendChild(element.firstElementChild);
})();
