// ==UserScript==
// @name       jawz Hybrid - Categorize business
// @version    1.1
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/10877/jawz%20Hybrid%20-%20Categorize%20business.user.js
// @updateURL https://update.greasyfork.org/scripts/10877/jawz%20Hybrid%20-%20Categorize%20business.meta.js
// ==/UserScript==

if ($('h1:contains(Categorize business)').length) {
    var info = $('label[class="control-label"]').eq(1);
    var sText = info.text().split('Websites:')[0].replace('Name and address:', '').replace(/\n+/g, ' ');
    var google_URL = "http://www.google.com/search?q=" + sText;
    google_URL = google_URL.replace(/[" "]/g, "+").replace("&", "%26");
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

    popupX = window.open(google_URL,'remote1','height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
} else if ($('h1:contains(Categorize the primary focus of a business)').length) {
    var info = $('label:contains(Business Information)');
    var sText = info.text().split('Business Information')[1].replace(/\n+/g, ' ');
    var google_URL = "http://www.google.com/search?q=" + sText;
    google_URL = google_URL.replace(/[" "]/g, "+").replace("&", "%26");
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

    popupX = window.open(google_URL,'remote1','height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    
    for (i=0; i<30; i++) {
        if (i == 4 || i == 9 || i == 14 || i == 19 || i == 24 || i == 29)
            $('input[class="radio_buttons required"]').eq(i).prop( "checked", true );
    }
}