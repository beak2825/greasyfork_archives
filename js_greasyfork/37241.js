// ==UserScript==
// @name         HoodHider
// @namespace    http://click-that-hood.com/
// @version      0.1
// @description  Hide hood overlays on click-that-hood.com so that you can't see the hood names before clicking.
// @author       Christian Huber
// @match        http://click-that-hood.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37241/HoodHider.user.js
// @updateURL https://update.greasyfork.org/scripts/37241/HoodHider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('#neighborhood-hover').style="display: none; visibility: hidden";
})();