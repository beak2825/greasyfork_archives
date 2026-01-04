// ==UserScript==
// @name         Auto Expand Comments on Boosty To
// @description  Automatically expands comments on Boosty To
// @language     ru
// @version     0.1
// @match        https://boosty.to/*
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/483008/Auto%20Expand%20Comments%20on%20Boosty%20To.user.js
// @updateURL https://update.greasyfork.org/scripts/483008/Auto%20Expand%20Comments%20on%20Boosty%20To.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function expandComments() {
        let selectors = [
            '[class*="ShowMore_showMore"]', '[class*="Comment_readMore"]', '[class*="Comment_repliesButton"]',
            '[class*="Post_readMore"]', '[class*="CommentView_showMore"]', '[class*="CommentView-scss--module_showMore"]',
            '[class*="ShowMore-scss--module_showMore"]', '[class*="Post-scss--module_readMore"]',
            '.Feed-scss--module_center_vuV2A button'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(button => {
                if (button.offsetParent !== null) {
                    button.click();
                }
            });
        });
    }

    let observer = new MutationObserver(expandComments);
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(expandComments, 1000);
})();