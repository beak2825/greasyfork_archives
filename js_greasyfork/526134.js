// ==UserScript==
// @name         Torn - Quick Busts
// @namespace    duck.wowow
// @version      1.0
// @description  Removes the need for a second click to bust someone from jail
// @author       Odung
// @match        https://www.torn.com/jailview.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526134/Torn%20-%20Quick%20Busts.user.js
// @updateURL https://update.greasyfork.org/scripts/526134/Torn%20-%20Quick%20Busts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyLinks() {
        document.querySelectorAll('a[href*="jailview.php?XID="]').forEach(a => {
            if (/jailview\.php\?XID=\d+&action=rescue&step=breakout$/.test(a.href)) {
                a.href += '1';
            }
        });
    }

    modifyLinks();
    const observer = new MutationObserver(modifyLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
