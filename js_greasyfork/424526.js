// ==UserScript==
// @name         Zotacstore Availability Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to make it possible to see the in-stock counter of a product.
// @author       Dave#3150
// @match        https://www.zotacstore.com/us/*
// @icon         https://www.google.com/s2/favicons?domain=zotacstore.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/424526/Zotacstore%20Availability%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/424526/Zotacstore%20Availability%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.product-view .product-shop .availability-only { display: block !important; }');
})();