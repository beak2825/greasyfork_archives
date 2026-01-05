// ==UserScript==
// @name            IMDb actor rating
// @version         2
// @namespace	    imdb-actor-rating
// @include http://www.imdb.com/name/*
// @include https://www.imdb.com/name/*
// @include http://www.reddit.com/r/highdeas/comments/3cdfyv*
// @include https://www.reddit.com/r/highdeas/comments/3cdfyv*
// @grant		   GM_xmlhttpRequest
// @description IMDb actor rating.
// @downloadURL https://update.greasyfork.org/scripts/10846/IMDb%20actor%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/10846/IMDb%20actor%20rating.meta.js
// ==/UserScript==

if (document.location.pathname.indexOf("/name/") == 0) {
	new function() {
		var ratings = [];
		var rating_response_index = 0;
		
		function get_ratings(url) {
			GM_xmlhttpRequest({
				method: "GET",
				url: url,
				onload: function(response) {
					try {
						var rating = response.responseText.match(/<div class="titlePageSprite star-box-giga-star"> (\d(?:\.\d)) <\/div>/)[1];
					}
					catch (e) {}
					
					rating_response_index++;
					
					if (rating_response_index == films_starred_in.length)
						inject_ratings();
					else if (typeof rating != "undefined")
						ratings.push(parseFloat(rating));
				}
			})
		}
		
		function inject_ratings() {
			if (ratings.length == 0)
				return false;
			
			var sum = ratings.reduce(function(a, b) { return a + b });
			var avg = sum / ratings.length;
			var avg_float = Math.round(avg *10) /10;
			
			var div = document.createElement("div");
			div.className = "star-box giga-star";
			div.style.marginBottom = "0.7em";
			div.innerHTML = '\
				<div class="titlePageSprite star-box-giga-star"> '+ avg_float +' </div>\
				<div class="star-box-details" itemtype="http://schema.org/AggregateRating" itemscope="" itemprop="aggregateRating">\
					Ratings: <strong><span itemprop="ratingValue">'+ avg_float +'</span></strong><span class="mellow">/<span itemprop="bestRating">10</span></span><br>\
					Based on average Ratings of all works person acted in.<br>\
					<a href="javascript://" id="gm-share" data-gm-share-rating="'+ avg_float +'">Share this rating on the related Reddit post</a>\
				</div>\
				<div class="clear"></div>';
			
			var reference_node = document.querySelector('.infobar + hr');
			
			reference_node.parentNode.insertBefore(div, reference_node);
			reference_node.parentNode.removeChild(reference_node);
			
			div.addEventListener("click", function(event) {
				try { var name = "Rating of " + document.title.split(" - ")[0] + ": " + event.target.getAttribute("data-gm-share-rating") + " stars"; }
				catch(e) { var name = ""; }
				
				window.open("https://www.reddit.com/r/highdeas/comments/3cdfyv/imdb_tweak/", name)
			}, false)
		}
		
		var films_starred_in = document.querySelectorAll("#filmo-head-actor + div > div > b > a[href^='/title/tt'], #filmo-head-actress + div > div > b > a[href^='/title/tt']");
		for (var i = 0; i < films_starred_in.length; i++) {
			get_ratings(films_starred_in[i].href, films_starred_in.length)
		}
	}
}
else if (document.location.pathname.indexOf("/r/highdeas/comments/3cdfyv") == 0) {
	new function() {
		if (window.name.indexOf("Rating of") == 0) {
			var textarea = document.querySelector(".commentarea > form textarea");
			textarea.value = window.name +"\n"+ document.referrer.split("?")[0];
			window.name = "";
		}
	}
}