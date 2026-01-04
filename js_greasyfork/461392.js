// ==UserScript==
// @name         TikTok Play in Background
// @license      CC0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Let TikTok videos keep playing even when the browser/tab isn't focused!
// @author       Kirch
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/461392/TikTok%20Play%20in%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/461392/TikTok%20Play%20in%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';

window.addEventListener('visibilitychange', evt => evt.stopImmediatePropagation(), true);
window.addEventListener('blur', evt => evt.stopImmediatePropagation(), true);

})();