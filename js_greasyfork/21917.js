// ==UserScript==
// @name         UBS eBanking Timer
// @namespace    https://ebanking-ch2.ubs.com
// @version      0.2
// @description  Refresh the page when the timer is approaching zero.
// @author       Kursion
// @include      /^https:\/\/ebanking-ch[0-9]\.ubs\.com\/workbench\//
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21917/UBS%20eBanking%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/21917/UBS%20eBanking%20Timer.meta.js
// ==/UserScript==



(function() {
    'use strict';
    var TAG = $("#bze-session-timer-text");
    TAG.parent().css({
        backgroundColor: "#FCCCCC",
        borderRadius: "3px",
        padding: "3px",
        border: "1px solid #E99999"
    });
    var getTime = function(){
        return parseInt(TAG.text().split(":").join(""));
    };

    setInterval(function(){
        if (getTime() < 5){ location.reload(); }
    }, 700);

})();