// ==UserScript==
// @name         Github1S向左偏移1像素用以右键谷歌翻译
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Github1S向左偏移1像素用以右键谷歌翻译!
// @author       You
// @match        https://github1s.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github1s.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456361/Github1S%E5%90%91%E5%B7%A6%E5%81%8F%E7%A7%BB1%E5%83%8F%E7%B4%A0%E7%94%A8%E4%BB%A5%E5%8F%B3%E9%94%AE%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/456361/Github1S%E5%90%91%E5%B7%A6%E5%81%8F%E7%A7%BB1%E5%83%8F%E7%B4%A0%E7%94%A8%E4%BB%A5%E5%8F%B3%E9%94%AE%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
     function addCSS(cssText) {
        var style = document.createElement('style')
          , //创建一个style元素
        head = document.head || document.getElementsByTagName('head')[0];
        //获取head元素
        style.type = 'text/css';
        //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        if (style.styleSheet) {
            //IE
            var func = function() {
                try {
                    //防止IE中stylesheet数量超过限制而发生错误
                    style.styleSheet.cssText = cssText;
                } catch (e) {
                }
            }
            //如果当前styleSheet还不能用，则放到异步中则行
            if (style.styleSheet.disabled) {
                setTimeout(func, 10);
            } else {
                func();
            }
        } else {
            //w3c
            //w3c浏览器中只要创建文本节点插入到style元素中就行了
            var textNode = document.createTextNode(cssText);
            style.appendChild(textNode);
        }
        head.appendChild(style);
        //把创建的style元素插入到head中
    }

    addCSS(`
    body{
        margin-left: 1px;
    }
    `);
    // Your code here...
})();