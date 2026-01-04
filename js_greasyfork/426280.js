// ==UserScript==
// @name         LeetCode-cn竞赛页面跳转
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  从竞赛页面跳转至问题页面
// @author       Weng
// @match        https://leetcode-cn.com/contest/*/problems/*/
// @icon         https://www.google.com/s2/favicons?domain=leetcode-cn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426280/LeetCode-cn%E7%AB%9E%E8%B5%9B%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/426280/LeetCode-cn%E7%AB%9E%E8%B5%9B%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    var href = location.href.replace(/contest\/.*problems\//, "problems/")
    var btn = `<a class="btn btn-success" href="${href}"> 跳转问题页面</a>`
    document.querySelector('.btn-default').insertAdjacentHTML('afterend', btn)
})();
