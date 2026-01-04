// ==UserScript==
// @name         Bangumi Pull Up Alternative Titles
// @namespace    https://greasyfork.org/users/193469
// @description  Move alternative titles just below the Chinese title
// @version      1.2
// @author       Rui LIU (@liurui39660)
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @match        https://chii.in/subject/*
// @icon         https://icons.duckduckgo.com/ip2/bgm.tv.ico
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/471381/Bangumi%20Pull%20Up%20Alternative%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/471381/Bangumi%20Pull%20Up%20Alternative%20Titles.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const nodeInfobox = document.getElementById('infobox');
	let indexInsert = Number(nodeInfobox.children[0].textContent.startsWith('中文名:'));
	for (const li of nodeInfobox.children)
		if (li.textContent.trim().startsWith('别名:'))
			nodeInfobox.insertBefore(li, nodeInfobox.children[indexInsert++]);
})();
