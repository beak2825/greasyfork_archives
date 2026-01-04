// ==UserScript==
// @name               HSReplay/HDT Deck Counters
// @namespace          https://greasyfork.org/en/users/10118-drhouse
// @version            1.0
// @run-at             document-end
// @description        Shows the numbers of cards, doubles and legendaries, next to HSReplay build names, that you need to complete them [#n=needed/#d=doubles/#★=legendaries]
// @include            https://hsreplay.net/decks/*
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require            https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @author             drhouse
// @downloadURL https://update.greasyfork.org/scripts/40859/HSReplayHDT%20Deck%20Counters.user.js
// @updateURL https://update.greasyfork.org/scripts/40859/HSReplayHDT%20Deck%20Counters.meta.js
// ==/UserScript==
//this.$ = this.jQuery = jQuery.noConflict(true);
//debugger;
/* global $ */

$(document).ready(function () {

		var missingcount = 0;
		var ownedcount = 0;
		var doubles = 0;
		var legends = 0;
		var rows = 0;
		var row = 0;
		var indexb = 0;
		var indexc = 0;

	function runit(){

		var list = $("#decks-container > div > div.deck-list-wrapper > div > ul");
		var missingx = $("#decks-container > div > div.deck-list-wrapper > div > ul > li");

		$(missingx).each( function (index, value) {

			missingcount = 0;
			doubles = 0;
			legends = 0;

			$(this).find("a > div > div.col-lg-6.col-md-7.col-sm-8.hidden-xs > ul > li").each(function (index, value) {
				indexc = index + 1;
				console.log("indexc: " + indexc)

				if($(this).attr('class') == 'missing-card'){
					missingcount = missingcount + 1;
					if($(this).find("div > a > div > span").text() == '×2')
						doubles = doubles + 1;
					if($(this).find("div > a > div > span").text() == '★')
						legends = legends + 1;

				}
			})
			var title = $(this).find(" a > div > div.col-lg-2.col-md-2.col-sm-2.col-xs-6 > span");
			$("<span> - " + missingcount + "n ( " + doubles + "d / " + legends + "★)</span>").appendTo(title);
		});
	};

	setTimeout(function() {
		runit()
	}, 500);

	$(window).on('hashchange',function(){ 
		setTimeout(function() {
			runit()
		}, 500);
	});

});







