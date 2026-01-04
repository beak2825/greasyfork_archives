// ==UserScript==
// @name         Disable Spellcheck Globally
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  disables nasty spellcheck that Edge refuses to disable
// @author       The_GTA / Martin
// @match        *
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39190/Disable%20Spellcheck%20Globally.user.js
// @updateURL https://update.greasyfork.org/scripts/39190/Disable%20Spellcheck%20Globally.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.document.body.spellcheck = false;

    window.document.addEventListener("click",
        function(param)
    {
        param.target.spellcheck = false;
    });
})();