// ==UserScript==
// @name         autoYesOnEduMirea
// @namespace    http://tampermonkey.net/
// @version      1
// @description  make all marks on mirea edu pages
// @author       https://vk.com/dimamakarov12345
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @match        https://online-edu.mirea.ru/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420006/autoYesOnEduMirea.user.js
// @updateURL https://update.greasyfork.org/scripts/420006/autoYesOnEduMirea.meta.js
// ==/UserScript==
(function () {
	'use strict';
	var pattern = /manual-n/;
	setTimeout(() => {
		let link = document.querySelectorAll('button');
		link = Array.from(link);
		for (let i = 0; i < link.length; i++) {
			const element = link[i];
			if (element.className == "btn btn-link") {
				let child = element.child = element.childNodes;
				child = Array.from(child);
				for (let t = 0; t < child.length; t++) {
					const ch = child[t];
					var exists = pattern.test(ch.src);
					if (exists) {
						element.click();
					}
				}
			}
		}
	}, 1500);
})();