/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               反 devtools-detector 反调试
// @name:zh-CN         反 devtools-detector 反调试
// @name:en            Anti devtools-detector
// @namespace          Anti-devtools-detector
// @version            0.1
// @description        麻麻再也不怕 https://github.com/AEPKILL/devtools-detector 不让我调试啦！
// @description:zh-CN  麻麻再也不怕 https://github.com/AEPKILL/devtools-detector 不让我调试啦！
// @description:en     Anti https://github.com/AEPKILL/devtools-detector
// @author             PY-DNG
// @license            GPL-v3
// @match              http*://blog.aepkill.com/demos/devtools-detector/*
// @icon               none
// @grant              none
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/456011/%E5%8F%8D%20devtools-detector%20%E5%8F%8D%E8%B0%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/456011/%E5%8F%8D%20devtools-detector%20%E5%8F%8D%E8%B0%83%E8%AF%95.meta.js
// ==/UserScript==

(function __MAIN__() {
    'use strict';

	const LOG_KAWAII_HIKARI = true;
	const TEXT_HIKARI = ['%cdevtools-detector has been disabled', 'color: green;'] //'嘿嘿嘿，hikari，嘿嘿嘿…';
	const HIKARI_CODE = 'https://greasyfork.org/scripts/456001/code/script.js';
	const launchHikari = function() {
		if (LOG_KAWAII_HIKARI) {
			// Draw an cute image of hikari in the console when devtools-detector attempting to launch
			// Use xhr instead of @require / @resource / in-script-code aims to speed up
			// userscript loading, make disable_launch as fast as possible
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
			// Or, just log some text
			logTextHikari();
		}

		function logTextHikari() {
			console.log.apply(console, TEXT_HIKARI);
		}
	}
	disable_launch(launchHikari);

	// Disable devtools-detector by hooking devtoolsDetector.launch
	function disable_launch(alt) {
		console.log('disabling launch');

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