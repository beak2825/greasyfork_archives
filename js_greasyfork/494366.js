// ==UserScript==
// @name         Remove libvio popup
// @namespace    http://tampermonkey.net/
// @version      2024-05-08
// @description  Remove libvio popup.
// @author       You
// @match        https://www.libvio.vip/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=libvio.vip
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494366/Remove%20libvio%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/494366/Remove%20libvio%20popup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".popup").remove();
})();