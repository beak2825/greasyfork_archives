// ==UserScript==
// @name         Atcoder to Luogu
// @namespace    Perfect-Izayoi-Sakuya
// @version      0.4
// @description  在 AT 题目界面显示两个通往洛谷该题目的题面 / 题解的按钮
// @author       LaoMang
// @license      MIT
// @match        https://atcoder.jp/contests/*/tasks/*
// @icon         https://atcoder.jp/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454927/Atcoder%20to%20Luogu.user.js
// @updateURL https://update.greasyfork.org/scripts/454927/Atcoder%20to%20Luogu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.split('/').slice(-1) == 'editorial') return
    let t = document.querySelector('span.h2')
    let ele1 = t.childNodes[1].cloneNode(), ele2 = t.childNodes[1].cloneNode()
    ele1.innerHTML = 'Luogu statement'
    ele1.href = '//www.luogu.com.cn/problem/AT_' + window.location.href.split('/').slice(-1)
    ele2.innerHTML = 'Luogu solution'
    ele2.href = '//www.luogu.com.cn/problem/solution/AT_' + window.location.href.split('/').slice(-1)
    t.appendChild(ele1)
    t.innerHTML += '\n'
    t.appendChild(ele2)
})();