// ==UserScript==
// @name         Hide Bazaar Banners
// @version      1.21
// @description  Hides the annoying bazaar descriptions
// @author       Weav3r [1853324]
// @match        https://www.torn.com/bazaar.php?userId=*
// @run-at       document-start
// @namespace https://greasyfork.org/users/1132291
// @downloadURL https://update.greasyfork.org/scripts/500482/Hide%20Bazaar%20Banners.user.js
// @updateURL https://update.greasyfork.org/scripts/500482/Hide%20Bazaar%20Banners.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        document.querySelectorAll('.description___D99uc.unreset, .devider___qmoNT').forEach(el => el.remove());

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT, null, false);
        let node;
        while (node = walker.nextNode()) {
            node.remove();
        }
    }


    window.addEventListener('load', function() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    removeElements();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        removeElements();
    });
})();
