// ==UserScript==
// @name        KissAnime KissCartoon KissAsian no-ads clean layout part 2
// @description used by part 1
// @namespace   hebiohime
// @match       *://kissanime.com/*
// @match       *://kisscartoon.me/*
// @match       *://kissanime.to/*
// @match       *://kissasian.com/*
// @match       *://kissmanga.com/*
// @match       *://readcomiconline.to/*
// @match       *://kissanime.ru/*
// @match       *://kisscartoon.se/*
// @match       *://kissasian.ch/*
// @match       *://kimcartoon.me/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://greasyfork.org/scripts/4900-kissanime-anti-adblock-blocker/code/KissAnime%20Anti-Adblock%20Blocker.user.js
// @version     2017.35
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14889/KissAnime%20KissCartoon%20KissAsian%20no-ads%20clean%20layout%20part%202.user.js
// @updateURL https://update.greasyfork.org/scripts/14889/KissAnime%20KissCartoon%20KissAsian%20no-ads%20clean%20layout%20part%202.meta.js
// ==/UserScript==

//scrolls video and eps buttons up, great for lower height monitors
//$("#selectEpisode")[0].scrollIntoView({behavior: "smooth",block: "start"});
//re-order selection bar
$("#selectEpisode").after($("#slcQualix")).before($("#selectPlayer"));
$("#selectEpisode").parent().parent().css("width","839px");
$("#selectPlayer").before($("#selectServer"));
$(".clear").each(function(i) {$(this).attr('id','clear' + (i));});
;$('.clear2').hide();


$("#switch").html('<img src="/Content/images/light_bulb_off.png"></img>').css("margin-top","5px");
$("div[style*='float: left; padding-left: 20px']").css("height","25px").after($("#switch"));
$("img[src*='/Content/images/genre.png']").parent().parent().remove();
$("div[style*='float: left; width: 85%; text-align: left']").remove();
$("#btnShowComments").parent().css("height","51px");
$("a[href*='/ChatRoom']").remove();
$("#videoAd").remove();