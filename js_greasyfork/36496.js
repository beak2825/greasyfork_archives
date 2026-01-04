// ==UserScript==
// @name         WaniKani Always Show Item Info
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Always show WaniKani item info during reviews without scrolling, no matter if your answer was correct or not.
// @author       irrelephant
// @match        https://www.wanikani.com/review/session
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36496/WaniKani%20Always%20Show%20Item%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/36496/WaniKani%20Always%20Show%20Item%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';
         $.jStorage.listenKeyChange('questionCount', function (key, action) {
            showItemInfo();
      });
})();

 function noscroll() {
        window.scrollTo( 0, 0 );
 }

// expand item info
function showItemInfo(){
             window.addEventListener('scroll', noscroll);

            // expand item info
            setTimeout(function () {
                $('#option-item-info').click();
            }, 100);

            // Remove listener to disable scroll
            setTimeout(function () {
                window.removeEventListener('scroll', noscroll);
            }, 1000);
}
