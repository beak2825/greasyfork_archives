// ==UserScript==
// @name         Twitch Russian Filter
// @namespace    https://github.com/d3xtr0/
// @version      0.3
// @description  Filter russian streams from games.
// @author       d3xtr0
// @match        *.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19684/Twitch%20Russian%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/19684/Twitch%20Russian%20Filter.meta.js
// ==/UserScript==


(function() {
	'use strict';
	
	/*
	Tampermonkey: Go to settings > "Run only in main-frame": Yes
	*/
    
	// 0 => empty placeholder
	// 1 => no placeholder
	var toggleRemove = 0;
    
	// check every x ms for new streams
	var speed = 2000;
	
	// russian alphabet
	var keys = [
		"{ru", "[ru", "(ru", "ru]", "ru)", "ru}",
		"б", "в", "г", "д", "ж", "з", "и", "й", "п", "ф", "ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я"
	];
    
	$(function(){
		console.log("[Russian Filter] started");

		if(toggleRemove){
			$('head').append('<style>.tw-hidden{display:none;}</style>');
		}else{
			$('head').append('<style>.tw-hidden{visibility:hidden;}</style>');
		}

		var init = window.setInterval(function(){
		    	var content = $(".js-directory.tse-content .streams");
		    	var contheight =  content.height();

			if(content.length){
			    removeRus();
			}
		}, speed);

		function removeRus(){
			$(".stream.item").each(function(i){

				var meta = $(this).find(".meta").text().toLowerCase();

				for(var x = 0; x < keys.length; x++){
					if(meta.indexOf(keys[x]) >= 0) {
						$(this).addClass("tw-hidden");
						break;
					}
				}

			});
		}

	});
})();
