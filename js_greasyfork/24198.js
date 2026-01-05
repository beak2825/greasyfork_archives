// ==UserScript==
// @name     SmashingMagazine
// @description Hide readed article
// @include    http://www.smashingmagazine.com/*
// @include    https://www.smashingmagazine.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @version 0.0.1.20181112100255
// @namespace https://greasyfork.org/users/38384
// @downloadURL https://update.greasyfork.org/scripts/24198/SmashingMagazine.user.js
// @updateURL https://update.greasyfork.org/scripts/24198/SmashingMagazine.meta.js
// ==/UserScript==

jQuery(function() {
        var response = ["/2018/10/"];
        var resLength = response.length, pageSize = 0;
        debugger;
        for (var i=0; i<resLength; i++) {
            jQuery("h1.article--post__title a").each(function () {
                if (pageSize == 10) {
                   return false;
                }
                var href = jQuery(this).prop('href');
                if (href.indexOf(response[i]) != -1) {
                    jQuery(this).closest("article").hide();
                    pageSize = pageSize + 1; 
                }
            });
       }
});