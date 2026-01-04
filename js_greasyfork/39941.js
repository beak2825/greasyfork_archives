// ==UserScript==
// @name         hide menu for keybr
// @namespace    Nihility
// @version      0.2
// @description  hide menu
// @author       Nihility
// @match        *://www.keybr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39941/hide%20menu%20for%20keybr.user.js
// @updateURL https://update.greasyfork.org/scripts/39941/hide%20menu%20for%20keybr.meta.js
// ==/UserScript==

(function() {
		'use strict';

		var time = setInterval(function () {
				var hide = document.querySelectorAll('.Body-aside, .Body-header, #App > div > div:nth-child(1) > article');
				for (var e of hide)
						e.style.display = 'none';

				if (location.pathname.match("multiplayer")) {
						var track = document.querySelector('.Track');
						if (track) {
								track.parentElement.append(track);
								clearInterval(time);
						}
				} else {
						clearInterval(time);
				}
		}, 100);

		var nav = document.getElementById('Nav');
		var nav_width = nav.offsetWidth;
		nav.style.display = 'none';
		nav.parentElement.onmousemove = function (e) {
				nav_width = nav.offsetWidth || nav_width;
				nav.style.display = nav.parentElement.clientWidth - e.clientX <= nav_width ? '' : 'none';
		};

})();