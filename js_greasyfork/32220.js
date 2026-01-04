// ==UserScript==
// @name         Set minimum font weight
// @namespace    http://md5-f3c5e23e69e2fa0b44e254d4548c5915.committed-identity.internal/setminimumfontweight
// @version      1.0
// @description  Set the minimum font weight on a page, to make things readable
// @author       Committed Identity MD5 f3c5e23e69e2fa0b44e254d4548c5915
// @copyright    Copyright (C) 2017 Committed Identity MD5 f3c5e23e69e2fa0b44e254d4548c5915
// @license      https://opensource.org/licenses/MIT
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/32220/Set%20minimum%20font%20weight.user.js
// @updateURL https://update.greasyfork.org/scripts/32220/Set%20minimum%20font%20weight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var minweight = 400;

    var all = document.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
        var weight = parseFloat(window.getComputedStyle(all.item(i), null).getPropertyValue('font-weight'));
        if (weight < minweight) {
            all.item(i).style.fontWeight = minweight;
        }
    }

})();