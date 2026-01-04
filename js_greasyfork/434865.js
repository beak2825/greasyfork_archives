// ==UserScript==
// @name        Gallery Mode for Lists - RateYourMusic
// @namespace   Violentmonkey Scripts
// @match       https://rateyourmusic.com/list/*
// @grant       none
// @version     1.1
// @author      ~iN008
// @description Creates a toggleable gallery for RYM lists.
// @downloadURL https://update.greasyfork.org/scripts/434865/Gallery%20Mode%20for%20Lists%20-%20RateYourMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/434865/Gallery%20Mode%20for%20Lists%20-%20RateYourMusic.meta.js
// ==/UserScript==

//Adds button to the right of likes, creates a gallery section hidden by default
$(".fav1.subtext").after("<div class='gallerybutton btn btn_small blue_btn' style=margin-left:1em>Toggle Gallery</div>");
$("div.row").append("<clear/><div class=gallery style=display:none;width:100%;clear:both;padding:1.5em;text-align:center></div>");

//Populates gallary with list images, removes any blanks and spaces accordingly
$("td.list_art").clone().removeClass('list_art').addClass('gallerymode').appendTo("div.gallery"); 
$("td.gallerymode:empty").remove();
$(".gallerymode").find("br", "span:empty").remove();
$(".gallerymode").children().width("150px");
$("td.gallerymode").each(function(){
    so_class = $(this).attr("class");
    so_val = $(this).html();
    so_new = $("<span style=display:inline-block;margin-right:0.3em;width:150px></span>").html(so_val);
    if (so_class.length > 0) {
        $(so_new).attr("class",so_class);
    }
    $(this).replaceWith(so_new);
});

//Toggle function
$("div.gallerybutton").click(function() {
  $("div.gallery").toggle();
});