// ==UserScript==
// @name         Remove Sidebar Ads on Facebook
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Remove ads from the right sidebar on facebook
// @author       Alexander Uhl
// @match        https://www.facebook.com/*
// @license MIT
// @grant GM_log
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/402190/Remove%20Sidebar%20Ads%20on%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/402190/Remove%20Sidebar%20Ads%20on%20Facebook.meta.js
// ==/UserScript==

function hideFacebookSidebarAds(){
    var $rightSidebar    = $('div[data-pagelet="RightRail"]');
    var $sidebarElements = $rightSidebar.children('div');

    $.each($sidebarElements, function(i, ele){
        var eleText = $(ele).text();

        if (eleText.indexOf('Gesponsert') !== -1)
            $(ele).remove();
    });
}

for (var i = 0; i<20; i++)
{
    setTimeout(hideFacebookSidebarAds, 250*i);
}