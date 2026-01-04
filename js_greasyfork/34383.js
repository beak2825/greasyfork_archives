// ==UserScript==
// @name         屏蔽赵小姐
// @namespace    https://github.com/ipcjs
// @version      0.0.1
// @description  屏蔽S1里面的赵小姐条目
// @author       ipcjs
// @match        *://bbs.saraba1st.com/2b/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34383/%E5%B1%8F%E8%94%BD%E8%B5%B5%E5%B0%8F%E5%A7%90.user.js
// @updateURL https://update.greasyfork.org/scripts/34383/%E5%B1%8F%E8%94%BD%E8%B5%B5%E5%B0%8F%E5%A7%90.meta.js
// ==/UserScript==

'use strict';
document.querySelectorAll('#threadlist th.common .s.xst').forEach(ele => {
    if (ele.innerText.match('啪啪啪全套多少')) {
        ele.parentElement.parentElement.parentElement.style.display = 'none';
    } else {
		console.log(ele.innerText);
	}
});