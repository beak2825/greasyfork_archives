// ==UserScript==
// @name         Amazon Wishlist item user-comments / user-notes - fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fixes user-unfriendly WishList layout changes, made by Amazon in January 2025.
// @author       dhaden
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523411/Amazon%20Wishlist%20item%20user-comments%20%20user-notes%20-%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/523411/Amazon%20Wishlist%20item%20user-comments%20%20user-notes%20-%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle // 1st change
    (`.awl-ul-keyword-item-truncated-text {
    font-size: 16px !important;
	white-space: normal;
    padding-bottom: 3px;
    `);

    GM_addStyle // 2nd change
    (`.a-size-small a-color-secondary awl-ul-keyword-item-truncated-text {
    font-size: 16px !important;
	white-space: normal;
    padding-bottom: 3px;
    }
   `);
})();