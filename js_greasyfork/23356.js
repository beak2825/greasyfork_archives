// ==UserScript==
// @name		tiebaSortById
// @namespace	https://github.com/sakuyaa/gm_scripts
// @author		sakuyaa
// @description	百度贴吧按发帖时间（帖子ID）排序
// @include		http*://tieba.baidu.com/f*
// @version		2017.10.8
// @grant		none
// @run-at		document-start
// @downloadURL https://update.greasyfork.org/scripts/23356/tiebaSortById.user.js
// @updateURL https://update.greasyfork.org/scripts/23356/tiebaSortById.meta.js
// ==/UserScript==
(function() {
	function sortById() {
		var parentNode = document.getElementById('thread_list');
		var threads = parentNode.querySelectorAll('.j_thread_list:not(.thread_top)');
		var threadArray = [];
		for (var thread of threads) {
			try {
				threadArray.push({
					id: JSON.parse(thread.getAttribute('data-field')).id,
					thread: thread
				});
				parentNode.removeChild(thread);
			} catch (e) {
				console.log(e);
			}
		}
		threadArray.sort((a, b) => {
			return b.id - a.id;
		});
		for (var thread of threadArray) {
			parentNode.appendChild(thread.thread);
		}
	}
	
	var code = setInterval(() => {
		var node = document.getElementsByClassName('card_infoNum');
		if (node.length) {
			clearInterval(code);
			var a = document.createElement('a');
			a.textContent = '按发帖时间排序';
			a.setAttribute('href', 'javascript:;');
			a.addEventListener('click', e => {
				sortById();
			}, false);
			node[0].parentNode.appendChild(a);
		}
	}, 500);
})();
