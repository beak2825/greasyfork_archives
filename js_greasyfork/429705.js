// ==UserScript==
// @name         Wanikani: No Timeout
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Hides the timeout message so that you can continue your reviews.
// @author       Kumirei
// @include      *wanikani.com/review/session
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429705/Wanikani%3A%20No%20Timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/429705/Wanikani%3A%20No%20Timeout.meta.js
// ==/UserScript==

(function() {
    document.querySelector('head').insertAdjacentHTML('beforeend', '<style id="NoTimeoutCSS">#timeout {display: none !important;}</style>');
})();
