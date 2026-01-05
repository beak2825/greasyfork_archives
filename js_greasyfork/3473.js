// ==UserScript==
// @name          Dropcam fullscreen
// @namespace     http://userscripts.org/users/20715
// @description   Switches Dropcam to fullscreen
// @include       https://www.dropcam.com/watch/*
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/3473/Dropcam%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/3473/Dropcam%20fullscreen.meta.js
// ==/UserScript==

GM_addStyle('.viewer .playback .video { position: fixed; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%; }');
GM_addStyle('.viewer .playback .controls { position: fixed; bottom: 40px; left: 0; right: 0; }');
GM_addStyle('.footer_user { display: none; }');
