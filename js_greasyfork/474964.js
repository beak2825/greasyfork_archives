/* eslint-disable no-multi-spaces */
/* eslint-disable no-loop-func */
/* eslint-disable no-return-assign */

// ==UserScript==
// @name               反 devtools-detector 反调试 2
// @name:zh-CN         反 devtools-detector 反调试 2
// @name:en            Anti devtools-detector 2
// @namespace          Anti-devtools-detector 2
// @version            0.2
// @description        麻麻再也不怕 https://github.com/AEPKILL/devtools-detector 不让我调试啦！
// @description:zh-CN  麻麻再也不怕 https://github.com/AEPKILL/devtools-detector 不让我调试啦！
// @description:en     Anti https://github.com/AEPKILL/devtools-detector
// @author             PY-DNG
// @license            GPL-v3
// @match              http*://blog.aepkill.com/demos/devtools-detector/*
// @icon               none
// @grant              none
// @unwrap
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/474964/%E5%8F%8D%20devtools-detector%20%E5%8F%8D%E8%B0%83%E8%AF%95%202.user.js
// @updateURL https://update.greasyfork.org/scripts/474964/%E5%8F%8D%20devtools-detector%20%E5%8F%8D%E8%B0%83%E8%AF%95%202.meta.js
// ==/UserScript==

/* global eruda */

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
	//disable_launch(launchHikari);
	console.log('%cdisabling devtools detector...', 'color: green;');
	disable_checkers();

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

	function disable_checkers() {
		const disablers = [function() {
			// Prevent hooked properties being overwritten
			const defineProperty = Object.defineProperty;
			const defineProperties = Object.defineProperties;
			hookValue(Object, ['defineProperty', 'defineProperties'], function() {
				const args = [...arguments];
				const target = args[0];
				if (args.length === 3) {
					args[1] = { [args[1]]: args[2] };
					delete args[2];
				}

				for (const [prop, desc] of Object.entries(args[1])) {
					if (hookValue.hookedObjs.has(target) && hookValue.hookedObjs.get(target).hasOwnProperty(prop)) {
						return dealDesc(target, prop, desc);
					} else {
						try {
							return defineProperties.apply(this, args);
						} catch(err) {
							console.error(err);
							debugger;
						}
					}
				}

				function dealDesc(obj, prop, desc) {
					if ('value' in desc) {
						// Allow setting value
						console.log('Allowed: setting value', obj, prop, desc);
						hookValue.hookedObjs.get(target)[prop] = desc.value;
					} else {
						// Block setting setter/getter
						// Do nothing
						debugger;
						console.log('Blocked: setting getter/setter', obj, prop, desc);
					}
					return obj;
				}
			});
		}, function() {
			const toString = Date.prototype.toString;
			hookValue(Date.prototype, 'toString');
			hookConsole('log', args => {
				const date = args[0];
				return date instanceof Date;
			});
		}, function() {
			hookValue(RegExp.prototype, 'toString');
			hookConsole('table', args => {
				const obj = args[0];
				return isObject(obj) && Object.keys(obj).every(key => key === 'dep') && obj.dep.toString() === '/ /';
			});
		}, function() {
			hookConsole('log', args => {
				const div = args[0];
				return div instanceof HTMLDivElement && typeof Object.getOwnPropertyDescriptor(div, 'id')?.get === 'function';
			});
		}, function() {
			if (typeof eruda !== 'undefined' && eruda?._devTools?._isShow === true) {
				eruda._devTools._isShow = 1;
			}
		}, function() {
			hookValue(Function.prototype, 'toString');
			hookConsole('log', args => {
				const func = args[0];
				return typeof func === 'function' && /function \w(){}/.test(func.toString());
			});
		}, function() {
			['log', 'table'].forEach(logger => {
				hookConsole(logger, args => {
					const arr = args[0];
					return Array.isArray(arr) && arr.length === 50 && arr.every(obj => isObject(obj) && Object.keys(obj).every(key => obj[key] === key));
				});
			});
		}, function() {
			console.clear = function() {};
		}];

		disablers.forEach(disabler => disabler());

		function hookConsole(logger, checker) {
			const log = console[logger];
			console[logger] = function() {
				if (checker(arguments)) {
					return;
				}
				log.apply(this, arguments);
			}
		}

		function hookValue(obj, props, value) {
			!hookValue.hookedObjs && (hookValue.hookedObjs = new Map());
			!Array.isArray(props) && (props = [props]);

			for (const prop of props) {
				const val = value === undefined ? obj[prop] : value;

				Object.defineProperty(obj, prop, {
					get: () => hookStore[prop],
					set: e => {},
					configurable: false,
					enumerable: Object.getOwnPropertyDescriptor(obj, prop).enumerable
				});

				!hookValue.hookedObjs.has(obj) && hookValue.hookedObjs.set(obj, {});
				const hookStore = hookValue.hookedObjs.get(obj);
				hookStore[prop] = val;
			}
		}
	}

	function isObject(val) {
		return typeof val === 'object' && val !== null;
	}
})();