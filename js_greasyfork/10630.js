// ==UserScript==
// @name Primewire Host Highlighter
// @namespace PHH
// @description Automatically highlights the provider or host of your choice wherever it appears on a page listing, allowing you to quickly locate and click your favorite host to start watching.
// @version 1.1
// @run-at  document-ready
// @include https://www.primewire.ag/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author drhouse
// @icon https://www.primewire.ag/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/10630/Primewire%20Host%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/10630/Primewire%20Host%20Highlighter.meta.js
// ==/UserScript==

$(document).ready(function () {

	GM_registerMenuCommand("Primewire Host Highlighter", function(){
		var host = GM_getValue("highlight"); 
		host = prompt ('Enter hostname (case insensitive):', host);
		GM_setValue ("highlight", host);
		location.reload();
	});

	$.expr[":"].icontains = $.expr.createPseudo(function(arg) {
		return function( elem ) {
			return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
		};
	});

	var host = GM_getValue("highlight"); 
	if (!host){
		host = "vidzi";
	}

	var target = $('#first > table:icontains('+ host +')');
	$(target).css('background-color', 'yellow ');

	var targetx = $(target).find('.movie_version_link a').attr('href');
	var link = 'https://www.primewire.ag/' + targetx;

	var r = $('<input/>', { type: "button", id: "field", value: " "+ host +" " });
	$(r).css("position","fixed");
	$(r).css("top","20px");
	$(r).css("left","200px");
	$(r).insertBefore(".header_search");

	$( r ).click(function() {
		var win = window.open(link, '_blank');
		var title = $('body > div.container > div.main_body > div.col1 > div.index_container > div.stage_navigation.movie_navigation > h1 > span > a').text();
		var msg = new SpeechSynthesisUtterance('Now opening ' + title);
		window.speechSynthesis.speak(msg);
		GM_notification("Opening " + title, "AutoHost Play", null, function() {/* */});
	})

});
