// ==UserScript==
// @name         CNBLOGS编辑时间提前
// @namespace    http://cnblogs.com/
// @version      0.3
// @iconURL		 https://www.cnblogs.com/favicon.ico
// @description	 博客园文章编辑时间提前至文章标题右侧，方便查看是否新知识
// @author       Richard He
// @license      MIT
// @match        http*://www.cnblogs.com/*/p/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368542/CNBLOGS%E7%BC%96%E8%BE%91%E6%97%B6%E9%97%B4%E6%8F%90%E5%89%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/368542/CNBLOGS%E7%BC%96%E8%BE%91%E6%97%B6%E9%97%B4%E6%8F%90%E5%89%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

		var d = document;
		var postTitle = d.querySelector('.postTitle')||d.querySelector('.post>h2');
		var postTime = d.querySelector('#post-date');
		var timeSpan = d.createElement('span');
		timeSpan.innerText = postTime.innerText;
		timeSpan.style.float = "right";
		timeSpan.style.color = "#ff5e52";
		timeSpan.style.marginRight = "80px";
		timeSpan.style.fontWeight = "normal";
		postTitle.appendChild(timeSpan);

})();