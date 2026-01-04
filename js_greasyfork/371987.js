// ==UserScript==
// @name         屏蔽LeetCode切换地区提示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  屏蔽LeetCode切换地区提示.
// @author       isaac young
// @match        https://leetcode.com/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/371987/%E5%B1%8F%E8%94%BDLeetCode%E5%88%87%E6%8D%A2%E5%9C%B0%E5%8C%BA%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/371987/%E5%B1%8F%E8%94%BDLeetCode%E5%88%87%E6%8D%A2%E5%9C%B0%E5%8C%BA%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var s = document.createElement('style');
    s.innerHTML = '#cn-banner {display: none!important;}';
    document.querySelector('head').appendChild(s);
    // Your code here...
})();