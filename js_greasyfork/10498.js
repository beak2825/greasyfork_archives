// ==UserScript==
// @name            GruszkaCaps
// @author          Szab
// @description     Zamienia wszystkie wpisy @92Gruszka na pisane capsem
// @include	http://*.wykop.pl/*
// @include	https://*.wykop.pl/*
// @released        2015-06-18
// @updated         2015-06-18
// @grant       none
// @compatible      Greasemonkey
// @version 0.0.1.20151206211048
// @namespace https://greasyfork.org/users/12515
// @downloadURL https://update.greasyfork.org/scripts/10498/GruszkaCaps.user.js
// @updateURL https://update.greasyfork.org/scripts/10498/GruszkaCaps.meta.js
// ==/UserScript==
 
(function(){
 	var occurs = false;
	
	var allcaps = function() { 
		if(occurs) return;
		occurs = true;
		var entries = $('li.entry').find('a.profile[href="http://www.wykop.pl/ludzie/Gruszka92/"]');
		var li = entries.closest('li');
		var contents = li.find('> div > div > div.text > p');
		contents.each( function () {
			var text = $(this).html();
			var html = false;
			var newstring = "";
	
			for(var i = 0; i<text.length; i++) {
				var character = text.charAt(i);
	
				if(html && character == '>')
					html = false;
				else if(!html && character == '<' ) 
					html = true;
				else if(!html){
					character = character.toUpperCase();
				}
		
				newstring = newstring+character;
			}
	
			$(this).html(newstring);
		});
		occurs = false;
	};
 
	$(document).ready(function() {
		allcaps();
		
		$('div[id="content"]').bind('DOMNodeInserted', allcaps);
		$('li.entry').bind('DOMNodeInserted', allcaps);
	});
 
 
})();