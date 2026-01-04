// ==UserScript==
// @name Expand width in www.facebook.com
// @namespace Expand width in www.facebook.com
// @include /^https\:\/\/www\.facebook\.com\//
// @description Expand width in www.facebook.com. Hide top bar and it will show only if mouse cursor move to top. Hide chat bar and it will show only if mouse cursor move to right side.
// @version 0.1.0
// @author	zero0evolution
// @run-at  document-start
// @downloadURL https://update.greasyfork.org/scripts/38282/Expand%20width%20in%20wwwfacebookcom.user.js
// @updateURL https://update.greasyfork.org/scripts/38282/Expand%20width%20in%20wwwfacebookcom.meta.js
// ==/UserScript==

"use strict"

document.addEventListener("DOMContentLoaded",function(){
	const cssElem = document.createElement('link');
	cssElem.rel = 'stylesheet';
	cssElem.type = 'text/css';
	cssElem.href = 'https://zero0evolution.github.io/GreasyForkSync/Expand width in www.facebook.com.css';
	// cssElem.media = 'all';
	// cssElem.crossorigin="anonymous";
	// cssElem.async = true;
	document.head.appendChild(cssElem);
})