// ==UserScript==
// @name         pg spaghetti fix v2
// @version      2.3
// @description  changes stuff
// @author       Gamma
// @match        https://www.prestige-gaming.org/*
// @grant        none
// @namespace https://greasyfork.org/users/111963
// @downloadURL https://update.greasyfork.org/scripts/28370/pg%20spaghetti%20fix%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/28370/pg%20spaghetti%20fix%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".customSubNav .visitorTabs").append('<li class="navTab app" style="display: inline-block"><a href="application/" class="navLink NoPopupGadget" style="display: inline-block"><i class="fa fa-square"></i></a></li>\n');
    $(".customSubNav .visitorTabs").append('<li class="navTab whatsnew" style="display: inline-block"><a href="find-new/posts" class="navLink NoPopupGadget" style="display: inline-block"><i class="fa fa-file"></i></a></li>\n');
    $(".customSubNav .visitorTabs").append('<li class="navTab bans2" style="display: inline-block"><a href="bans/" class="navLink NoPopupGadget" style="display: inline-block ; padding-right: 8px ; padding-left: 8px"><i class="fa fa-university"></i></a></li>\n');
    $(".customSubNav .visitorTabs").find('li.navTab.search.Popup.PopupContainerControl').appendTo(".customSubNav .visitorTabs");
    $(".customBread").css('padding-bottom', '48px');
    $(".breadBoxTop").css('margin-right', '0px');
    $(".customSubNav").css('top', '55px');
    $(".customSubNav").css('width', '294px');

    
    if($("#widget-72").length > 0) {
        $("#widget-72").remove();
        var $widget73 = $("#widget-73");
        $widget73.detach().appendTo(".isLast");
        $widget73.css({"position":"relative", "top":"-20px"});
    }
})();