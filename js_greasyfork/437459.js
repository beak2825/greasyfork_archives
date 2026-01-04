/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               Anti-"砖叶房风沙"
// @name:zh-CN         反 "砖叶房风沙"
// @namespace          Anti-ZhuanYeFangFengSha
// @version            0.1
// @description        Anti https://greasyfork.org/scripts/437198
// @description:zh-CN  反 https://greasyfork.org/scripts/437198
// @author             PY-DNG
// @license            MIT
// @match              *://*.12377.cn/*
// @match              *://*.12321.cn/*
// @match              *://greasyfork.org/*
// @match              *://jubao.chinaso.com/*
// @icon               https://greasyfork.org/packs/media/images/blacklogo16-5421a97c75656cecbe2befcec0778a96.png
// @grant              none
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/437459/Anti-%22%E7%A0%96%E5%8F%B6%E6%88%BF%E9%A3%8E%E6%B2%99%22.user.js
// @updateURL https://update.greasyfork.org/scripts/437459/Anti-%22%E7%A0%96%E5%8F%B6%E6%88%BF%E9%A3%8E%E6%B2%99%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

	// Prevent document.write blank
	const write = document.write;
	document.write = function(s) {
		if (s === "<div></div>") {
			console.log('反 "砖叶房风沙"：阻止了一起惨案');
			return;
		}
		return write(s);
	}

	// Prevent stop
	window.stop = function() {
		console.log('反 "砖叶房风沙"：阻止了一起惨案');
	};

	// Onload clear
    const ffsonload = 'function () {\n        if (\n            document.querySelectorAll("nofs.report-link".substring(4))[0] &&\n            location.href.indexOf("fork") > -1\n        ) {\n            document.querySelectorAll("nofs.report-link".substring(4)).forEach((e) => {\n                e.remove();\n            });\n        }\n        if (\n            document.querySelectorAll("nofs#script-feedback-suggestion".substring(4))[0] &&\n            location.href.indexOf("fork") > -1\n        ) {\n            document.querySelectorAll("nofs#script-feedback-suggestion".substring(4)).forEach((e) => {\n                e.remove();\n            });\n        }\n    }';
	window.onload && window.onload.toString() === ffsonload && (window.onload === null);

	// Protect links
	const sbst = String.prototype.substring;
	String.prototype.substring = function(a, b) {
		const str = String(this);
		if (['nofs.report-link', 'nofs#script-feedback-suggestion'].includes(str) && a === 4) {
			console.log('反 "砖叶房风沙"：阻止了一起惨案');
			return randstr(str.length-4);
		}
		return sbst.call(this, a, b);
	}

	// Returns a random string
	function randstr(length=16, cases=true, aviod=[]) {
		const all = 'abcdefghijklmnopqrstuvwxyz0123456789' + (cases ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '');
		while (true) {
			let str = '';
			for (let i = 0; i < length; i++) {
				str += all.charAt(randint(0, all.length-1));
			}
			if (!aviod.includes(str)) {return str;};
		}
	}

	function randint(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
})();