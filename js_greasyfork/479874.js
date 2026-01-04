// ==UserScript==
// @name        Toggle Fullscreen Button For Mobile Browsers
// @namespace   Toggle Fullscreen Button For Mobile Browsers Scripts
// @include       http*://*/*
// @grant       none
// @version     1.5
// @author      -
// @description 11/14/2023, 10:20:53 PM
// @downloadURL https://update.greasyfork.org/scripts/479874/Toggle%20Fullscreen%20Button%20For%20Mobile%20Browsers.user.js
// @updateURL https://update.greasyfork.org/scripts/479874/Toggle%20Fullscreen%20Button%20For%20Mobile%20Browsers.meta.js
// ==/UserScript==

(function () {
	function toggleFullScreen() {
		if (!document.fullscreenElement && // alternative standard method
			!document.mozFullScreenElement && !document.webkitFullscreenElement) { // current working methods
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		}
		this.parentNode.style.display = 'none';
	}
	function showPseudoFullscreenButton(e) {
		var ele = document.createElement('div');
		var btn = document.createElement('button');
		ele.style.position = 'fixed';
        ele.style.opacity = '0';
        ele.style.zIndex = '999999';
		ele.style.left = (e.clientX - 20).toString() + 'px';
		ele.style.top = (e.clientY - 10).toString() + 'px';
		btn.innerHTML = 'Fullscreen';
		btn.addEventListener('click', toggleFullScreen);
		ele.appendChild(btn);
		document.body.appendChild(ele);
	}
	window.addEventListener('dblclick', function (e) {
		showPseudoFullscreenButton(e);
	});
    // show/hide popup on 3 finger tap
    window.addEventListener("touchstart", e => {
        if (e.touches.length == 3) {
            toggleFullScreen();
            showPseudoFullscreenButton(e);
        }
    });
})();
