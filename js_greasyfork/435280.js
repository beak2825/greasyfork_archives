// ==UserScript==
// @name         csdn暴力美化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去除所有与文章无关的信息
// @author       wanghaozhe
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435280/csdn%E6%9A%B4%E5%8A%9B%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/435280/csdn%E6%9A%B4%E5%8A%9B%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var body = document.getElementsByTagName('body')[0]
    var style = document.createElement('style')
    var css = `
#articleSearchTip{
display: none !important;
}
.hljs-button{
display: none !important;
}
.passport-login-container{
display: none !important;
}
code,ol{
user-select: text !important;
}
#csdn-toolbar{
display: none !important;
}
.csdn-side-toolbar{
display: none !important;
}
.article-info-box{
display: none !important;
}
.left-toolbox{
display: none !important;
}
.column-group{
display: none !important;
}
#rightAside{
display: none !important;
}
.recommend-box{
display: none !important;
}
.template-box{
display: none !important;
}
.blog-footer-bottom{
display: none !important;
}
body{
background-color: black;
background-image: none;
}
.blog_container_aside{
display: none !important;
}
#mainBox{
width: 100%;
display: flex;
justify-content: center;
}
main{
width: 80%;
}
    `
    var innerStyle = document.createTextNode(css)
    style.appendChild(innerStyle)
    document.head.appendChild(style)
    // 禁止弹窗
    window.alert = function() {
        return false;
    }
})();