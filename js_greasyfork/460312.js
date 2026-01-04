// ==UserScript==
// @name         学习通选中复制
// @namespace    dingshuai
// @version      1.3
// @description  学习通题目可以选中复制，便于搜索题目
// @author       dingshuai
// @match        https://mooc1.chaoxing.com/exam-ans/*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @github       https://github.com/prgding/myUserScripts
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460312/%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/460312/%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

onload = function (){
	document.querySelector("head > link:nth-child(10)").remove();
}