// ==UserScript==
// @name         Unblock paste
// @namespace    me.ashlea.unblockpaste
// @version      1.0
// @description  Unblock the pasteroonies!
// @author       Ash Lea
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38526/Unblock%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/38526/Unblock%20paste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('paste', function(e) {
        if (e.clipboardData.getData("text/plain")) {
            e.stopImmediatePropagation();
        }
    }, true);
})();