// ==UserScript==
// @name        Guzik do PB na FW
// @namespace   test
// @include     http://www.filmweb.pl/*
// @version     1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant       GM_addStyle
// @author      turban
// @description:en Adds thepiratebay.org search button on Filmweb
// @description Adds thepiratebay.org search button on Filmweb
// @downloadURL https://update.greasyfork.org/scripts/26459/Guzik%20do%20PB%20na%20FW.user.js
// @updateURL https://update.greasyfork.org/scripts/26459/Guzik%20do%20PB%20na%20FW.meta.js
// ==/UserScript==
GM_addStyle(".filmPage .hdr-super a{ float:left;height:30px;}");
GM_addStyle(".filmPage .hdr-super{ height:30px;}");
var titlePL = $('.filmTitle div h1 a').html();
var titleEN = $(".filmMainHeader h2").html();
var title = titleEN || titlePL;

var link = '<a class="PBButton" href="http://thepiratebay.se/search/' + title + '/0/99/0" target="_blank"><img src="http://png-5.findicons.com/files/icons/1185/flurry_ramp_champ/128/plunderin_pirates.png" style="width:30px;height:30px;"/></a>';
$('h1.filmTitle').prepend(link);