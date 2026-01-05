// ==UserScript==
// @name         Sic 'Em 365 - Forum Tab Dropdown
// @version      1.2
// @description  Allow Forum tab to mimic other header tabs and dropdown on hover
// @author       trumpetbear
// @match        https://sicem365.com/*
// @match        http://sicem365.com/*
// @grant        none
// @namespace https://greasyfork.org/users/66085
// @downloadURL https://update.greasyfork.org/scripts/23195/Sic%20%27Em%20365%20-%20Forum%20Tab%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/23195/Sic%20%27Em%20365%20-%20Forum%20Tab%20Dropdown.meta.js
// ==/UserScript==


$(document).ready(function() {
    'use strict';
    $("#pageNav ul li").first().attr("class","has-sub");
    $("#pageNav ul li").first().append("<ul>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/1\">SicEm365 Premium Insider</a></li>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/19\">The Bear Cave</a></li><hr>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/2\">Football</a></li>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/3\">Men's Basketball</a></li>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/4\">Women's Basketball</a></li>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/5\">Baseball</a></li>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/10\">Ticket Swap & Tailgating</a></li>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/15\">Recruiting</a></li>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/6\">Other Sports</a></li><hr>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/14\">Cory Case Chit Chat</a></li>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/7\">Eric Treszoks Politics, Religion, Etc.</a></li>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/18\">Recruiting (Food, Drink, Travel)</a></li>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/12\">Networking & Jobs</a></li>");
    $("#pageNav ul li").first().find("ul").append("<li><a class=\"ajax\" href=\"\/forums/8\">Technical Support</a></li>");
    $("#pageNav li.has-sub, #pageStatus li.has-sub").hover(function() {
        var a = $(this);
        page.hideDashes(a);
        a.addClass("active");
    }, function() {
        page.dashTimer = window.setTimeout(page.hideDashes, 250);
    });
});