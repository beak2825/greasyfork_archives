// ==UserScript==
// @name         Remove skin tone variants from Emojipedia lists
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove skin tone variants from Emojipedia emoji lists
// @author       Thomas Chapeaux
// @match        https://emojipedia.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449988/Remove%20skin%20tone%20variants%20from%20Emojipedia%20lists.user.js
// @updateURL https://update.greasyfork.org/scripts/449988/Remove%20skin%20tone%20variants%20from%20Emojipedia%20lists.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll(".lazyparent a[href*='skin-tone']").forEach(n => n.parentNode.parentNode.removeChild(n.parentNode));
})();