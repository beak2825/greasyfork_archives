// ==UserScript==
// @name         soso
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  try to take over the world!
// @author       You
// @match        *://*.www.abvc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sosovalue.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526675/soso.user.js
// @updateURL https://update.greasyfork.org/scripts/526675/soso.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.hostname !== 'cryptopond.xyz') {
        return;
    }
})();
