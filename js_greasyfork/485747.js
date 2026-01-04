// ==UserScript==
// @name         Youtube non-patched ad-blocker (instant skip method)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  skippy scary button...
// @author       You
// @match        *://www.youtube.com/*
// @icon         https://sun6-20.userapi.com/s/v1/ig2/1JBwSIp_3SU2eWIMWDneyhVV2oDHoPxX5z1v6gcCn6r5pk3f32VPytKPp2dvihTyKCVlRGLhTlNx5SEzp6kJfWE-.jpg?size=984x985&quality=96&crop=111,0,984,985&ava=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485747/Youtube%20non-patched%20ad-blocker%20%28instant%20skip%20method%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485747/Youtube%20non-patched%20ad-blocker%20%28instant%20skip%20method%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.notif = (message, time, icon) => {
		let div = document.createElement("div");
		div.style = "background-color: white; color: black; font-family: monospace; display: flex; justify-content: center; align-items: center; position: absolute; max-width: 400px; left: -420px; top: 20px; border: 1px solid black; border-radius: 10px; z-index: 100000; transition: left 1s cubic-bezier(0.6, 0.59, 0, 0.99) 0s; padding-inline: 20px; padding-block: 8px;";
		div.innerHTML = message;
		document.body.appendChild(div);
		let img = document.createElement("img");
		img.src = icon;
		img.style = "width: 60px; margin-left: 10px; border: 1px black solid; border-radius: 10px;";
		div.appendChild(img);
		setTimeout(() => {
			div.style.left = "20px";
			setTimeout(() => {
				div.style.left = "-500px";
				setTimeout(() => {
					div.remove();
				}, 1500);
			}, time);
		}, 100);
	};

    setInterval(() => {
        [...document.getElementsByClassName("ytp-ad-skip-button-modern ytp-button")].forEach(button => {
            button.click();
            window.notif("Add blocked !", 3000, "https://sun6-20.userapi.com/s/v1/ig2/1JBwSIp_3SU2eWIMWDneyhVV2oDHoPxX5z1v6gcCn6r5pk3f32VPytKPp2dvihTyKCVlRGLhTlNx5SEzp6kJfWE-.jpg?size=984x985&quality=96&crop=111,0,984,985&ava=1");
        });
    }, 10);
})();