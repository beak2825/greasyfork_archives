// ==UserScript==
// @name         Subtitles under video
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  For youtube. Shift subtitles under a video.
// @author       Andrei Balashov
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474290/Subtitles%20under%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/474290/Subtitles%20under%20video.meta.js
// ==/UserScript==
(() => {
	'use strict';


	document.addEventListener('DOMContentLoaded', e => {
		// after the DOM has loaded

		// silently fails in Firefox if placed outside when `document-start`
		GM_addStyle(

`.ytp-gradient-bottom{
    display: none !important;
}

ytd-watch-flexy[default-layout] ytd-player{
    height: calc(100% + 130px);
}
ytd-watch-flexy[default-layout]  #player{
    margin-bottom: 130px;
}

ytd-watch-flexy[theater]:not([fullscreen]) ytd-player{
    height: calc(100% + 150px);
}
ytd-watch-flexy[theater]:not([fullscreen]) #full-bleed-container{
    margin-bottom: 150px;
}

.html5-video-container > video{
    top: 0px !important;
}


ytd-player{
   background-color: #6a6a6a;
}`
        );
    });
})();