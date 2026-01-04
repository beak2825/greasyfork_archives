// ==UserScript==
// @name         ez cookie remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes a specific kind of cookie prompt that seems to be popular in the Linux community.
// @author       Andreas Opferkuch
// @match        *://*/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Font_Awesome_5_solid_cookie-bite.svg/240px-Font_Awesome_5_solid_cookie-bite.svg.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462127/ez%20cookie%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/462127/ez%20cookie%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cookiePrompt = document.getElementById('ez-cookie-dialog-wrapper')
    if(cookiePrompt) {
        cookiePrompt.parentNode.removeChild(cookiePrompt)
    }
})();
