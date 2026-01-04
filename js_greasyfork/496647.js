// ==UserScript==
// @name         Photopea Ad Sidebar Remove
// @namespace    http://tampermonkey.net/
// @version      2024-05-29
// @description  Removes the ad sidebar in photopea, which appears even if you have an adblocker.
// @author       You
// @match        https://www.photopea.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=photopea.com
// @grant        none
// @license	 MIT
// @downloadURL https://update.greasyfork.org/scripts/496647/Photopea%20Ad%20Sidebar%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/496647/Photopea%20Ad%20Sidebar%20Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(window, 'innerWidth', {
  get() { return document.documentElement.offsetWidth + 320 },
})
})();