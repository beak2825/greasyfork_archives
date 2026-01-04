// ==UserScript==
// @name         HDS Tweaks
// @description  Tweaks for Spiceworks Help Desk Server
// @license      MIT
// @namespace    https://greasyfork.org/users/699728
// @version      1.09
// @author       Visual Comfort & Co.
// @include      https://*.on.spiceworks.com/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/415078/HDS%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/415078/HDS%20Tweaks.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

GM_addStyle ( `
    .main-content {
        width: 100% !important;
    }
    .container {
        width: 100% !important;
    }
    .ad-shelf {
        display: none !important;
    }
    .ad-container {
        display: none !important;
    }
    .meta .print-hide {
        display: none !important;
    }
    .meta .print-show {
        display: inherit !important;
    }
    .btn.btn-default.save.spec-comment-and-close-btn {
        display: none !important;
    }
` );