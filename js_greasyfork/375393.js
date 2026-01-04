// ==UserScript==
// @name         Back Booking
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.vebongdaonline.vn/checkContinue
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375393/Back%20Booking.user.js
// @updateURL https://update.greasyfork.org/scripts/375393/Back%20Booking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log($(".txt_notify").html());
    if($(".txt_notify").html().indexOf("RẤT TIẾC") != -1) {
        window.history.back();
    }
})();