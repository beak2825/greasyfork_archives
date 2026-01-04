// ==UserScript==
// @name         tea-indicator
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Show tea data, fallback to performance paint entries.
// @author       leto
// @match        https://*/*
// @match        http://*/*
// @noframes
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/397030/tea-indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/397030/tea-indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const script = document.createElement('script')
    script.src = 'https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/tamper/app.c57f24ac.js'
    script.id = 'tea-indicator'
    document.head.appendChild(script)
})();