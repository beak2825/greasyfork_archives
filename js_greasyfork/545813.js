// ==UserScript==
// @name         移除百度首页滚动条
// @license      MIT
// @namespace    surwall07@gmail.com
// @version      1.0
// @description  清除首页滚动条
// @author       Marcus Xu
// @match        *://www.baidu.com/
// @match        *://www.baidu.com/?tn=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        window.onurlchange

// @downloadURL https://update.greasyfork.org/scripts/545813/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/545813/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let scrollbarRemoved = false

    // 是否是首页
    if (location.pathname === '/') {
        // 去除首页滚动条
        document.getElementsByTagName('html')[0].style = "overflow:hidden";
        scrollbarRemoved = true
    }


    window.onurlchange = function () {
        if (location.pathname !== '/' && scrollbarRemoved) {
            document.getElementsByTagName('html')[0].style = "";
            scrollbarRemoved = false
        }
    }
    
})();