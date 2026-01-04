// ==UserScript==
// @name         poipiku-show me the menu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  show me the menu
// @author       AlotOfBlahaj
// @match        https://poipiku.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poipiku.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448921/poipiku-show%20me%20the%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/448921/poipiku-show%20me%20the%20menu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('body, .Wrapper').each((i, e) => {$(e).off("contextmenu drag dragstart copy");});
})();