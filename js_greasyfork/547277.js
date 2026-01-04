// ==UserScript==
// @name        Zen Fullscreen Polyfill
// @description Fixes page fullscreening using the F11 key in Zen Browser.
// @compatible  firefox (Zen Browser)
// @license     WTFPL
// @version     1.0.1
// @namespace   zen-f11-polyfill
// @include     *
// @downloadURL https://update.greasyfork.org/scripts/547277/Zen%20Fullscreen%20Polyfill.user.js
// @updateURL https://update.greasyfork.org/scripts/547277/Zen%20Fullscreen%20Polyfill.meta.js
// ==/UserScript==

window.addEventListener('keydown', (evt) => {
    if (!evt.defaultPrevented && !document.fullscreen && evt.key==='F11') {
        evt.preventDefault();
        document.documentElement.requestFullscreen();
    }
});