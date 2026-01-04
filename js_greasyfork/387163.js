/* global $ */
// ==UserScript==
// @name         Auto Clicking
// @version      1
// @description  Auto Skip Waiting
// @author       Vietkhanh Bean (fb.com/vietkhanhbean)
// @match        https://woprime.com/please-wait-5s-and-click-skip-ads
// @grant        none
// @namespace https://greasyfork.org/users/188746
// @downloadURL https://update.greasyfork.org/scripts/387163/Auto%20Clicking.user.js
// @updateURL https://update.greasyfork.org/scripts/387163/Auto%20Clicking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('#Redirect').get(0).click();
})();