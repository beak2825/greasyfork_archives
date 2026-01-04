// ==UserScript==
// @name               kill devtools-detector
// @version            0.1
// @description        禁用 devtools-detector
// @author             You
// @match              *
// @icon               none
// @grant              none
// @run-at             document-start
// @namespace https://greasyfork.org/users/409103
// @downloadURL https://update.greasyfork.org/scripts/517786/kill%20devtools-detector.user.js
// @updateURL https://update.greasyfork.org/scripts/517786/kill%20devtools-detector.meta.js
// ==/UserScript==

(function __MAIN__() {
    'use strict';

	const LOG_KAWAII_HIKARI = true;
	const TEXT_HIKARI = ['%cdevtools-detector has been disabled', 'color: green;'];
	const HIKARI_CODE = 'https://greasyfork.org/scripts/456001/code/script.js';
	const launchHikari = function() {
		if (LOG_KAWAII_HIKARI) {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', HIKARI_CODE);
			xhr.onerror = logTextHikari;
			xhr.onload = function() {
				try {
					const code = xhr.responseText + '\nconsole.log.apply(console, KAWAII_HIKARI)';
					const func = new Function(code);
					func();
				} catch(err) {
					logTextHikari();
				}
			}
			xhr.send();
		} else {
			logTextHikari();
		}

		function logTextHikari() {
			console.log.apply(console, TEXT_HIKARI);
		}
	}
	disable_launch(launchHikari);

	function disable_launch(alt) {
		console.log('kill devtools-detector...');

		let map = new Map();
		const func = function() {
			delete Object.prototype.launch;
			Object.getPrototypeOf(this).launch = alt;
			this.launch();
		};
		Object.defineProperty(Object.prototype, 'launch', {
			set: function(f) {
				const checked = funcChecked(f);
				map.set(this, checked ? func : f);
				return true;
			},
			get: function() {
				return getVal(this);

				function getVal(obj) {
					return obj ? (map.has(obj) ? map.get(obj) : getVal(Object.getPrototypeOf(obj))) : undefined;
				}
			},
			configurable: true,
			enumerable: false
		});

		function funcChecked(f) {
			if (f && typeof f.toString === 'function') {
				const str = f.toString();
				if (typeof str === 'string' && str.includes('_detectLoopDelay')) {
					return true;
				}
			}
			return false;
		}
	}
})();