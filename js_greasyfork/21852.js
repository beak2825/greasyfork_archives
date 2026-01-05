// ==UserScript==
// @name       jawz Hybrid - Check a contact
// @author		jawz
// @version    1.0
// @description Doin stuff
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/21852/jawz%20Hybrid%20-%20Check%20a%20contact.user.js
// @updateURL https://update.greasyfork.org/scripts/21852/jawz%20Hybrid%20-%20Check%20a%20contact.meta.js
// ==/UserScript==

if ($('li:contains("Check a contact")').length) {
    var srch1 = $('a').eq(7).text();
    var srch2 = 0;
    var srch3 = 0;
    var srch4 = 0;
    var google_URL = srch1;
    google_URL = google_URL.replace(/[" "]/g, "+").replace(/&/g, "%26");

    var halfScreen = screen.width/2;
    var windowHeight = screen.height;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    popupW = window.open(google_URL,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);

    window.onbeforeunload = function (e) {
        popupW.close();
    };
}