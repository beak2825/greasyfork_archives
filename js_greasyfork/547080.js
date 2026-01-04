// ==UserScript==
// @name         Open in RemovePayWall
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Open the current page with RemovePayWall from the Tampermonkey menu button, single-tab guaranteed
// @author       rogierg
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @run-at       document-idle
// @icon         https://www.removepaywall.com/faviFold/favicon-16x16.png
// @downloadURL https://update.greasyfork.org/scripts/547080/Open%20in%20RemovePayWall.user.js
// @updateURL https://update.greasyfork.org/scripts/547080/Open%20in%20RemovePayWall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Only register once per top-level page
    if (!window.top._removePaywallMenuRegistered) {
        window.top._removePaywallMenuRegistered = true;

        GM_registerMenuCommand("Open current page in RemovePayWall", function() {
            const url = encodeURIComponent(location.href);
            GM_openInTab("https://www.removepaywall.com/search?url=" + url, { active: true });
        });
    }
})();
