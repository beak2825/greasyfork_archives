// ==UserScript==
// @name         豆瓣直达片源网
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在豆瓣电影页面新增一个按钮直达片源网搜索结果
// @author       JSSM
// @match        *://movie.douban.com/subject/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488427/%E8%B1%86%E7%93%A3%E7%9B%B4%E8%BE%BE%E7%89%87%E6%BA%90%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/488427/%E8%B1%86%E7%93%A3%E7%9B%B4%E8%BE%BE%E7%89%87%E6%BA%90%E7%BD%91.meta.js
// ==/UserScript==

(function() {
	'use strict';
	//感谢chatgpt帮我完成100%的代码
	// Find the #info div
	const infoDiv = document.getElementById('info');

	// Get the IMDb ID by looking for a span with class 'pl' followed by a text node containing the ID
	let imdbIdElement = null;
	const plSpans = infoDiv.querySelectorAll('.pl');
	for (let i = 0; i < plSpans.length; i++) {
		const currentSpan = plSpans[i];
		if (currentSpan.textContent.includes('IMDb:')) {
			const nextNode = currentSpan.nextSibling;
			if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
				const imdbIdCandidate = nextNode.textContent.trim();
				if (imdbIdCandidate.startsWith('tt')) {
					imdbIdElement = {
						span: currentSpan,
						idNode: nextNode
					};
					break;
				}
			}
		}
	}

	if (imdbIdElement) {
		const imdbId = imdbIdElement.idNode.textContent.trim();

		// Create the search link
		const searchUrl = 'https://pianyuan.org/search?q=' + encodeURIComponent(imdbId);

		// Create the new span with "片源网:"
		const newLineBreak = document.createElement('br');
		const newSpan = document.createElement('span');
		newSpan.classList.add('pl');
		newSpan.innerText = '片源网: ';

		// Create the clickable link inside the new span
		const newLink = document.createElement('a');
		newLink.href = searchUrl;
		newLink.target = '_blank';
		newLink.rel = 'noopener noreferrer';
		newLink.innerText = '一键跳转';

		// Append the link to the new span
		newSpan.appendChild(newLink);

		// Insert the new span after the IMDb ID text node
		imdbIdElement.span.parentNode.insertBefore(newLineBreak, imdbIdElement.idNode.nextSibling); // Assuming you still want a line break here
		imdbIdElement.span.parentNode.insertBefore(newSpan, newLineBreak.nextSibling);


		// 新的搜索链接和网站名
		const anotherSearchUrl = 'https://therarbg.com/get-posts/?keywords=' + encodeURIComponent(imdbId);
		const anotherSiteName = 'RARBG: ';

		// 创建新的换行符
		const anotherNewLineBreak = document.createElement('br');

		// 创建包含新链接的新span元素
		const anotherNewSpan = document.createElement('span');
		anotherNewSpan.classList.add('pl');
		anotherNewSpan.innerText = anotherSiteName;

		// 创建新的可点击链接
		const anotherNewLink = document.createElement('a');
		anotherNewLink.href = anotherSearchUrl;
		anotherNewLink.target = '_blank';
		anotherNewLink.rel = 'noopener noreferrer';
		anotherNewLink.innerText = '一键跳转';

		// 将新链接添加到新span中
		anotherNewSpan.appendChild(anotherNewLink);

		// 在上一次插入的位置之后再次插入新的换行符和span
		imdbIdElement.span.parentNode.insertBefore(anotherNewLineBreak, newSpan.nextSibling);
		imdbIdElement.span.parentNode.insertBefore(anotherNewSpan, anotherNewLineBreak.nextSibling);
	}

})();