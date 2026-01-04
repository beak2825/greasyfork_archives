// ==UserScript==
// @name        pocketSelectAll
// @namespace   Violentmonkey Scripts
// @match       https://app.getpocket.com/*
// @grant       none
// @version     1.2
// @author      AdrianSkar
// @description 9/Oct/2020
// @downloadURL https://update.greasyfork.org/scripts/412592/pocketSelectAll.user.js
// @updateURL https://update.greasyfork.org/scripts/412592/pocketSelectAll.meta.js
// ==/UserScript==

(function () {
	setTimeout(() => {// Pocket loads content (including buttons) asynchronously
		let listen = document.querySelector("button[aria-label='Bulk Edit']");

		function buttons() {

			setTimeout(() => {// Pocket loads content (including buttons) asynchronously
				let selectVis = function () {
					function eventFire(el) {
						let evt = new MouseEvent("click", {
							view: window,
							bubbles: true,
							cancelable: true,
						});
						el.dispatchEvent(evt);
					}
					//svg
					let target = document.getElementsByTagName("use");

					//loop trough <use> elements (some are not articles)
					for (let i = 0; i < target.length; i++) {
						// check if targets are selectable articles
						if ((target[i].getAttribute('xlink:href').indexOf("CheckOpen") > -1)) {
							//click on them
							eventFire(target[i]);
						}
						else {
							// console.log(target[i], 'is not clickable'); 
						}
					}

				};
				// console.log(' close bulk');

				//prepend buttons before the close bulk edit one
				//prepend buttons before the close bulk edit one
				let responsiveX = document.querySelector('[*|href*="CloseX"]'); // X button on responsive 

				let bulk = document.querySelector("button[aria-label='Close Bulk Edit']");
				let selVis = bulk.cloneNode();
				let selAll = bulk.cloneNode();

				selVis.textContent = 'Select visible';
				selAll.textContent = 'Select all';

				//load styles depending on responsive or desktop version
				if (responsiveX) {
					let styleRes = 'margin-right: 0.5em; min-width: 4em; font-size: 0.8em; border: 1px solid lightgray; border-radius: 4px;';
					selVis.setAttribute('style', styleRes);
					selAll.setAttribute('style', styleRes);
				} else {
					let styleDes = 'margin-right: 0.5em;';
					selVis.setAttribute('style', styleDes);
					selAll.setAttribute('style', styleDes);
				}
				bulk.parentElement.prepend(selVis);
				bulk.parentElement.prepend(selAll);

				// select all articles (selectVis + scroll every 2secs)
				let selectAll = function () {
					let target = document.getElementsByTagName("use"),
						last = target[target.length - 1];

					function scrollEnd() {
						if (last.getAttribute('xlink:href').indexOf("CheckOpen") === -1) {
							selAll.textContent = 'Selected';
							// console.log('done');
							clearInterval(timer);
							selectVis();
						}
						else {
							selectVis();
							last.scrollIntoView();
							selAll.textContent = 'working...';
							console.log('scrolling');
						}
					}
					let timer = setInterval(() => {
						target = document.getElementsByTagName("use");
						last = target[target.length - 1];
						scrollEnd();
					}, 2000);
				};

				selVis.addEventListener('click', selectVis);
				selAll.addEventListener('click', selectAll);
			}, 100);
		}
		if (Boolean(listen)) {
			console.log('listen');
			listen.addEventListener('click', buttons);
		}
		else {
			console.log('no listen');
		}
	}, 2000);
})();
