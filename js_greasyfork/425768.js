// ==UserScript==
// @name        Reverso Context unblur
// @match       *://context.reverso.net/*
// @grant       none
// @version     1.2
// @author      convex
// @run-at      document-idle
// @description Unblur extra usage examples without logging in
// @namespace https://greasyfork.org/users/46090
// @downloadURL https://update.greasyfork.org/scripts/425768/Reverso%20Context%20unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/425768/Reverso%20Context%20unblur.meta.js
// ==/UserScript==

(function() {
    // allow loading more examples
    window.logLOCD = true;
    
    // remove blur
    document.querySelectorAll('.blocked').forEach(x => x.classList.remove('blocked'));
    
    // remove sign up overlay
    document.querySelectorAll('#blocked-results-banner').forEach(x => x.remove());
})();