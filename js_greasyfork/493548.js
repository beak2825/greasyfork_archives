// ==UserScript==
// @name         Pixmap Void theme
// @version      1.1
// @description  Refresh the website for the theme to appear.
// @author       TrxrKnocks
// @grant 		 GM_xmlhttpRequest
// @grant 		 unsafeWindow
// @connect		 githubusercontent.com
// @connect		 github.com
// @connect		 pixmap.fun
// @match      *://pixmap.fun/*
// @namespace https://greasyfork.org/users/1293155
// @downloadURL https://update.greasyfork.org/scripts/493548/Pixmap%20Void%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/493548/Pixmap%20Void%20theme.meta.js
// ==/UserScript==

fetch('https://raw.githubusercontent.com/TouchedByDarkness/pixelplanet-void-style/main/style.css')
.then(res => res.text())
.then(css => {
	const ssv = unsafeWindow.ssv;
	const link = Array.from(document.querySelectorAll('link')).find(link => {
		const href = link.getAttribute('href');
		return (
			link.getAttribute('rel') === 'stylesheet' &&
			link.getAttribute('type') === 'text/css' &&
			href &&
			Object.values(ssv.availableStyles).some(path => href.includes(path)) &&
			!href.includes(ssv.availableStyles.default));
	});

	if(link) {
		link.parentNode.removeChild(link);
	}

	const style = document.createElement('style');
	style.innerHTML = css;
	document.head.appendChild(style);
});

