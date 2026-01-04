// ==UserScript==
// @name         Ratio likes for Youtube (Replacing disabled dislikes)
// @name:ru      Рейтинг лайков для Youtube (Замена отключенных дизлайков)
// @namespace    Ratio likes for Youtube (Replacing disabled dislikes)
// @version      0.2
// @description  The extension shows the ratio of likes to views. Replacing disabled dislikes.
// @description:ru      Данное расширение показывает соотношение лайков к просмотрам. Это позволяет понять, насколько пользователи одобряют видео. Замена закрытых дизлайков
// @author       Artiom Vasilenko
// @namespace    artiomvasilenko@yandex.ru
// @match        https://www.youtube.com/*
// @icon         https://avatanplus.com/files/resources/original/56be426a8454f152d733702e.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438603/Ratio%20likes%20for%20Youtube%20%28Replacing%20disabled%20dislikes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/438603/Ratio%20likes%20for%20Youtube%20%28Replacing%20disabled%20dislikes%29.meta.js
// ==/UserScript==
(function() {
	let currentUrl = document.location.href;
    function startScript() {
	var watches = document.querySelector('.ytd-video-view-count-renderer').textContent;
	if (watches.indexOf('одобряемость') !== -1) {
		watches = watches.slice(0, watches.indexOf('одобряемость') - 3);
	}
	var watchesNum = '';
	for (var index in watches) {
        if (watches[index] == '0') {
           watchesNum += '0';
        }
		if (parseInt(watches[index])) {
			watchesNum += watches[index];
		}
	}
	watchesNum = parseInt(watchesNum);
	var likes = document.querySelectorAll('.ytd-toggle-button-renderer');
	likes = likes[3].getAttribute('aria-label');
	var likesNum = '';
	for (index in likes) {
        if (likes[index] == '0') {
           likesNum += '0';
        }
		if (parseInt(likes[index])) {
			likesNum += likes[index];
		}
	}
	likesNum = parseInt(likesNum);
	var result = 'одобряемость: ' + Math.round(likesNum / watchesNum * 100) + '%';
	var textContent = document.querySelector('.ytd-video-view-count-renderer').textContent;
	var target = document.querySelector('.ytd-video-view-count-renderer');
	if (textContent.indexOf('одобряемость') !== -1) {
		textContent = textContent.slice(0, textContent.indexOf('одобряемость') - 3);
	}
	target.innerHTML = textContent + ' - ' + result;
}
	function isYoutube() {
	  return location.hostname == "www.youtube.com";
	}
	function init() {
		setTimeout(function() {
			if ( isYoutube() ) {
				startScript();
			}
		}, 3000);
	}
	function locationChange() {
		  const observer = new MutationObserver(mutations => {
			  mutations.forEach(() => {
					if (currentUrl !== document.location.href) {
					   currentUrl = document.location.href;
					   init();
				   }
			   });
			});
			const target = document.querySelector("body");
			const config = { childList: true, subtree: true };
			observer.observe(target, config);
		}
	init();
	locationChange();
})();