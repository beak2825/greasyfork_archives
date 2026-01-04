// ==UserScript==
// @name         TM Country teams INT matches
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  highlight the international matches of the teams in your country
// @author       Andrizz aka Jimmy il Fenomeno (team ID = 3257254)
// @include      https://trophymanager.com/international-cup/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494008/TM%20Country%20teams%20INT%20matches.user.js
// @updateURL https://update.greasyfork.org/scripts/494008/TM%20Country%20teams%20INT%20matches.meta.js
// ==/UserScript==

var country = SESSION["country"];
$("li a.country_link").each(function(){
    var flag = $(this).attr("href").replace("/national-teams/","").replace("/","");
    if (flag == country) {
        $(this).parent().parent().parent().css("background","radial-gradient(#86f308,transparent)");
    }
});
$("td a.country_link").each(function(){
    var flag = $(this).attr("href").replace("/national-teams/","").replace("/","");
    if (flag == country) {
        $(this).parent().css("background","radial-gradient(#86f308,transparent)");
        if ($(this).parent().hasClass("hometeam_flag")) {
            $(this).parent().parent().parent().css("background","radial-gradient(#86f308,transparent)");
        }
    }
});