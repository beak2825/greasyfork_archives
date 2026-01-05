// ==UserScript==
// @name        KAT - Create Summary From IMDb
// @namespace   Dr.YeTii
// @description Enlarges penis size by 500%. Buy now!
// @include     *kat.cr/*-i*/*
// @include     *imdb.com/title/tt*
// @include     *imdb.com/search/title?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10183/KAT%20-%20Create%20Summary%20From%20IMDb.user.js
// @updateURL https://update.greasyfork.org/scripts/10183/KAT%20-%20Create%20Summary%20From%20IMDb.meta.js
// ==/UserScript==

var url = window.location.pathname;
var elem;
var summary;
var summaryCustom = '<p style="color:#136CB2;cursor:pointer;display: inline-block;" id="setSummary">Set Custom Summary</p>';
var movieid;
/* PAGES */
if (/.*-i\d{5,7}\//.test(url)) { /* KAT Metadata Page */
	/* remove blankrefer :D */
	$('.dataList [href*="www.imdb.com/title/tt"]').attr('href', $('.dataList [href*="www.imdb.com/title/tt"]').attr('href').split('?')[1]);

	if (window.location.search.length > 6) {
		summary = (window.location.search.substring(6));
		movieid = $('.dataList [href*="imdb.com/title/tt"]').text();		

		if ($('.movieCover img[src=""]').length) { /* If no metadata */
	    	$('.dataList [href*="imdb.com/title/tt"]').after(' <i class="ka ka16 ka-torrent" id="generateMetadata"></i>'); /* For when was not auto */
	    	generateMetadata(); /* Auto generate some */
	    }else if (!$('#summary > div').length){ /* If summary isn't there */
	    	addSummary(); /* Auto create summary */
	    }
	} 
}else if(/\/synopsis$/.test(url)) {
	movieid = window.location.pathname.split('tt')[1].split('/')[0];

	$('#swiki_body').prepend(summaryCustom);
}else if (/\/title\/tt/.test(url)) {
	movieid = window.location.pathname.split('tt')[1].split('/')[0];

	if (!$('[itemprop="description"] [href^="/updates?"]').length) {
		var descOne = $('#overview-top [itemprop="description"]');
		$('#titleStoryLine [itemprop="description"] p *').remove();
		var secondSynopsis = $('#titleStoryLine [itemprop="description"] p').html()
		if (descOne.find('a[href*="/plotsummary?"]').length) { /* Read more */
			descOne.html(secondSynopsis);
			descOne.find('*').remove();
		}else{
			descOne.after('<div style="border: 1px solid rgb(219, 219, 219); border-radius: 5px; right: 4px; position: relative; padding-left: 2px; margin-right: -4px;">'+
				'<p style="color:#136CB2;cursor:pointer;" onclick="$(this).next().toggle();">Second Summary</p>'+
				'<p id="descTwo" itemprop="description">'+secondSynopsis+'</p>'+
				'</div>');
			$('#descTwo em.nobr').remove();
		}
		descOne.before('<a href="https://kat.cr/movie-i'+movieid+'?desc='+encodeURIComponent(descOne.text())+'">Summary One</a> | <a href="https://kat.cr/movie-i'+movieid+'?desc='+encodeURIComponent(secondSynopsis)+'">Summary Two</a> | '+summaryCustom)		
	}


}else{
	$('.detailed .title > a[href^="/title/tt"]').addClass('fadeOnClick');
	/* Hides ones with no posters (and IMDb Pro exclusives). You don't wanna write a summary if there is no poster! */
	$('.detailed [src="http://i.media-imdb.com/images/SF1f0a42ee1aa08d477a576fbbf7562eed/realm/feature.gif"], .detailed [href^="/r/"]').closest('.detailed').hide();
}

$(document).delegate('#setSummary', 'click', function() {
	var text = prompt('Enter Summary:' ,'');
	if (text)
		window.location = 'https://kat.cr/movie-i'+movieid+'?desc='+encodeURIComponent(text);
});
/* Events for IMDb Search Page */
$(document).delegate('.fadeOnClick', 'mouseup', function() {
	$(this).closest('.detailed').fadeOut(200);
});
/* Events for KAT Metadata Page */
$(document).delegate('#generateMetadata', 'click', function() {
	generateMetadata(); /* Mainly for non auto - pfft */
});
function generateMetadata() {
	$.ajax({
		type: "POST",
		url: '/moderator/torrent/changeimdb/f00344a0c480ecca8076237ca68fb0bb8e833e3b/', /* My personal test torrent, it doesn't update it tho */
		data: { ajax: 1, imdbid: movieid },
		dataType: "json",
		success: function(response) {
			addSummary(); /* Continue onto adding summary */
		}
	});
	return false;
}
function addSummary() {
	$.ajax({
		type: "POST",
		url: '/summary/create/movie/'+movieid+'/',
		data: { objectId: movieid, text: decodeURIComponent(summary) },
		dataType: "json",
		success: function(response) {
			window.location.reload(true); /* Reload page - DONE */
		}
	});
	return false;
}