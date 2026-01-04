// ==UserScript==
// @name         Adapt to Screen
// @name:zh      适应屏幕
// @supportURL   https://github.com/rectcircle/adapt-to-screen
// @namespace    https://github.com/rectcircle/adapt-to-screen
// @license      MIT
// @version      1.0.0
// @description         Make the computer version of the webpage use the phone
// @description:zh      使电脑版网页适合手机查看
// @author       Rectcircle <rectcircle96@gmail.com>
// @icon         
// @include      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370273/Adapt%20to%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/370273/Adapt%20to%20Screen.meta.js
// ==/UserScript==

if (document.querySelector('meta[name="viewport"]')==null){
	var oMeta = document.createElement('meta');
	oMeta.name = "viewport";
	oMeta.content = "width=device-width, initial-scale=1.0";
	document.head.appendChild(oMeta);
}

