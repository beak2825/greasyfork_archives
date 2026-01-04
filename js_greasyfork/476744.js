// ==UserScript==
// @name         BgmBlockNSFWInLists
// @namespace    https://jirehlov.com
// @version      0.1.2
// @description  block nsfw results in lists in bangumi.tv
// @author       Jirehlov
// @include      /^https?://(bangumi\.tv|bgm\.tv|chii\.in)/(.+?/list|.+?/tag|.+?/browser|subject_search|index)(/|\?).+$/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476744/BgmBlockNSFWInLists.user.js
// @updateURL https://update.greasyfork.org/scripts/476744/BgmBlockNSFWInLists.meta.js
// ==/UserScript==

(function () {
	const browserItemList = document.querySelector('ul#browserItemList');
	if (browserItemList) {
		const liElements = browserItemList.querySelectorAll('li');
		liElements.forEach(li => {
			li.style.display = 'none';
		});
		async function checkAndRemoveLi(li) {
			const idValue = li.getAttribute('id');
			if (idValue) {
				const match = idValue.match(/_(\w+)$/);
				if (match) {
					const subjectid = match[1];
					const response = await fetch(`/subject/${subjectid}`, { credentials: 'omit' });
					const text = await response.text();
					if (!text.includes('<h2>呜咕\uFF0C出错了</h2>')) {
						li.style.display = 'block';
					}
				}
			}
		}
		liElements.forEach(li => {
			checkAndRemoveLi(li);
		});
	}
}());