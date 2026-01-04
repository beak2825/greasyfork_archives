// ==UserScript==
// @name         Torn Points Market Quick Refresh
// @namespace    underko.torn.scripts.points
// @version      1.0
// @author       underko[3362751]
// @description  Disable fadeIn animation for the refresh button
// @match        https://www.torn.com/pmarket.php
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541980/Torn%20Points%20Market%20Quick%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/541980/Torn%20Points%20Market%20Quick%20Refresh.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function applyOverride() {
        if (typeof $ === 'undefined') return;

        if ($('.users-point-sell').length > 0) {
            $(".content-title a.form-reset").show();
        }
    }

    applyOverride();

    const observer = new MutationObserver(() => {
        applyOverride();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
