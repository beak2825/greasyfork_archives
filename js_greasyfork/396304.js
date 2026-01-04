// ==UserScript==
// @name         屏蔽LeetCode切换地区提示 update:2020-02-11
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  屏蔽LeetCode切换地区提示.
// @author       lushan
// @match        https://leetcode.com/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/396304/%E5%B1%8F%E8%94%BDLeetCode%E5%88%87%E6%8D%A2%E5%9C%B0%E5%8C%BA%E6%8F%90%E7%A4%BA%20update%3A2020-02-11.user.js
// @updateURL https://update.greasyfork.org/scripts/396304/%E5%B1%8F%E8%94%BDLeetCode%E5%88%87%E6%8D%A2%E5%9C%B0%E5%8C%BA%E6%8F%90%E7%A4%BA%20update%3A2020-02-11.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var s = document.createElement('style');
    s.innerHTML = '#CNbanner {display: none!important;}';
    document.querySelector('head').appendChild(s);
    // Your code here...
})();