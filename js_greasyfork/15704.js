// ==UserScript==
// @name        KissAnime Direct Download
// @namespace   KickAnimeDirect
// @description Displays direct download links for KissAnime (kissanime.to) episodes.
// @include     https://kissanime.to/Anime/*
// @version     1
// @grant       none
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/15704/KissAnime%20Direct%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/15704/KissAnime%20Direct%20Download.meta.js
// ==/UserScript==

//var baseURL = "https://kissanime.to";
$.getScript("https://kissanime.com/Scripts/asp.js");

function getLink(element, url) {
  $.ajax({ url: "https://kissanime.to"+url,
           success: function(result) {
             eval($(result));
             var start = result.search("var wra");
             var end = result.search("document.write");
             eval(result.substring(start, end));
             $(element).replaceWith(wra.replace("Mobile / Download (Save link as...): ", ""));
           }});
}

$("body").append($("<script />", {
  html: document.createTextNode(getLink)
}));

var episodes = $("table.listing > tbody > tr > td > a");

episodes.each(function () {
  $(this).parent().append("(<a style='cursor: pointer' onClick='getLink(this, \""+$(this).attr("href")+"\")'>get links</a>)");
});
