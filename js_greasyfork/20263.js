// ==UserScript==
// @name        amazon-sponsored
// @namespace   jimbo1qaz
// @description Remove "sponsored results" on Amazon.
// @include     *.amazon.com/*
// @version     1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/20263/amazon-sponsored.user.js
// @updateURL https://update.greasyfork.org/scripts/20263/amazon-sponsored.meta.js
// ==/UserScript==
// @run-at      document-start
// @run-at      document-end
// @run-at      document-idle

{
	let arr = document.getElementsByClassName('s-result-item');
	let i = 0;
	while (i < arr.length){
		let el = arr[i];
		let sponsored = el.getElementsByClassName('s-sponsored-list-header');

		if (sponsored.length !== 0) {
			el.parentElement.removeChild(el);
		} else {
			i++;
		}
	}
	console.log(arr.length);
}