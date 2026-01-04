// ==UserScript==
// @name         Unsubscribe from all steam curators
// @namespace    https://greasyfork.org/ru/users/237951-attention
// @version      0.6
// @description  Use this script you can unsubcribe easly from all steam curators.
// @author       Attention
// @include      https://store.steampowered.com/curators/mycurators/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/408786/Unsubscribe%20from%20all%20steam%20curators.user.js
// @updateURL https://update.greasyfork.org/scripts/408786/Unsubscribe%20from%20all%20steam%20curators.meta.js
// ==/UserScript==

(function() {
	'use strict';
	try {
		let btn = document.createElement('input');
		btn.id = "btnUnSub"
		btn.type='button';
		btn.value='Unsubscribe';
		btn.onclick = unSub;
		document.body.append(btn);
		btn.setAttribute('style','top:110px;');

		function unSub() {
			let yesNo = confirm('Unsubscribe from all curators?');
			if (yesNo) {
				var allCurators = getCount(); var count = 0;
				for (let cd in gFollowedCuratorIDs) {
					++count;
				}
				count = Math.floor(count / 10);

				for (var i = 0; i < count; i++) {
					setTimeout(function() {
						document.all.footer.scrollIntoView(true);
					}, 1200 * (i));
				}

				allCurators = getCount();
				setTimeout(function() { for (let i = 0; i < allCurators.length; i++) {
					allCurators[i].click();
					process(i);
				}}, (count) * 1500);

				function process(i) {
					setTimeout(function() {
						ShowBlockingWaitDialog('Execution...',`Unsubscribe ${i+1}/${allCurators.length}`);
						if (i+1 == allCurators.length) {
							ShowDialog('Done!',`You have successfully unsubscribed from ${allCurators.length} curators.`);
							location.reload();
							return;
						}
					}, 90 * i);
				}

				function getCount(allCurators) {
					allCurators = document.getElementsByClassName('following_button btn_green_steamui btn_medium');
					return allCurators;
				}
			}
		}

		GM_addStyle ( `
		 #btnUnSub {
			position: absolute;
			right: 10px;
			font-size: 18px;
			background-color: white;
			color:#273d52;
			border: 1px solid green;
			padding:5px;
			cursor: pointer;
			width: 130px;
		 }
		 #btnUnSub:hover {
			background-color: #4CAF50;
			color: white;
		 }
	   ` );
	}
	catch(e) {
		console.error(e)
	}
})();