// ==UserScript==
// @name         Codeforces problemset 题目页面 status 指向当前题目所在比赛的提交记录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make it more easy to view codeforces judging status.
// @author       adfhkjafsdk
// @license      MIT
// @match        https://codeforces.com/problemset/problem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499047/Codeforces%20problemset%20%E9%A2%98%E7%9B%AE%E9%A1%B5%E9%9D%A2%20status%20%E6%8C%87%E5%90%91%E5%BD%93%E5%89%8D%E9%A2%98%E7%9B%AE%E6%89%80%E5%9C%A8%E6%AF%94%E8%B5%9B%E7%9A%84%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/499047/Codeforces%20problemset%20%E9%A2%98%E7%9B%AE%E9%A1%B5%E9%9D%A2%20status%20%E6%8C%87%E5%90%91%E5%BD%93%E5%89%8D%E9%A2%98%E7%9B%AE%E6%89%80%E5%9C%A8%E6%AF%94%E8%B5%9B%E7%9A%84%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let x=location.href.split('/');
    let h="/contest/"+x[5]+"/status/"+x[6]+"?order=BY_ARRIVED_DESC";
    // let h="/contest/"+x[5]+"/status";
    //console.log(h);
    let e=document.querySelector("#pageContent > div.second-level-menu > ul > li:nth-child(3) > a");
    //console.log(e);
    e.href=h;
    // Your code here...
})();