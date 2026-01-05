// ==UserScript==
// @name         Simple Golem
// @namespace    eePhuT3Tah1iewiquoh5eoc4beeNohFo
// @version      1.1
// @description  Removes many elements on the golem start page and news articles, also shows all pages of multi page articles on a single page.
// @match        http://www.golem.de/
// @match        http://www.golem.de/news/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/11002/Simple%20Golem.user.js
// @updateURL https://update.greasyfork.org/scripts/11002/Simple%20Golem.meta.js
// ==/UserScript==

//
$("#screen > div:not(.g.g4.g-ie6)").remove();
$("#index-vica2").remove();
$("header nav").remove();
$("header form").remove();
$("a.icon-comments").remove();
$(".social-bar").remove();
$("div[id^='gvideo_']").remove();
$("div[id^='plista_widget']").remove();
$("div[class^='golem-gallery']").remove();
$("#screen > div.g.g4.g-ie6 img").width("100px");
$("#screen > div.g.g4.g-ie6 img").height("100px");
$("#screen > div.g.g4.g-ie6 ol.list-articles li").css("min-height","100px");
$("#screen > div.g.g4.g-ie6").width("960px");
//golem.de uses iframes for some add stuff, so I decided to just remove every iframe on the page
$( "iframe").remove();
//This one removes the comments
$("#comments").remove();

//Multipage stuff
if ( $( "ol.list-pages" ).length ) {
    var urls = [];
    //get the urls from the a href of each li
    $( "ol.list-pages" ).children().each(function(){
        urls.push($(this).find('a').attr('href'));
    });
    //The last link is next page, is not needed again
    urls.pop();
    for (var i = 0; i < urls.length; i++) {
        var divid = "plugin-page-" + i;
        //append a new div
        $("div.formatted").append('<div id="' + divid + '"></div>');
        //load the content of the page's article into the fresh div
        $('#' + divid).load(urls[i] + ' div.formatted');
    }
}

//Remove the multi page navigation
$("ol.list-pages").remove();
$("#table-jtoc").remove();