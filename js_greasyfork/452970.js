// ==UserScript==
// @name         Ban cookies
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Cookies are very disgusting....
// @author       Aavash Aryal
// @match        *://*/*
// @grant        none
// @license      GNU GPLv2
// @require   https://code.jquery.com/jquery-3.6.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/452970/Ban%20cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/452970/Ban%20cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';
     /* eslint-env jquery */
    // Your code here...
    $('.js-consent-banner').css({'display':'none'});
})();