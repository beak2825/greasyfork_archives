// ==UserScript==
// @name               New IMDB Message Boards - Moviechat (alternate 2)
// @namespace          https://greasyfork.org/en/users/10118-drhouse
// @version            1.1
// @description        Directly integrated replacement on the IMDB message boards using moviechat.org, appears at bottom of all IMDB movie/tv page listings, includes many archived posts saved from before the boards closed.
// @run-at             document-start
// @include            http://www.imdb.com/*
// @include            http://www.moviechat.org/*
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author             drhouse
// @icon               http://www.moviechat.org/images/logo.png
// @downloadURL https://update.greasyfork.org/scripts/27662/New%20IMDB%20Message%20Boards%20-%20Moviechat%20%28alternate%202%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27662/New%20IMDB%20Message%20Boards%20-%20Moviechat%20%28alternate%202%29.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function () {
	var theparenturl = document.URL;
	var theurl = 'http://www.moviechat.org/movies/';

	var quest = theparenturl.split('?')[0];

	var parts = quest.split('/');
	var lastSegment = parts.pop() || parts.pop();

	var simple = (theurl + lastSegment);
	//console.log(simple);
	var chatdiv = $('<div class="article" id="boardsTeaser"><h2>Message Boards</h2>'+
					'Recent Posts'+
					'<br><br></div>').css('display','block').css('overflow','hidden').css('position','relative').css('height','600px').css('width','640px');

	if ($('#titleUserReviewsTeaser').length){
		$(chatdiv).insertAfter('#titleUserReviewsTeaser');
	} else {
		$(chatdiv).insertAfter('#titleFAQ');
	}

	var ifrm = document.createElement("iframe");
	ifrm.setAttribute("id", "msgframe");
	ifrm.setAttribute("src", simple);
	ifrm.setAttribute("style", "scrolling=no;position=absolute;padding=0px");
	ifrm.setAttribute("frameborder", "0");
	ifrm.style.width = 640+"px";
	ifrm.style.height = 600+"px";
	$(ifrm).appendTo(chatdiv);

	var title = $('#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1').text();
	var year = $('#titleYear > a').text();
	$('<div><a href='+simple+'>Discuss '+title+'</a> on the Moviechat message boards »</div><br><hr>').prependTo('.contribute');

	$('.contribute').css('border-top','1px;solid;#ccc');

});