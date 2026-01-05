// ==UserScript==
// @name         Clean iTunes album pages
// @namespace    clean-itunes-album-pages
// @version      0.3
// @description  Cleans the iTunes Store album pages by deleting useless things, and adds a MusicBrainz search link.
// @author       Kazaam
// @match        *://itunes.apple.com/*
// @downloadURL https://update.greasyfork.org/scripts/24466/Clean%20iTunes%20album%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/24466/Clean%20iTunes%20album%20pages.meta.js
// ==/UserScript==


// Suppression des éléments inutiles
$("#ac-globalnav, .has-preview-capable-text, #itunes-detector, #productheader, .customer-reviews, .listeners-also-bought, #socialwrapper, .ac-gf-content").hide();
$(".view-in-itunes, .price, .view-more, .itunes-lp").hide();

// Redimensionnement des éléments
$("#main").css("width", "70%");
$("#content").css("width", "100%");
$(".center-stack").css("width", "1020px");
$(".top-albums-and-songs").css("width", "1020px");


$(".track-list").css("width", "inherit");
$(".tracklist-table").css("width", "100%");
$("td.name").css("width", "500px");
$("td.artist").css("width", "250px");

// Ajout des éléments
var searchURL = "http://musicbrainz.org/taglookup?tag-lookup.artist="+ $(".intro a h2").html() +"&tag-lookup.release=" + $(".intro h1").html();
$('#title .right').append('<img src="//musicbrainz.org/favicon.ico" style="vertical-align: middle;"> <a target="_blank" href="' + searchURL + '" class="search-musicbrainz">Search on MusicBrainz</a>');