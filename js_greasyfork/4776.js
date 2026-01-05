// ==UserScript==
// @name               My Mouse Gestures
// @name:zh-CN         我的鼠标手势
// @name:zh-TW         我的滑鼠手勢
// @description        A simple mouse gesture script
// @description:zh-CN  一个简单的鼠标手势脚本
// @description:zh-TW  一個簡單的滑鼠手勢腳本
// @version            0.2.2
// @match              *://*/*
// @run-at             document-start
// @grant              GM_openInTab
// @grant              window.close
// @grant              GM_setValue
// @grant              GM_getValue
// @namespace          https://greasyfork.org/users/4968
// @downloadURL https://update.greasyfork.org/scripts/4776/My%20Mouse%20Gestures.user.js
// @updateURL https://update.greasyfork.org/scripts/4776/My%20Mouse%20Gestures.meta.js
// ==/UserScript==

// --- Settings ---

const SENSITIVITY = 3; // 1 ~ 5
const TOLERANCE = 3; // 1 ~ 5

const funcs = {
	'U': () => window.scrollTo(0, 0),
	'D': () => window.scrollTo(0, 1073741824),
	'L': () => window.history.back(),
	'R': () => window.history.forward(),
	'DR': () => window.top.close(),
	'UD': () => window.location.reload(),
	'RU': () => {
		GM_openInTab('about:newtab', false);
		if (navigator.userAgent.indexOf('Firefox') !== -1) {
			GM_openInTab('about:blank', false);
		}
	},
	'RL': () => {
		let closedTabs = GM_getValue("closedTabs", []);
		if (closedTabs.length > 0) {
			let lastclosedTab = closedTabs.pop();
			GM_setValue("closedTabs", closedTabs);
			GM_openInTab(lastclosedTab, false);
		}
	}
};

// ----------------

const s = 1 << ((7 - SENSITIVITY) << 1);
const t1 = Math.tan(0.15708 * TOLERANCE);
const t2 = 1 / t1;
const abs = Math.abs;

let x, y, path, lastGesture;

const tracer = function (e) {
	const { clientX: cx, clientY: cy } = e;
	const dx = cx - x;
	const dy = cy - y;
	const distance = dx ** 2 + dy ** 2;

	if (distance > s) {
		const slope = abs(dy / dx);
		let direction = '';

		if (slope > t1) {
			direction = dy > 0 ? 'D' : 'U';
		} else if (slope <= t2) {
			direction = dx > 0 ? 'R' : 'L';
		}

		if (lastGesture !== direction) {
			lastGesture = direction;
			path += direction;
		}

		x = cx;
		y = cy;
	}
};

window.addEventListener('mousedown', function (e) {
	if (e.button === 2) {
		x = e.clientX;
		y = e.clientY;
		path = "";
		lastGesture = "";
		window.addEventListener('mousemove', tracer, false);
	}
}, false);

window.addEventListener('contextmenu', function (e) {
	window.removeEventListener('mousemove', tracer, false);
	if (path !== "") {
		e.preventDefault();
		if (funcs.hasOwnProperty(path)) {
			funcs[path]();
		}
	}
}, false);

window.addEventListener("beforeunload", () => {
	let closedTabs = GM_getValue("closedTabs", []).slice(-10);
	closedTabs.push(window.location.href);
	GM_setValue("closedTabs", closedTabs);
});
