// ==UserScript==
// @name         Remove sens critique notification
// @description  Hide notification count
// @version      2024-10-05
// @author       You
// @match        https://www.senscritique.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=senscritique.com
// @grant          GM_addStyle
// @run-at       document-end
// @namespace https://greasyfork.org/users/14557
// @downloadURL https://update.greasyfork.org/scripts/511605/Remove%20sens%20critique%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/511605/Remove%20sens%20critique%20notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle("[data-testid=red-dot] { display: none } ");

})();