// ==UserScript==
// @name         Reset Torn API Key
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Resets the API key for Torn Russian Roulette Helper.
// @author       ErrorNullTag
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @license      GPU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/474166/Reset%20Torn%20API%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/474166/Reset%20Torn%20API%20Key.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Reset the API key
    GM_setValue("API_KEY", "");

    console.log("API key has been reset!");

})();
