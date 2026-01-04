// ==UserScript==
// @name         禁止Worker
// @namespace    http://bmmmd.com/
// @version      2024-08-04
// @description  Web Workers
// @author       kdy
// @match        https://*/*
// @match        http://*/*
// @exclude      https://ffmpeg.bmmmd.com/
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517197/%E7%A6%81%E6%AD%A2Worker.user.js
// @updateURL https://update.greasyfork.org/scripts/517197/%E7%A6%81%E6%AD%A2Worker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.Worker = undefined;
})();