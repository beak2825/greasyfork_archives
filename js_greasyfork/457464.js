// ==UserScript==
// @name         Weawow Detail
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto-clicks the "details" <span> on Weawow.com
// @author       BagelMunster
// @match        https://weawow.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hibbard.eu
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457464/Weawow%20Detail.user.js
// @updateURL https://update.greasyfork.org/scripts/457464/Weawow%20Detail.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) {
        if(document.querySelector('#popupScroll-spotlist')) {
            observer.disconnect();
            document.getElementById('modal-weather-detail').click();
        }
    }

})();