// ==UserScript==
// @name         leetCode过滤器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  LeetCode过滤器，过滤掉问题列表中的锁定的题目
// @author       xuting90@gmail.com
// @match        https://leetcode-cn.com/problemset/all/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383672/leetCode%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/383672/leetCode%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let func = window.onload ;
    window.onload = ()=>{
        func && func();
        let observer = new MutationObserver((a,b)=>{
            Array.from(document.getElementsByTagName("tr"))
                .filter(item=>item.querySelectorAll("td.question-status-column>div>i").length>0)
                .forEach(item=>{console.log(item);item.style.display='none'});
        });
        let tb = document.querySelector(".category-group-base+div")
        let options = {
            'childList': true,
            "subtree":true,
        } ;
        observer.observe(tb, options);
    }
})();