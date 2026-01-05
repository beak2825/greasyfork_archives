// ==UserScript==
// @name         Jon's pG Spaghetti Fix - BETA
// @namespace    http://jonhasacat.com/
// @version      0.2.3
// @description  Fix pG UI because Abdul can't code
// @author       Jonhasacat
// @match        https://www.prestige-gaming.org/*
// @exclude      https://www.prestige-gaming.org/donate/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23375/Jon%27s%20pG%20Spaghetti%20Fix%20-%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/23375/Jon%27s%20pG%20Spaghetti%20Fix%20-%20BETA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".customSubNav .visitorTabs a").css("display", "inline-block");
    $(".customSubNav .visitorTabs").append('<li class="navTab bans2" style="display: inline-block"><a href="bans/" class="navLink NoPopupGadget" style="display: inline-block"><i class="fa fa-university"></i></a></li>\n');
    $(".customSubNav .visitorTabs").append('<li class="navTab app" style="display: inline-block"><a href="application/" class="navLink NoPopupGadget" style="display: inline-block"><i class="fa fa-square"></i></a></li>\n');
    $(".customSubNav .visitorTabs").append('<li class="navTab whatsnew" style="display: inline-block"><a href="find-new/posts" class="navLink NoPopupGadget" style="display: inline-block"><i class="fa fa-file"></i></a></li>\n');

    var sidebar = $(".sidebar");
    if ($(".sidebar #taigachat_box").length > 0) {
        console.log($(".pageWidth").offset().left - 370 + "px");
        sidebar.css("position", "absolute");
        sidebar.css("top", "50px");
        sidebar.css("right", ($(".pageWidth").offset().left - 370).toString() +"px");
        sidebar.css("width", "350px");
        sidebar.css("padding", "10px");
        sidebar.css("background-color", "#DDD");
        sidebar.css("border-radius", "0 0 15px 0");
        $(".mainContent").css("margin-right", "0");
        $("#content #taigachat_box").css("height", "500px");
    }
    $(".mainTabs.navTabs .publicTabs .navTab").css("width", "110px");
    $("#navigation .pageContent").css("height", "49px");
    var nav = $(".customSubNav");
    $("#logoBlock").hide();
    $("#headerMover #headerProxy").css("height", "49px");
    //$("#headerMover #headerProxy").css("position", "fixed");
    $("#header").css("position", "fixed");
    $("#header").css("z-index", "999");
    nav.css("position", "fixed");
    nav.css("top", "7px");
    nav.css("right", ($(".mainTabs.navTabs").offset().left)+"px");
    nav.css("width", "300px");
    nav.css("z-index", "1000");
    $(".breadBoxTop").css("margin-right", "0");
})();