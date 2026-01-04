// ==UserScript==
// @name          Arras.io FOV Script
// @namespace     https://tampermonkey.net/
// @version       403.77
// @description   Control FOV by mouse wheel
// @icon          https://arras.io/favicon/128x128.png
// @author        Jiwoon Myung
// @match         *://arras.io/*
// @grant         unsafeWindow
// @run-at        document-load
// @require       https://greasyfork.org/scripts/437636-arras-io-modified-client-v1-0-3/code/Arrasio%20Modified%20client%20v103.js?version=1028781
// @downloadURL https://update.greasyfork.org/scripts/438611/Arrasio%20FOV%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/438611/Arrasio%20FOV%20Script.meta.js
// ==/UserScript==
 
const amc = unsafeWindow.amc;
amc.addEventListener("ready", (event) => {
 
	// 変数宣言
	const canvasElement = document.getElementById("canvas");
	const Arras = unsafeWindow.Arras();
	let fov = 1.0;
 
	// 設定
	let view = 0;
	Object.defineProperty(Arras.player, "view", {
		"set": (_view) => {
			view = _view;
			return view;
		},
		"get": () => {
			return (view * fov);
		}
	});
 
	// マウスホイール操作時
	window.addEventListener("wheel", (event) => {
		const element = document.elementFromPoint(event.clientX, event.clientY);
		if (!element.isEqualNode(canvasElement)) {
			return;
		}
		if (event.wheelDelta > 0) {
			fov /= 1.1;
		} else {
			fov *= 1.1;
		}
		fov = Math.max(fov, 0.025);
		fov = Math.min(fov, 30.0);
	});
 
});