// ==UserScript==
// @name        MobyGames screenshot carousel
// @version     1.0
// @description Browse screenshots without browser history entries
// @author      raina
// @license     GPLv3
// @namespace   raina
// @match       https://www.mobygames.com/game/*/*/screenshots/gameShotId,*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/442664/MobyGames%20screenshot%20carousel.user.js
// @updateURL https://update.greasyfork.org/scripts/442664/MobyGames%20screenshot%20carousel.meta.js
// ==/UserScript==
(function() {

	const wrapper = document.getElementById(`wrapper`);
	let prev, next;


	const flipPage = function(ev) {

		let href = ev.currentTarget.href;

		if (ev.shiftKey || ev.ctrlKey) return true;

		ev.preventDefault();

		if (/#$/.test(href)) return false;

		fetch(href)
		.then(response => response.text())
		.then(content => {

			history.replaceState({}, ``, href);
			content = content.replace(/.*<div id="wrapper"[^\n]*>/s, ``).replace(/<\/div>\s*<div id="footer.*/s, ``);
			wrapper.innerHTML = content;
			rigClicks();

		});
	};


	const rigClicks = function() {

		prev = document.querySelector(`li.previous a`);
		next = document.querySelector(`li.next a`);

		[prev, next].forEach(butt => butt.addEventListener("click", flipPage));

	};


	rigClicks();

	addEventListener("keyup", ev => {

		if ("ArrowLeft" != ev.key && "ArrowRight" != ev.key) return true;

		let click = new MouseEvent("click", {button: 0, cancelable: true});

		if ("ArrowLeft" == ev.key) prev.dispatchEvent(click);
		else next.dispatchEvent(click);

	});

}());
