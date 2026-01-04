// ==UserScript==
// @name         去除知乎最上方标题栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除知乎最上方标题栏，右边的侧边栏，设置正文宽度为显示宽度的2/3
// @author       zerozz
// @match        https://www.zhihu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419277/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E6%9C%80%E4%B8%8A%E6%96%B9%E6%A0%87%E9%A2%98%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/419277/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E6%9C%80%E4%B8%8A%E6%96%B9%E6%A0%87%E9%A2%98%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function() {
        document.getElementsByClassName("PageHeader")[0] ? document.getElementsByClassName("PageHeader")[0].remove() : null;
        document.getElementsByClassName("AppHeader-inner")[0] ? document.getElementsByClassName("AppHeader-inner")[0].remove() : null;
        document.getElementsByClassName("Question-sideColumn")[0] ? document.getElementsByClassName("Question-sideColumn")[0].remove() : null;
        let stickyArr = document.getElementsByClassName("Sticky") || [];
        let stickySize = stickyArr.length;
        for (let i = 0; i < stickySize; i++) {
           stickyArr[i] ? stickyArr[i].remove() : null;
        }

        setTimeout(function() {
			document.getElementsByClassName("Question-sideColumn")[0] ? document.getElementsByClassName("Question-sideColumn")[0].remove() : null;
			if (!document.getElementsByClassName("Question-sideColumn")[0]) {
				if (document.getElementsByClassName("QuestionAnswers-answers")[0]) {
					document.getElementsByClassName("QuestionAnswers-answers")[0].style.width = document.body.clientWidth / 3 * 2 + 'px';
				} else if (document.getElementsByClassName("Question-mainColumn")[0]) {
					document.getElementsByClassName("Question-mainColumn")[0].style.width = document.body.clientWidth / 3 * 2 + 'px';
				}
			}
        }, 500);
    }, 500);
})();