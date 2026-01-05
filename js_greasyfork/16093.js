// ==UserScript==
// @name         News in sidebar by Volca780
// @namespace    https://realitygaming.fr/*
// @version      1.0
// @description  For read the news
// @author       Volca780
// @match        https://realitygaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16093/News%20in%20sidebar%20by%20Volca780.user.js
// @updateURL https://update.greasyfork.org/scripts/16093/News%20in%20sidebar%20by%20Volca780.meta.js
// ==/UserScript==

$.ajax({
type: "GET",
url: "https://realitygaming.fr/forums/-/index.rss",
dataType: "xml",
success: function(xml){
	$('<div class="section"><div class="secondaryContent"><h3>Nouveaux posts</h3><div class="pairsJustified" id="news"></div></div>').appendTo('.sidebar');
	$(xml).find('item').each(function(){
							var title 	= $(this).find('title').text(),
								author 	= $(this).find('creator').text(),
								link	= $(this).find('link').text();
							$('#news').append('<span class="author"><b>'+ author +' :</b></span>');
							$('#news').append('<span class="title"><a href="'+ link +'">'+ title +'</span></a><br />');
						});
	}
});