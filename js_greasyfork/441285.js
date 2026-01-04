/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               AGEFans 允许控制台调试
// @name:zh-CN         AGEFans 允许控制台调试
// @name:en            AGEFans anti-anti-debugger
// @namespace          AGEFans-anti-anti-debugger
// @version            0.1
// @description        允许在 AGEFans 使用网页控制台，去除无限debugger以及页面自动跳转
// @description:zh-CN  允许在 AGEFans 使用网页控制台，去除无限debugger以及页面自动跳转
// @description:en     Allows you to use devtools in agefans
// @author             PY-DNG
// @license            WTFPL - see http://wtfpl.net/
// @include            https://www.age.tv/*
// @include            https://www.agefans.*
// @include            https://www.agemys.*
// @icon               none
// @grant              none
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/441285/AGEFans%20%E5%85%81%E8%AE%B8%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%B0%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/441285/AGEFans%20%E5%85%81%E8%AE%B8%E6%8E%A7%E5%88%B6%E5%8F%B0%E8%B0%83%E8%AF%95.meta.js
// ==/UserScript==

(function __MAIN__() {
    'use strict';

	let logged = false;
	Object.defineProperty(window, 'devtoolsDetector', {
		get: function() {
			return window.test_backup;
		},
		set: function(v) {
			window.test_backup = new Proxy(v, {
				get: function(target, prop, reciever) {
					// 笑死，他居然还把launch错写成了lanuch
					if (prop === 'lanuch') {
						// Log once
						!logged && console.log('%c Fuck you, devtoolsDetector', 'color:#ff0000');
						!logged && console.log('%c devtoolsDetector >> passed', 'color:#00aa00');
						logged = true;

						// Fake lanuch function
						return new Proxy(fake_lanuch, {
							get: function(target, prop, reciever) {
								const inherits = ['name', 'toString', 'toLocaleString'];
								return inherits.includes(prop) ? (typeof v.lanuch[prop] === 'function' ? () => (v.lanuch[prop]()) : v.lanuch[prop]) : fake_lanuch[prop];
							}
						});

						function fake_lanuch() {/* Fuck you, devtoolsDetector */}
					}
					return v[prop];
				}
			});
		}
	});

	/*
	const interval = setInterval(function() {
		if (typeof(devtoolsDetector) === 'object') {
			devtoolsDetector.stop();
			clearInterval(interval);
		}
	}, 500);
	*/
})();