// ==UserScript==
// @name         Persistent YouTube video queue
// @version      0.3
// @namespace    Violentmonkey Scripts
// @description  Make the YoutTube video queue persistent through sessions
// @author       CarlosMarques
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462336/Persistent%20YouTube%20video%20queue.user.js
// @updateURL https://update.greasyfork.org/scripts/462336/Persistent%20YouTube%20video%20queue.meta.js
// ==/UserScript==


(function(){
	let ytqItems = Object.keys(localStorage).filter(e => e.startsWith("yt-queue"));
	if(ytqItems.length && !Object.keys(window.sessionStorage).some(e => e.startsWith("yt-queue"))){
		for(let yqsi of ytqItems){
			window.sessionStorage.setItem(yqsi, localStorage.getItem(yqsi));
		}
	}

	let mObserver = new MutationObserver(function(mutations){
		let ytqItems = Object.keys(window.sessionStorage).filter(e => e.startsWith("yt-queue"));
		if(!ytqItems.length){
			Object.keys(localStorage).forEach(e => e.startsWith("yt-queue") ? localStorage.removeItem(e) : null);
		}
		else{
			ytqItems.forEach(e => localStorage.setItem(e, window.sessionStorage.getItem(e)));
		}
	})
	mObserver.observe(document.body, {subtree: true, childList: true, characterData: true});
})()
