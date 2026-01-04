// ==UserScript==
// @name         红薯中文 替换css防复制文字
// @namespace    http://tampermonkey.net/
// @version      2023.04.11
// @description  文章部分文字符号使用::before伪元素，造成无法直接复制，用这个脚本可以还原
// @author       塞北的雪
// @match        https://g.hongshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hongshu.com
// @grant        unsafeWindow
// @license      MIT
// 脚本分析过程参考 https://www.52pojie.cn/thread-1772187-1-1.html
// @downloadURL https://update.greasyfork.org/scripts/463724/%E7%BA%A2%E8%96%AF%E4%B8%AD%E6%96%87%20%E6%9B%BF%E6%8D%A2css%E9%98%B2%E5%A4%8D%E5%88%B6%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/463724/%E7%BA%A2%E8%96%AF%E4%B8%AD%E6%96%87%20%E6%9B%BF%E6%8D%A2css%E9%98%B2%E5%A4%8D%E5%88%B6%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('开始执行 红薯中文 油猴脚本.');
    var css=unsafeWindow.document.styleSheets[0].cssRules;
    Object.keys(css).forEach(function(k,v){
        var stylename=css[k].selectorText.split('::')[0];
        var content=css[k].style.content.replaceAll('"','');
        unsafeWindow.document.querySelectorAll(stylename).forEach(function(ek,ev){
            ek.replaceWith(content);
        });
    });
    console.log('执行完毕 红薯中文 油猴脚本.');
})();