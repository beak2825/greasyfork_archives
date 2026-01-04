// ==UserScript==
// @name         DevTools Addon
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Add Devtools popup button
// @author       DarkoGH
// @match        *://*/*
// @icon         https://www.svgrepo.com/show/310247/window-dev-tools.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510598/DevTools%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/510598/DevTools%20Addon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var script = document.createElement('script'); script.src="https://cdn.jsdelivr.net/npm/eruda"; document.body.append(script); script.onload = function () { eruda.init(); } })();
