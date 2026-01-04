// ==UserScript==
// @name         洛谷隐藏难度脚本
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  再也不用为难度而发愁了
// @author       Ew_Cors <1474284405@qq.com>
// @match        *://www.luogu.com.cn/problem/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443812/%E6%B4%9B%E8%B0%B7%E9%9A%90%E8%97%8F%E9%9A%BE%E5%BA%A6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/443812/%E6%B4%9B%E8%B0%B7%E9%9A%90%E8%97%8F%E9%9A%BE%E5%BA%A6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

window._feInjection.currentData.problem.difficulty = 0;