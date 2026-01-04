// ==UserScript==
// @name         This Day in History Practice Utility
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Changes the day on "This Day In History" to allow you to practice for a Cegielski Challenge.
// @author       Mikerific
// @match        http://www.shockwave.com/gamelanding/this-day-in-history.jsp
// @match        http://www.shockwave.com/gamelanding/this-day-in-us-history.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373032/This%20Day%20in%20History%20Practice%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/373032/This%20Day%20in%20History%20Practice%20Utility.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var s = document.getElementsByName("thisdayinhistory")[0].src;
    s = s.substring(0, s.indexOf('&dt='));
    var d = prompt("What day do you want to practice? (YYMMDD Example: 181008)");
    document.getElementsByName("thisdayinhistory")[0].src = s + "&dt=" + d;
})();