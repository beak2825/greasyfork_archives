// ==UserScript==
// @name         TwitterInstaCleaner
// @namespace    https://greasyfork.org/en/scripts/19306-twitterinstacleaner
// @locale       en
// @version      1.3
// @description  Removes promoted-tweets(ADs), follow suggestions and trending tweets sections
// @author       DEP
// @icon         http://deplist.weebly.com/uploads/6/1/9/1/61911901/9557100_orig.png
// @icon64       http://deplist.weebly.com/uploads/6/1/9/1/61911901/9557100_orig.png
// @include      https://twitter.com/*
// @include      https://twitter.com/i/notifications/*
// @include      https://www.instagram.com/*
// @exclude      https://twitter.com/i/moments/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19306/TwitterInstaCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/19306/TwitterInstaCleaner.meta.js
// ==/UserScript==


this.$ = this.jQuery = jQuery.noConflict(true);



var strWhichPage = document.domain;
switch(strWhichPage) {
    case "twitter.com":
        var garbageRemoval = setInterval(removePromotedTweets, 1000);
        var garbageRemoval2 = setInterval(removeSideBars, 5000);
        break;
    case "www.instagram.com":
        var garbageRemoval3 = setInterval(removeSuggestionsForYou, 3000);
        break;
}

function removeSideBars () {
    var junkClass = ["dashboard-right", "flex-module", "Trends", "ProfileSidebar--withRightAlignment"];
    //var later = new Date();
    //var laterDate = later.setUTCFullYear('2099');
    //var cookieTwitter = getCookie('Twitter');
    //console.log("Current cookie count is at: " + cookieTwitter++);
    for (var j=0;j<junkClass.length;j++){
        var crap = document.getElementsByClassName(junkClass[j]);
        var basura = $(crap);
        if (basura) {
                basura.remove();
            }
        }
}

function removePromotedTweets () {
    //var laters = new Date();
    //var laterDates = laters.setUTCFullYear('2099');
    //var cookieTwitters = getCookie('Twitter');
    var tweetPromoted = $('li[data-item-type="who_to_follow_entry"]');
         if (tweetPromoted) {
             tweetPromoted.remove();
        }
    var garbage = $('.promoted-tweet');
    if (garbage) {
        garbage.remove();
    }
}
function removeSuggestionsForYou () {
    var ulList = document.getElementsByTagName("ul");
    var delSection = $( "h2:contains('Suggestions for You')" );
    if (delSection) { delSection.parentsUntil(ulList, "li").parent().remove(); }
}

/**function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) {
            return c.substring(name.length, c.length);
        }}
    return "";
}**/
