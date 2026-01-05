// ==UserScript==
// @name       RYM: Add Dropdown Menus
// @version    0.91
// @match      http://rateyourmusic.com/*
// @match      https://rateyourmusic.com/*
// @description adds dropdown menus
// @grant      GM_addStyle
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js 
// @copyright  2012+, Charlie Dingus
// @namespace https://greasyfork.org/users/2625
// @downloadURL https://update.greasyfork.org/scripts/4385/RYM%3A%20Add%20Dropdown%20Menus.user.js
// @updateURL https://update.greasyfork.org/scripts/4385/RYM%3A%20Add%20Dropdown%20Menus.meta.js
// ==/UserScript==



$("#navtop").css('zIndex', 1); 

var communityMenu = '<li class="dropmenu">'; 
communityMenu += '<a href="/boards/board_id=1">Music</a><a href="/boards/board_id=9">Polls/Games/Surveys</a>'; 
communityMenu += '<a href="/boards/board_id=2">Site Board</a><a href="/boards/board_id=3">Film</a>';
communityMenu += '<a href="/boards/board_id=9999">Video Games</a>';
communityMenu += '<a href="/boards/board_id=3001">Television</a>';
communityMenu += '<a href="/boards/board_id=3002">Literature & Art</a>';
communityMenu += '<a href="/boards/board_id=3003">Sports</a>';
communityMenu += '</li>';

var year = new Date().getFullYear();

var chartMenu = '<li class="dropmenu">'; 
chartMenu += '<a href="/customchart?chart_type=top&type=album&year='+year+'">'+year+' albums</a>';
chartMenu += '<a href="/customchart?chart_type=top&type=single&year='+year+'">'+year+' singles</a>';
chartMenu += '<a href="/films/chart">film charts</a>'; 
chartMenu += '<a href="/films/chart?year='+year+'">'+year+' films</a></li>';
$('#navtop li:nth-child(2)').addClass('topmenu').css('height', '30px').append(chartMenu); 
$('#navtop li:nth-child(4)').addClass('topmenu').css('height', '30px').append(communityMenu); 


GM_addStyle('li.topmenu li.dropmenu {  visibility: hidden; }'); 
GM_addStyle('li.dropmenu {  display: none; position: absolute; z-index: 1; font-size: 0.8em!important; background: #555!important; opacity:0.9;}'); 
GM_addStyle('li.topmenu:hover li.dropmenu {visibility: visible;}');