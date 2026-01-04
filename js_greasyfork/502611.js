// ==UserScript==
// @name       Consistent Player Control - Youtube
// @namespace  gqqnbig
// @match  https://www.youtube.com/watch?*
// @grant       none
// @version     1.0
// @author      gqqnbig
// @description 2024/2/23下午11:35:42
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @license  GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/502611/Consistent%20Player%20Control%20-%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/502611/Consistent%20Player%20Control%20-%20Youtube.meta.js
// ==/UserScript==


VM.shortcut.register('c-right', () => { document.querySelector(".html5-main-video").currentTime+=30 });
VM.shortcut.register('c-left', () => { document.querySelector(".html5-main-video").currentTime-=30 });