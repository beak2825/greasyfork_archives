// ==UserScript==
// @name        VK Ads Buster
// @description Скрипт для удаления рекламы ВКонтакте
// @namespace   *.vk.com
// @include     *vk.com/*
// @version     1.1
// @license     MIT
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35675/VK%20Ads%20Buster.user.js
// @updateURL https://update.greasyfork.org/scripts/35675/VK%20Ads%20Buster.meta.js
// ==/UserScript==

//VK built-in way to disable ads
unsafeWindow.noAdsAtAll = true;
//If built-in method won't work
window.addEventListener('beforescriptexecute', function(e) {

	src = e.target.src;
	if (src.search(/aes_light\.js/) != -1) {
		e.preventDefault();
		e.stopPropagation();
	};
}, true);