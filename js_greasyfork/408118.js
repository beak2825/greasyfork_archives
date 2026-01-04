// ==UserScript==
// @name e621 darkmode
// @namespace http://tampermonkey.net/
// @version 0.4
// @description Much css
// @author LESHIB
// @match https://e621.net/*
// @match https://static1.e621.net/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/408118/e621%20darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/408118/e621%20darkmode.meta.js
// ==/UserScript==

(function() {
'use strict';
$("body").css({"outline": "none"});

$("article.post-preview.captioned").css({"height": "auto", "vertical-align": "text-top", "background": "#131313", "padding": "8px", "border-radius": "5px", "border": "1px solid #000000", "box-shadow": "0px 0px 5px black"});

$("article.post-preview .desc").css({"background-color": "#2d2d2d", "font-size": "80%", "margin-bottom": "0", "padding": "5px", "border": "1px solid black", "margin": "5px", "text-aslign": "center", "border-radius": "3px", "box-shadow": "0px 0px 5px black"});

$("article.post-preview img").css({"box-sizing": "border-box", "margin": "auto", "border-radius": "3px 3px 0 0", "object-fit": "initial", "max-width": "100%", "max-height": "100%"});

$("article.post-preview[data-file-ext=webm]>a:before").css({"background-color": "#252525", "border": "1px solid #9c9c9c", "color": "#a2a2a2", "position": "absolute", "left": ".2rem", "top": ".2rem", "text-align": "center", "padding": "2px", "font-size": "60%", "font-weight": "700", "content": "WEBM", "border-radius": "4px"});

$(".post-score-faves").css({"color": "#ff7777"});

$(".mode-view").css({"background": "#00000000"});

$("body").css({"background-color": "#000000d6", "font-family": "Arial, Helvetica, sans-serif"});

$("article.post-preview .post-score>span").css({"font-size": "12px"});

$("div#page aside#sidebar #search-box input[type=text]").css({"background": "#212121", "border": "1px solid black", "color": "white", "padding": "8px"});

$("div#page aside#sidebar #search-box button[type=submit]").css({"background": "#212121", "border": "1px solid black", "color": "white", "padding": "8px", "text-align": "center"});

$("div#page aside#sidebar>section").css({"background": "#00000069", "border-radius": "4px"});

$("ul > li").css({"padding": "4px"});

$(".post-count").css({"background": "#191919","padding": "4px","border": "1px solid black","border-radius": "4px"});

$("div#page aside#sidebar h1").css({"padding": "6px"});

$("header#top menu.main").css({"background-color": "#00000000"});

$("header#top").css({"background-color": "#00000000"});

$("header#top menu").css({"background-color": "#00000000"});

$("article.post-preview").css({"width": "180px"});

$(".category-7 a, .category-7 a:link, .category-7 a:visited, .ui-widget-content .category-7 a, .ui-widget-content .category-7 a:link, .ui-widget-content .category-7 a:visited, .ui-widget-content .ui-state-active a.tag-type-6.selected, .ui-widget-content a.tag-type-7, .ui-widget-content a.tag-type-7:link, .ui-widget-content a.tag-type-7:visited, a.tag-type-7, a.tag-type-7:link, a.tag-type-7:visited").css({"color": "#fff"});

$(".user_old_password, .user_password").css({"background": "#0000004d", "border": "1px solid black", "border-radius": "2px", "padding": "5px", "color": "grey"});

$("input.password").css({"background": "#0000004d", "border": "1px solid black", "border-radius": "2px", "padding": "5px", "color": "grey"});

$('.user_password_confirmation').css({"background": "#0000004d", "border": "1px solid black", "border-radius": "2px", "padding": "5px", "color": "grey"});

    $('.post-preview').each(function(){
        var data = $(this).attr("data-id");

        var img_data = $(this).attr("data-file-url");

        var btn_downld = $(this).append('<a style="cursor: pointer;" class="fav-btn-'+data+'" download  data-pid='+data+' >Download</a>');

        var img_split = img_data.split("/");

        img_split = img_split[6].split("/");


        $(".fav-btn-"+data+"").click(function(e) {
        var url = img_data;
           e.preventDefault();

            window.location.href = url;
        });



$(".fav-btn-"+data+"").prop("download", ""+img_split+"");

        $(".fav-btn-"+data+"").each(function(){
            $(this).click(function(){


        });
        });
    });


if(window.location.href.indexOf("password/edit") != -1)
{
$(".btn").css({"background": "#dc4c4ca1","border": "1px solid rgba(255, 0, 0,.3)", "border-radius": "4px", "padding": "8px", "transition": "0.3s", "width": "-webkit-fill-available", "color": "white"});
var val_1 = $(".btn").val('Change Password');
}


var meta = $('meta[name=current-user-id]').attr("content");

if(window.location.href.indexOf("users/"+meta+"/edit") != -1)
{
$("textarea.text").css({"background": "#0000004d", "border": "1px solid black", "border-radius": "2px", "padding": "5px", "color": "grey"});

$("input.numeric").css({"background": "#0000004d", "border": "1px solid black", "border-radius": "2px", "padding": "5px", "color": "grey"});

$("input[id=quick_search_name_matches]").css({"background": "#0000004d", "border": "1px solid black", "border-radius": "2px", "padding": "5px", "color": "grey"});

$("option").css({"color": "#da4747", "background": "black"});

$("select.time_zone, select.select").css({"background": "#0000004d", "border": "1px solid black", "border-radius": "2px", "padding": "5px", "color": "grey"});
$(".btn").css({"background": "#dc4c4ca1","border": "1px solid rgba(255, 0, 0,.3)", "border-radius": "4px", "padding": "8px", "transition": "0.3s", "width": "-webkit-fill-available", "color": "white"});
var val_2 = $(".btn").val('Update Info');
}





$("ul > li").hover(function() {

$(this).css({"background": "", "border-radius": "4px", "padding": "4px", "transition": "0.3s"});

}).mouseout(function() {
$(this).css("background-color","transparent");
});


$("a, a:link, a:visited").hover(function() {

$(this).css({"background": "#191919", "border-radius": "4px", "padding": "6px 10px", "border": "1px solid black", "color": "grey", "transition": "0.3s"});

}).mouseout(function() {

$(this).css({"background": "transparent", "border-radius": "4px", "border": "0", "color": "#ffee95", "padding": "6px 10px"});

});

$(".post-thumbnail-img").hover(function() {

$(this).css({"border-radius": "4px", "border": "1px solid grey", "transition": "0.3s"});
});


})();