// ==UserScript==
// @name         TVTime Episode Comment Picture Width
// @version      1.0
// @description  Smaller comment pictures, bigger reaction icons.
// @author       seaque
// @license      MIT
// @match        *://*.tvtime.com/*/show/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tvtime.com
// @grant        GM_addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/934668
// @downloadURL https://update.greasyfork.org/scripts/457630/TVTime%20Episode%20Comment%20Picture%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/457630/TVTime%20Episode%20Comment%20Picture%20Width.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(" .comment .post .comment-picture img { width: 45%; } .comment .post .options .right-options { font-size: 18px; } .comment .reply .options { font-size: 16px; } ");

})();