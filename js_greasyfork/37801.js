// ==UserScript==
// @name         Remove video ads
// @version      0.1.4
// @description  This script is a test, to see if I can remove ads from online video hosts.
// @author       dinosw
// @license      Creative Commons; http://creativecommons.org/licenses/by/4.0/
// @supportURL   https://greasyfork.org/en/scripts/37801-remove-video-ads/feedback
// @homepageURL  https://greasyfork.org/en/scripts/37801
// @include      *
// @grant        GM_addStyle
// @run-at       document-start
// @namespace    https://greasyfork.org/en/users/29386
// @downloadURL https://update.greasyfork.org/scripts/37801/Remove%20video%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/37801/Remove%20video%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('#jwa{ display: none !important; }');
    GM_addStyle('#overlay{ display: none !important; }');
})();