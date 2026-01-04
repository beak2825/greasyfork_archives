// ==UserScript==
// @name         kbin Hide Downvotes and Reputation
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Hides downvotes, and reputation on user pages
// @author       artillect
// @match        https://kbin.social/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @grant        GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469320/kbin%20Hide%20Downvotes%20and%20Reputation.user.js
// @updateURL https://update.greasyfork.org/scripts/469320/kbin%20Hide%20Downvotes%20and%20Reputation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM.addStyle(`
    .vote__down {
        display: none;
    }

    #sidebar > section.section.user-info > ul > li:nth-child(2) {
        display: none;
    }
    `);
})();