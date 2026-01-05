// ==UserScript==
// @name       sgmod - sky map dev script
// @namespace  woot
// @version    1.1.1
// @description turns sky into a map dev
// @match      https://www.seriousgmod.com/*
// @copyright  2017+, stackoverflow
// @downloadURL https://update.greasyfork.org/scripts/26179/sgmod%20-%20sky%20map%20dev%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/26179/sgmod%20-%20sky%20map%20dev%20script.meta.js
// ==/UserScript==

var rank = "Map Developer";
var rankStyle = "style14";
var rankBanner = "bannerDev";
var forumName = "Rose♥";
var forumId = "138";
var currentRankStyle = "style19";

setInterval(function() {
   setTitles();
}, 1000);

$(function() {
    setTitles();
});

function setTitles(){
    $(".username:contains('" + forumName + "') > span").removeClass().addClass(rankStyle);
    if($('div[id="memberCard' + forumId + '"] > div[class="userInfo"] > div[class="cardUserBanner"]:contains(' + rank + ')').text() === ""){
         $('div[id="memberCard' + forumId + '"] > div[class="userInfo"] > div[class="cardUserBanner"]').prepend('<em itemprop="title" class="userBanner ' + rankBanner + ' " style="margin-right:5px"><span class="before"></span><strong>' + rank + '</strong><span class="after"></span></em>');
     }
    if($('li[data-author="' + forumName + '"] > div > div > h3[class="userText"]:contains(' + rank + ')').text() === ""){
        var insert = '<em itemprop="title" class="userBanner ' + rankBanner + ' wrapped"><span class="before"></span><strong>' + rank + '</strong><span class="after"></span></em>';
       $('li[data-author="' + forumName + '"] > div > div > h3[class="userText"] > em[class="userTitle"]').after(insert);
    }
    if(window.location.pathname.search(forumId) != -1){
        if($('div[class="userBanners"]:contains('+rank+')').text() === ""){
            $('div[class="userBanners"]').prepend('<em itemprop="title" class="userBanner ' + rankBanner + '"><span class="before"></span><strong>' + rank + '</strong><span class="after"></span></em>');
        }
     }
}