// ==UserScript==
// @name         Remove Web Limits
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes web limits
// @author       Veliomoure
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485222/Remove%20Web%20Limits.user.js
// @updateURL https://update.greasyfork.org/scripts/485222/Remove%20Web%20Limits.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        var elements = document.querySelectorAll('iframe, object, embed');
        for (var i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
    });
})();
