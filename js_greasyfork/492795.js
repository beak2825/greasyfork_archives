// ==UserScript==
// @name         No New Tabs on My.Extole.com
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Prevent opening new tabs from links on My.Extole.com
// @author       You
// @match        *://my.extole.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492795/No%20New%20Tabs%20on%20MyExtolecom.user.js
// @updateURL https://update.greasyfork.org/scripts/492795/No%20New%20Tabs%20on%20MyExtolecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target && target.hostname === 'my.extole.com') {
            if (!e.ctrlKey && !e.metaKey) { // Check if Ctrl (Windows/Linux) or Command (Mac) is not pressed
                e.preventDefault(); // Prevent the default link behavior
                window.location.href = target.href; // Navigate within the same tab
            }
        }
    }, true);
})();