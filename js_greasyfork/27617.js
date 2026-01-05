// ==UserScript==
// @name               New IMDB Message Boards - Moviechat
// @namespace          https://greasyfork.org/en/users/10118-drhouse
// @version            2.3.0
// @description        Directly integrated replacement on the IMDB message boards using moviechat.org, appears at bottom of all IMDB movie/tv page listings, includes millions of archived posts saved from before the boards closed.
// @run-at             document-ready
// @include            https://www.imdb.com/title/*
// @include            https://www.imdb.com/name/*
// @include            *://*.moviechat.org/*
// @include            *://moviechat.org/*
// @exclude            *://*.media-imdb.com/*
// @exclude            *://*.imdb.com/*/*/releaseinfo*
// @exclude            *://*.imdb.com/*/*/bio*
// @exclude            *://*.imdb.com/*/*/publicity*
// @exclude            *://*.imdb.com/*/*/otherworks*
// @exclude            *://*.imdb.com/*/*/awards*
// @exclude            *://*.imdb.com/*/*/mediaindex*
// @exclude            *://*.imdb.com/*/*/videogallery*
// @exclude            *://*.imdb.com/*/*/fullcredits*
// @exclude            *://*.imdb.com/*/*/plotsummary*
// @exclude            *://*.imdb.com/*/*/synopsis*
// @exclude            *://*.imdb.com/*/*/keywords*
// @exclude            *://*.imdb.com/*/*/parentalguide*
// @exclude            *://*.imdb.com/*/*/locations*
// @exclude            *://*.imdb.com/*/*/companycredits*
// @exclude            *://*.imdb.com/*/*/technical*
// @exclude            *://*.imdb.com/*/*/trivia*
// @exclude            *://*.imdb.com/*/*/soundtrack*
// @exclude            *://*.imdb.com/*/*/faq*
// @exclude            *://*.imdb.com/*/*/reviews*
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @resource imdbstyle https://greasyfork.org/scripts/29496-moviechat-org-on-imdb-tmdb-desktop-companion/code/MovieChatorg%20on%20IMDbTMDb%20-%20Desktop%20Companion.user.js
// @grant              GM_getResourceText
// @author             drhouse
// @contributor        RandomUsername404
// @license            CC-BY-NC-SA-4.0
// @icon               https://www.google.com/s2/favicons?domain=imdb.com
// @downloadURL https://update.greasyfork.org/scripts/27617/New%20IMDB%20Message%20Boards%20-%20Moviechat.user.js
// @updateURL https://update.greasyfork.org/scripts/27617/New%20IMDB%20Message%20Boards%20-%20Moviechat.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function () {
    var theparenturl = document.URL;
    if (theparenturl.indexOf("reference") != -1)
        theparenturl = theparenturl.replace('reference','');

    if (theparenturl.indexOf("combined") != -1)
        theparenturl = theparenturl.replace('combined','');

    var quest = theparenturl.split('?')[0];
    var parts = quest.split('/');
    var lastSegment = parts.pop() || parts.pop();

    if (lastSegment.indexOf("tt") != -1){
        var theurl = 'https://www.moviechat.org/movies/';
    }

    if (lastSegment.indexOf("nm") != -1){
        theurl = 'https://www.moviechat.org/';
    }

    var simple = (theurl + lastSegment);
    //console.info(simple);

    var chatdiv = $('<div></div>').css('display','block').css('overflow','hidden').css('position','relative').css('height','660px').css('width','640px');

    var lastart_new = $('section[cel_widget_id="StaticFeature_UserReviews"]')
    var lastart_new2 = $("#maindetails_center_bottom > div.article").last()

    setTimeout(function(){
        $(chatdiv).insertAfter(lastart_new);
        $(chatdiv).insertBefore(lastart_new2);
    }, 100); 


    //lazy else
    $(chatdiv).insertBefore('#tn15bot');

    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("id", "msgframe");
    ifrm.setAttribute("src", simple);
    ifrm.setAttribute("style", "scrolling=no;position=absolute;padding=0px");
    ifrm.setAttribute("frameborder", "0");
    ifrm.style.height = 600+"px";
    ifrm.style.width = 640+"px";
    $(ifrm).appendTo(chatdiv);

    $('body').css('background-color','#fff');
    $('.main').css('box-shadow','0px 0px 0px 0px');


    eval(GM_getResourceText("imdbstyle"))

});