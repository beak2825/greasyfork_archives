// ==UserScript==
// @name         Hitomi.la cover animation
// @namespace    http://tampermonkey.net/
// @version      2023-12-26
// @description  Replace jQuery animation with CSS transition on Hitomi.la hover reveal effect for preview images to fix stutter or delay.
// @author       qb20nh
// @match        https://hitomi.la/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitomi.la
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483114/Hitomila%20cover%20animation.user.js
// @updateURL https://update.greasyfork.org/scripts/483114/Hitomila%20cover%20animation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const noop = () => {}
    window.moveimages = noop
})();