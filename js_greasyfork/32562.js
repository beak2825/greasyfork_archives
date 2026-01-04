// ==UserScript== 
// @name        youtube-no-header 
// @name:zh-CN youtube no header
// @namespace   netroby
// @description:zh-cn no youtube header
// @description Script description 
// @include     https://*.youtube.com/watch*
// @version     1.0.0 
// @downloadURL https://update.greasyfork.org/scripts/32562/youtube-no-header.user.js
// @updateURL https://update.greasyfork.org/scripts/32562/youtube-no-header.meta.js
// ==/UserScript==

GM_addStyle("#masthead-container.ytd-app {display: none; } #page-manager.ytd-app {margin-top: 0;} #top.ytd-watch {margin-top: 0;}");
