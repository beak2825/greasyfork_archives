// ==UserScript==
// @name         Manga Block Killer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决漫画屏蔽问题
// @author       RiverWind
// @match        http://tw.ikanman.com/comic/*/*.html
// @match        http://www.omanhua.com/comic/*/*/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28742/Manga%20Block%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/28742/Manga%20Block%20Killer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var blocked = document.querySelector('span.nopic');
	var currPage = parseInt(document.querySelector('span.current').textContent, 10);
	var mangaBox = document.querySelector('#mangaBox');

	if (!blocked) {
		return;
	}

	// remove block tip
	blocked.remove();

	// create img
	var img = document.createElement('img');
	// load current-page's picture
	img.src = pVars.manga.filePath + cInfo.files[currPage - 1];
	mangaBox.appendChild(img);

	// n is always leagal, no checking is ok
	function goPage(n) {
		// change page
		var page = document.querySelector('#page');
		page.textContent = n;
		var img = document.querySelector('#mangaBox img');
		// load img
		var newImg = document.createElement('img');
		newImg.src = pVars.manga.filePath + cInfo.files[n - 1];
		var imgparent = img.parentElement;
		img.remove();
		imgparent.appendChild(newImg);

        scroll(0,0);
		// change pagination
		var pagination = document.querySelector('#pagination');
		pagination.innerHTML = SMH.pager({cp: n - 1,pc: cInfo.len});
		pVars.page = n;
		// change hash
		window.location.hash = 'p=' + n;
		$('#pageSelect').val(n);
	}

	SMH.utils.goPage = goPage;
})();