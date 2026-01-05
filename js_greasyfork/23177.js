// ==UserScript==
// @name				Kinopoisk Extender *Rutracker Only*
// @namespace			https://greasyfork.org/users/19952-xant1k-bt
// @description			Расширение функционала kinopoisk.ru 
// @version				0.1
// @author				Activa
// @require				https://code.jquery.com/jquery-1.12.4.min.js
// @include				https://kinopoisk.ru/film/*
// @include				https://www.kinopoisk.ru/film/*
// @downloadURL https://update.greasyfork.org/scripts/23177/Kinopoisk%20Extender%20%2ARutracker%20Only%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/23177/Kinopoisk%20Extender%20%2ARutracker%20Only%2A.meta.js
// ==/UserScript==

$(document).ready(function () {
    
var imgs = "https://www.google.com/s2/favicons?domain="; //alternative get favicons https://icons.duckduckgo.com/ip2/
var movie = $(".moviename-big");
movie = movie.parent().parent().parent().find("span").filter(function(index) { return $(".all", this).length == 0;}).html(); //en

if (  movie == ' (ТВ)' || movie ==' (видео)' || movie.indexOf('сериал') != -1)
{
var movie1 = $('span[style*="color: #666; font-size: 13px"]');
if (movie1.html()!=='')
{
movie = movie1.filter(function(index) { return $('span[style*="white-space: nowrap"]', this).length == 0;}).html();	
}
else
{
var lbl = $(".moviename-big[itemprop='name']");
var newLbl = $(lbl[0].outerHTML);
$("span", newLbl).remove();
movie=newLbl.text();
}
}

if (  movie == '')
{
var lbl = $(".moviename-big[itemprop='name']");
var newLbl = $(lbl[0].outerHTML);
$("span", newLbl).remove();
movie=newLbl.text();
}

var movie_enc=encodeURIComponent(movie); 
var year = $(".info a").html();
	
var link1 = '<a target="_blank" title="RuTracker.org" href="https://rutracker.org/forum/tracker.php?nm='+movie_enc+' '+year+'"><img src="'+imgs+'rutracker.org"></a>';

var post = '<br><div class="torrents">' + link1 + '</div>';

$('#div_mustsee_main').before(post);

$(".torrents").css({"padding-left":"5px","margin-top":"-20px", "margin-bottom":"10px","background-color":"#f2f2f2", "width":"125px", "text-align":"center"});
$(".torrents a").css({"margin":"7px"});
$(".torrents a img").css({"border":"0","margin-top":"3px","margin-bottom":"3px"});
});