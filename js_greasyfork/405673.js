// ==UserScript==
// @name         最好的知乎！
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  问题界面:✂去边栏📏宽屏
// @author       hapioooo
// @match        https://www.zhihu.com/question/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/405673/%E6%9C%80%E5%A5%BD%E7%9A%84%E7%9F%A5%E4%B9%8E%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/405673/%E6%9C%80%E5%A5%BD%E7%9A%84%E7%9F%A5%E4%B9%8E%EF%BC%81.meta.js
// ==/UserScript==

// Question-sideColumn 
GM_addStyle('.Question-sideColumn{display: none}')
// Question-mainColumn
GM_addStyle('.Question-mainColumn{width: 1000px}')

(function() {
    'use strict';
    //创建元素
    function createEle(eleName, text, attrs){
        let ele = document.createElement(eleName);
        ele.innerText = text;
        for (let k in attrs) {
            ele.setAttribute(k, attrs[k]);
        }
        return ele;
    }



    // Your code here...
})();