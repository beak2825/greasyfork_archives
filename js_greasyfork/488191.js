// ==UserScript==
// @name            Usuń reklamy Allegro
// @namespace       egzumer
// @version         0.1.0.0
// @description     Usuwa wszystkie reklamy na Allegro.pl, które nie są blokowane przez zwykłe blokery reklam, np. "Sponsorowane produkty" i "sponsorowane" boksy.
// @author          egzumer
// @match           *://allegro.pl/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=allegro.pl
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/488191/Usu%C5%84%20reklamy%20Allegro.user.js
// @updateURL https://update.greasyfork.org/scripts/488191/Usu%C5%84%20reklamy%20Allegro.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var running = false;
	var logging = false;

	function removeAllegroAds(mutations){
		if(mutations){
			var ignoreMutation = false;
			// skip removing ads when changes were made only to countdowns
			mutations.forEach(function(mutation) {
				var i, node;

				for (i = 0; i < mutation.addedNodes.length; i++) {
					node = mutation.addedNodes[i];
					if(!node.className || !node.className.indexOf || node.className.indexOf('countdown') !== -1){
						ignoreMutation = true;
						return;
					}
				}

				for (i = 0; i < mutation.removedNodes.length; i++) {
					node = mutation.removedNodes[i];
					if(!node.className || !node.className.indexOf || node.className.indexOf('countdown') !== -1){
						ignoreMutation = true;
						return;
					}
				}
			});
			if(ignoreMutation){
				// only countdown changes, skip
				return;
			}
		}

		if(running){
			// already running, skip
			return;
		}
		running = true;

		log("triggered");

		removeAllegroPremiumAds();
		removeAllegroOfferAds();
		removeAllegroSponsoredAds();
		removeAllegroAdArticles();

		running = false;
	}

	function log(...args){
		if(logging){
			console.log(...args);
		}
	}

	function removeAllegroOfferAds(){
		var adsBoxes = document.querySelectorAll('div[data-box-name*="_ads"],div[data-box-name="seoLazyBelowFilters"]');
		for(var i = 0; i < adsBoxes.length; ++i){
			if(adsBoxes[i].style.display === "none"){
				continue;
			}
			log("hiding offer ad", adsBoxes[i]);
			adsBoxes[i].style.display = "none";
		}
	}

	function removeAllegroSponsoredAds(){
        document.querySelectorAll('article').forEach(function(article) {
            article.querySelectorAll('span').forEach(function(span) {
                if (span.textContent.trim() === 'Sponsorowane') {
                    article.style.display = "none"
                }
            });
        });
	}

	function removeAllegroAdArticles(){
		var adArticles = document.querySelectorAll('article[data-analytics-view-label="showSponsoredItems"]');
		for(var i = 0; i < adArticles.length; ++i){
			if(adArticles[i].style.display === "none"){
				continue;
			}
			log("hiding ad article", adArticles[i]);
			adArticles[i].style.display = "none";
		}
	}

	function removeAllegroPremiumAds(){
		var premiumAds = document.querySelectorAll('div[data-box-name^="premium.with.dfp"],div[data-box-name="layout.advertisement"]');
		for(var i = 0; i < premiumAds.length; ++i){
			if(premiumAds[i].style.display === "none"){
				continue;
			}
			log("hiding premium ad", premiumAds[i]);
			premiumAds[i].style.display = "none";
		}
	}

	removeAllegroAds(null);
	//setInterval(removeAllegroAds, 10000);

	var observer = new MutationObserver(removeAllegroAds);
	var config = {childList: true, subtree: true, attributes: true};
	observer.observe(document.body, config);
})();