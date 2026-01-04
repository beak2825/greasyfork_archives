// ==UserScript==
// @name         Uoj submissions viewer
// @namespace    Perfect-Izayoi-Sakuya
// @version      0.2
// @description  在 Uoj 题目界面显示一个通往该题目提交记录的按钮
// @author       LaoMang
// @license      MIT
// @match        https://uoj.ac/problem/*
// @icon         https://uoj.ac/pictures/UOJ_small.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454849/Uoj%20submissions%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/454849/Uoj%20submissions%20viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let t = document.querySelector('span.pull-right')
    let ele = t.childNodes[1].cloneNode()
    ele.innerHTML = '<span class="glyphicon glyphicon-upload"></span>\n提交记录'
    ele.href = '//uoj.ac/submissions?problem_id=' + window.location.href.split('/').slice(-1)
    t.insertBefore(ele, t.childNodes[0])
})();