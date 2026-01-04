// ==UserScript==
// @name         Read The Nation Without Register
// @namespace    http://tampermonkey.net/
// @version      2023-12-27
// @description  The Misguided Satire of “American Fiction” | The Nation
// @author       You
// @match        *://*.thenation.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thenation.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/483210/Read%20The%20Nation%20Without%20Register.user.js
// @updateURL https://update.greasyfork.org/scripts/483210/Read%20The%20Nation%20Without%20Register.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('body {overflow: unset !important;position: unset !important;} .tp-container-inner {display: none !important;}');
})();