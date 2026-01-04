// ==UserScript==
// @name         网页点亮脚本
// @namespace    https://github.com/q6378561
// @version      0.1
// @description  用于点亮变灰的网页
// @author       乱舞神菜
// @match        *://*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399418/%E7%BD%91%E9%A1%B5%E7%82%B9%E4%BA%AE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/399418/%E7%BD%91%E9%A1%B5%E7%82%B9%E4%BA%AE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload =()=>{
        document.documentElement.style = "filter: grayscale(0);"
    }
    // Your code here...
})();