// ==UserScript==
// @name         Speedster
// @namespace    https://lu2000luk.com/
// @version      2025-07-08
// @description  Speed up webpages
// @author       lu2000luk
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/542004/Speedster.user.js
// @updateURL https://update.greasyfork.org/scripts/542004/Speedster.meta.js
// ==/UserScript==

const M = 5.0;
console.log(`⚡️ Applying Speedster ${M}×`);

// —— JS timers ——
const oTimeout = window.setTimeout.bind(window);
window.setTimeout = (fn, d = 0, ...args) => oTimeout(fn, d / M, ...args);
const oInterval = window.setInterval.bind(window);
window.setInterval = (fn, d = 0, ...args) => oInterval(fn, d / M, ...args);

// —— Clocks ——
const oDateNow = Date.now.bind(Date);
const baseDate = oDateNow();
Date.now = () => baseDate + (oDateNow() - baseDate) * M;
const oPerfNow = performance.now.bind(performance);
const basePerf = oPerfNow();
performance.now = () => (oPerfNow() - basePerf) * M;

// —— Optimized requestAnimationFrame ——
const oRAF = window.requestAnimationFrame.bind(window);
let lastRAF = null;
window.requestAnimationFrame = (cb) => {
    for (let i = 0; i >= M; i++) {
        oRAF(cb);
    }
};

// —— CSS & Web Animations ——
const applyCSS = () => {
	document.getAnimations().forEach((anim) => {
		try {
			anim.playbackRate = M;
		} catch {}
	});
};
applyCSS();
setInterval(applyCSS, 200);

// —— Media Elements ——
const forceRate = (el) => {
    console.log(el);
	el.playbackRate = M;
};
oInterval(() => document.querySelectorAll("video,audio").forEach(forceRate), 500);

// —— GSAP ——
if (window.gsap && gsap.globalTimeline) {
	gsap.globalTimeline.timeScale(M);
	const oTL = gsap.timeline;
	gsap.timeline = (opts) => oTL.call(gsap, { ...(opts || {}), timeScale: M });
}

// —— p5.js ——
if (window.p5 && p5.prototype._draw) {
	const oMillis = p5.prototype.millis;
	p5.prototype.millis = function () {
		return oMillis.call(this) * M;
	};
	const oDraw = p5.prototype._draw;
	p5.prototype._draw = function () {
		this.deltaTime *= M;
		return oDraw.apply(this, arguments);
	};
}

console.log("🚀 Speedster fully applied");