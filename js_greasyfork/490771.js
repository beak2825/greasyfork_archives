// ==UserScript==
// @name         Back-to-AD-Button on Autodarts Board-Manager
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adding a button in the board manager back to Autodarts. Recommended for touchscreens in full screen mode
// @author       benebelter
// @include      *://*.*.*.*
// @include      https://play.autodarts.io/boards*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=178.42
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490771/Back-to-AD-Button%20on%20Autodarts%20Board-Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/490771/Back-to-AD-Button%20on%20Autodarts%20Board-Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let count = 0;
    var elementExist = setInterval( () => {
        count = count + 1;
        if ($(".css-1nlwyv4").length != 0) {

            $('.css-1nlwyv4:last-child').after('<a class="chakra-button css-1nlwyv4" href="https://play.autodarts.io"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9"/></svg> Back to Autodarts</a>');

            clearInterval(elementExist);

        }
        if(count > 20) { // Abort after 20s
            clearInterval(elementExist);
        }
    }, 1000);

})();