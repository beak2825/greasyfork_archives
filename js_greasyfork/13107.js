// ==UserScript==
// @name       Audi Jira Header Hider
// @description  Hides the useless message that takes half of a screen from Audi Jira
// @version    0.1
//
// @include    https://acsptaskmgmt.audi.com/jira/*
// @grant      none
// @namespace https://greasyfork.org/users/4412
// @downloadURL https://update.greasyfork.org/scripts/13107/Audi%20Jira%20Header%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/13107/Audi%20Jira%20Header%20Hider.meta.js
// ==/UserScript==

(function () {
    var $ = jQuery;
    var $banner = $('#announcement-banner');
    var folded = true;
    $banner.css('height', '24px');
    
    $banner.click(function () {
        if (folded) {
            $banner.css('height', '');
            folded = false;
        } else {
            $banner.css('height', '24px');
            folded = true;
        }
    });
})();

