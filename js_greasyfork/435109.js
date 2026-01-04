// ==UserScript==
// @name         Remove zhihu video
// @namespace    https://www.Removezhihuvideo.com
// @version      0.4
// @description  Just remove zhihu video
// @author       You
// @match        https://www.zhihu.com/*
// @icon         http://zhihu.com/favicon.ico
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/435109/Remove%20zhihu%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/435109/Remove%20zhihu%20video.meta.js
// ==/UserScript==


let inited = false;

function callback(mutationsList) {

	for (let m of mutationsList) {
		if (m.type == 'childList' && m.addedNodes.length > 0) {

			for (let node of m.addedNodes) {
				//console.log('addnodes:', node);
				if (!inited && node.tagName === 'DIV')
				{
					for (let cnode of node.querySelectorAll('.TopstoryItem')) {
						removeIfVideo(cnode);
					}
					inited = true;
				}
				if (node.tagName === 'DIV' && node.classList.contains('TopstoryItem')) {
					removeIfVideo(node);
				}
			}
		}
	}
}

for (let node of document.querySelectorAll('.TopstoryItem')) {
	removeIfVideo(node);
}


const observer = new MutationObserver(callback);
observer.observe(document.body, {
	childList: true,
	subtree: true
})

function removeIfVideo(node) {
	let n = node.querySelector('.VideoAnswerPlayer');
	if (n) {
		let c = document.createElement('div');
		c.innerHTML = 'removed video';
		n.parentElement.replaceChild(c,n);
	}
}