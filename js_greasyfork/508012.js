// ==UserScript==
// @name         Kick Quality
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disables quality drop on another tab for kick
// @author       blacksquirtle
// @match        https://kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508012/Kick%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/508012/Kick%20Quality.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(document, "hidden", {value: false, writable: true});
})();