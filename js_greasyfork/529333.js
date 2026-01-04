// ==UserScript==
// @name         Wikipedia Auto Theme
// @description  Automatically selects 'Automatic' theme on Wikipedia.
// @match        https://*.wikipedia.org/*
// @grant        none
// @version 0.0.1.20250309201107
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/529333/Wikipedia%20Auto%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/529333/Wikipedia%20Auto%20Theme.meta.js
// ==/UserScript==

(function() {
    "use strict";
    
    function setTheme() {
        let theme = document.querySelector('input[name="skin-client-pref-skin-theme-group"][value="os"]');
        if (theme && !theme.checked) {
            theme.checked = true;
            theme.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }
    
    new MutationObserver(setTheme).observe(document.body, { childList: true, subtree: true });
    setTheme();
})();
