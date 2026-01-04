// ==UserScript==
// @name         SVTPlay - Disable automatic video downscale
// @description  Disables the automatic downscaling of SVTPlay streams while tabbed away
// @author       rooty
// @namespace    namespace_rooty
// @version      1.0
// @match        https://www.svtplay.se/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/428514/SVTPlay%20-%20Disable%20automatic%20video%20downscale.user.js
// @updateURL https://update.greasyfork.org/scripts/428514/SVTPlay%20-%20Disable%20automatic%20video%20downscale.meta.js
// ==/UserScript==

"use strict";

// Try to trick the site into thinking it's never hidden
Object.defineProperty(document, 'hidden', {value: false, writable: false});
Object.defineProperty(document, 'visibilityState', {value: 'visible', writable: false});
Object.defineProperty(document, 'webkitVisibilityState', {value: 'visible', writable: false});
document.dispatchEvent(new Event('visibilitychange'));
document.hasFocus = function () { return true; };

// visibilitychange events are captured and stopped
document.addEventListener('visibilitychange', function(e) {
	e.stopImmediatePropagation();
}, true, true);