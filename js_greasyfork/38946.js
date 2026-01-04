// ==UserScript==
// @name Coloured Trello Kanban
// @namespace https://trello.com/
// @version 1.10
// @description Colour list for trello
// @match https://trello.com/*
// @require http://code.jquery.com/jquery-latest.js
// @author       Sally Zuo
// @downloadURL https://update.greasyfork.org/scripts/38946/Coloured%20Trello%20Kanban.user.js
// @updateURL https://update.greasyfork.org/scripts/38946/Coloured%20Trello%20Kanban.meta.js
// ==/UserScript==
// Ref: https://stawebteam.wordpress.com/2014/03/07/coloured-lists-in-trello/

var red = '#ff0000',
	blue = '#9ec4ff',
	green = '#dbffd1',
	grey = '#c4c4c4',
	black = '#898989',
	white = '#fff',
	yellow = '#ffd800',
	moccasin= '#ffe4b5',
	darkblue = '#00008b',
	lightblue = '#dbf3ff',
	lightorange = '#ffd396',
	pink = '#ffc0cb',
	orange = '#ff8300',
	limegreen = '#32cd32',
	lightseagreen = '#20b2aa',
	purple = '#4b0082';

$('body').hover(function () {
      $("h2:contains('Sprint Backlog')").css('color', white).parents('.list').css('background', moccasin);
	$("h2:contains('BA In Progress')").css('color', white).parents('.list').css('background', pink);
	$("h2:contains('BA Done')").css('color', white).parents('.list').css('background', blue);
	$("h2:contains('DEV In Progress')").css('color', white).parents('.list').css('background', green);
	$("h2:contains('DEV Done')").css('color', white).parents('.list').css('background', lightseagreen);
	$("h2:contains('QA In Progress')").css('color', white).parents('.list').css('background', grey);
	$("h2:contains('QA Done')").css('color', white).parents('.list').css('background', limegreen);
	$(".card-short-id").append(" ").removeClass("hide").css('color', purple );
});