// ==UserScript==
// @name        Wanikani Disable Review Submission
// @namespace   wk_disable_reviews
// @description Disable submission of reviews, for debugging purposes
// @include     https://www.wanikani.com/review/session*
// @version     1.0.1
// @author      Robin Findley
// @copyright   2018+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40202/Wanikani%20Disable%20Review%20Submission.user.js
// @updateURL https://update.greasyfork.org/scripts/40202/Wanikani%20Disable%20Review%20Submission.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
        $.ajax = function(){return $.Deferred().resolve();};
    }, 1000);
})();
