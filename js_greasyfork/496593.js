// ==UserScript==
// @name        Gateway Pundit AdBlock Popup Blocker
// @namespace   rfindley
// @description Closes request to remove ad blocker
// @version     2024-05-23
// @match       https://www.thegatewaypundit.com/*
// @copyright   2024, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/496593/Gateway%20Pundit%20AdBlock%20Popup%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/496593/Gateway%20Pundit%20AdBlock%20Popup%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.head.insertAdjacentHTML('beforeend',
            `<style name="noads">
            .fEy1Z2XT {display:none !important;}
            html {overflow:auto !important; overflow-x:hidden !important;}
            </style>`
        );
})();