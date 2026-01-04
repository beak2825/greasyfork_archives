// ==UserScript==
// @name         洛谷题目难度修改器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让您做的每一道洛谷题目都是黑题
// @author       Ren Baoshuo <i@baoshuo.ren>
// @match        *://www.luogu.com.cn/problem/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417795/%E6%B4%9B%E8%B0%B7%E9%A2%98%E7%9B%AE%E9%9A%BE%E5%BA%A6%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/417795/%E6%B4%9B%E8%B0%B7%E9%A2%98%E7%9B%AE%E9%9A%BE%E5%BA%A6%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

window._feInjection.currentData.problem.difficulty = 7;
