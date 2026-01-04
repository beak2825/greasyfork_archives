// ==UserScript==
// @name         Codeforces to Luogu
// @namespace    Perfect-Izayoi-Sakuya
// @version      0.4
// @description  在 CF 题目界面显示两个通往洛谷该题目的题面 / 题解的按钮
// @author       LaoMang
// @license      MIT
// @match        https://codeforces.com/problemset/problem/*
// @match        https://codeforces.com/contest/*/problem/*
// @icon         https://codeforces.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462698/Codeforces%20to%20Luogu.user.js
// @updateURL https://update.greasyfork.org/scripts/462698/Codeforces%20to%20Luogu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let hrf = window.location.href.split('/')
    let idx = 'CF' + hrf[4 + (hrf[3] == 'problemset')] + hrf[6]
    let lst = document.querySelector('ul.second-level-menu-list')
    let node1 = document.createElement('li'), node2 = document.createElement('li')
    node1.innerHTML = '<a href="https://www.luogu.com.cn/problem/' + idx + '">Luogu statement</a>'
    node2.innerHTML = '<a href="https://www.luogu.com.cn/problem/solution/' + idx + '">Luogu solution</a>'
    lst.appendChild(node1)
    lst.appendChild(node2)
})();