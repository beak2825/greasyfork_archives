// ==UserScript==
// @name         慕课网手记页面优化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  文章展示界面加宽
// @author       xiaozhu
// @match        http://www.imooc.com/article/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421039/%E6%85%95%E8%AF%BE%E7%BD%91%E6%89%8B%E8%AE%B0%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/421039/%E6%85%95%E8%AF%BE%E7%BD%91%E6%89%8B%E8%AE%B0%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //页面宽度增加到1200px
    document.querySelector('.main_con').style.width='1200px';
    //文章宽度增加到900px
    document.querySelector('.left_essay').style.width='900px';
    //左侧栏位置左移
    document.querySelector('.active-box').style.left='40%';

    

})();