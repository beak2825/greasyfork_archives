// ==UserScript==
// @name         去除多余book内容
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除内容页顶部栏
// @author       fengsy
// @match        *://www.dhzw.org/book/0/539/*
// @match        *://www.bequgew.com/102965/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386276/%E5%8E%BB%E9%99%A4%E5%A4%9A%E4%BD%99book%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/386276/%E5%8E%BB%E9%99%A4%E5%A4%9A%E4%BD%99book%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    let css = '.ywtop{display:none !important;height:0 !important}';
    css+= '.header{display:none !important;height:0 !important}';
    css+= '.nav{display:none !important;height:0 !important}'
    css+= '.path{display:none !important;height:0 !important}'
    css+= '.link{display:none !important;height:0 !important}'
    //非笔趣阁
    css+= '.clearall{display:none !important;height:0 !important}'
    css+= '.xdh{display:none !important;height:0 !important}'
    css+= '.breadCrumb{display:none !important;height:0 !important}'
    css+= '.fenxiang{display:none !important;height:0 !important}'

//脚
    css+= '.page_chapter{display:none !important;height:0 !important}'
    css+= '.footer{display:none !important;height:0 !important}'
    css+= '#center{display:none !important;height:0 !important}'
    //非笔趣阁
    css+= '.book_content_text_nextw{display:none !important;height:0 !important}'

//背景
    css+= '#wrapper{background-color: #ffffff !important;}'
    css+= '#content{font-size: 16px !important;}'
    //非笔趣阁
    css+= '.book_content_text{background-color: #ffffff !important;}'
    css+= '.body{background: #ffffff !important;}'
    css+= '#book_text{font-size: 16px !important;font-family:"Microsoft YaHei" !important;padding:0px !important; font-weight: 400 !important; color: #333 !important;}'


    //----------------------------------------------------
    loadStyle(css);

    function loadStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(css));
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
        document.title = 'bk';
        document.body.style.backgroundColor="#ffffff";
    }

})();