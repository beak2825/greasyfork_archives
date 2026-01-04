// ==UserScript==
// @name StretchVideo2FullScreenSurface3+
// @namespace http://tampermonkey.net/
// @version 0.5
// @description Stretch (YouTube & VRTNU) videos to fill Surface 3+ displays (3:2 aspect ratio, distorted)
// @author Stijn Bousard | boossy
// @match https://www.youtube.com/*
// @match https://www.vrt.be/vrtnu/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/372536/StretchVideo2FullScreenSurface3%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/372536/StretchVideo2FullScreenSurface3%2B.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
 var head, style;
 head = document.getElementsByTagName('head')[0];
 if (!head) { return; }
 style = document.createElement('style');
 style.type = 'text/css';
 style.innerHTML = css;
 head.appendChild(style);
}
// YouTube (stretch 3:2):
// addGlobalStyle('.html5-video-player .video-click-tracking, .html5-video-player .video-stream { display: block; width: 100%; height: 100%; position: absolute; transform: scaleY(1.185) !important; } ');
// YouTube (full height & width with overflow, but centered):
addGlobalStyle('.html5-video-player .video-click-tracking, .html5-video-player .video-stream { display: block; width: 100%; height: 100%; position: absolute; transform: scale(1.065, 1.185) !important; } ');
// VRT NU (stretch 3:2) -- upto 20/05/2019:
// addGlobalStyle('.vuplay-container video { display: block; width: 100%; height: 100%; top: 50%; left: 50%; -webkit-transform: translate3d(0px, 0px, 0px); transform: scaleY(1.185) !important; } ');
// VRT NU (full height & width with overflow, but centered) -- upto 20/05/2019:
// addGlobalStyle('.vuplay-container video { display: block; width: 100%; height: 100%; top: 50%; left: 50%; -webkit-transform: translate3d(0px, 0px, 0px); transform: scale(1.065, 1.185) !important; } ');
// VRT NU (stretch 3:2) -- from 21/05/2019 onwards:
// addGlobalStyle('.video-js .vjs-tech { position: absolute; z-index: 0; transform: scaleY(1.185) !important; } ');
// VRT NU (full height & width with overflow, but centered) -- from 21/05/2019 onwards:
// addGlobalStyle('.video-js .vjs-tech { position: absolute; z-index: 0; transform: scale(1.065, 1.185) !important; } ');
// VRT NU (full height & width with overflow, but centered) -- from 26/07/2019 onwards:
addGlobalStyle('.video-js .vjs-tech { position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; transform: scale(1.065, 1.185) !important; } ');
addGlobalStyle('.chapters { margin-top: 22px; } ');

