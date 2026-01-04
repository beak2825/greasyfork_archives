// ==UserScript==
// @name         Remove LocalStorage Item
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes specific item from localStorage on ole.com.ar
// @author       me
// @match        https://www.ole.com.ar/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508326/Remove%20LocalStorage%20Item.user.js
// @updateURL https://update.greasyfork.org/scripts/508326/Remove%20LocalStorage%20Item.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove the item from localStorage
    window.localStorage.removeItem("zonda.ole.counters");
})();