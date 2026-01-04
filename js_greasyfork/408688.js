// ==UserScript==
// @name         移除百家号搜索结果
// @namespace    https://greasyfork.org/zh-CN/scripts/408688/
// @icon         https://www.baidu.com/favicon.ico
// @version      0.2
// @license      MIT
// @description  移除搜索之后，放在最前面的百家号结果
// @author       prayjourney
// @match        https://www.baidu.com/*
// @grant        none
// @supportURL   https://gitee.com/zuiguangyin123/bilibili-doc/blob/master/myscript/remove-bjh.js
// @homepageURL  https://gitee.com/zuiguangyin123/bilibili-doc/blob/master/myscript/remove-bjh.js
// @downloadURL https://update.greasyfork.org/scripts/408688/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/408688/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    // big
    var big = document.getElementsByClassName('result-op c-container c-group c-group-top xpath-log')
    for(let i =0; i< big.length; i++){
        big[i].style.cssText="display:none";
    }

    // middle
    var midddle = document.getElementsByClassName('result-op c-container c-group c-group-middle xpath-log')
    for(let i =0; i< midddle.length; i++){
        midddle[i].style.cssText="display:none";
    }

    // middle
    var bottom = document.getElementsByClassName('result-op c-container c-group c-group-bottom xpath-log')
    for(let i =0; i< midddle.length; i++){
        bottom[i].style.cssText="display:none";
    }

    var louwangzhiyu = document.getElementsByClassName('c-row')
    var legt = louwangzhiyu.length;
    for(let i =0; i< legt; i++){
        louwangzhiyu[i].style.cssText="display:none";
    }
})();