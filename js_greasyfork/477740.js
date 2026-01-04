// ==UserScript==
// @name         Mofo Revealer
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  Reveal those Black Market mofos
// @author       You
// @match        https://www.vinomofo.com/wines/*
// @match        https://www.vinomofo.com/events/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vinomofo.com
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477740/Mofo%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/477740/Mofo%20Revealer.meta.js
// ==/UserScript==

(function() {
	'use strict';

	$(() => startup(true));

	function productTitleH2 () { return $("h2[class^='Heading__StyledHeading'][class*='OfferHeroCard__StyledHeading']:first"); }
	function isProductPage() { return productTitleH2().length == 1};

	function startup(loadCached) {
		if(loadCached && (staleCache() || !getWines())) {
			fetch('https://api.jsonsilo.com/public/5d89a725-be62-469c-8745-37191c281eb6', { method: 'get' })
				.then((response) => response.json())
				.then((json) => {
					json.cacheDate = new Date();
					localStorage.setItem("wines", JSON.stringify(json));
					startup(false);
				})
				.catch(function() { localStorage.setItem("wines", JSON.stringify({})); });
			return;
		} else {
			//handle spa page changes
			let previousUrl = '';
			const observer = new MutationObserver(function(mutations) {
				if (location.href !== previousUrl) {
					previousUrl = location.href;
					setTimeout(() => setWineTitles(1, true), 500);
				}
			});
			const config = {subtree: true, childList: true};
			observer.observe(document, config);
			setupXMLHttpRequestIntercept();
		}
	}

	function setWineTitles(i, fetchWine) {
		if(isProductPage()) {
			var wineID = extractWineID($("title").text());
			if(wineID && window.location.href.includes(wineID)) {
				var wineTitle = getWineTitle(wineID);
				if(wineTitle) {
					var $h2 = $("h2[class^='Heading__StyledHeading'][class*='OfferHeroCard__StyledHeading']:first");
					setWineTitle($h2, wineTitle); //may need to delay with setTimeout
				} else if(fetchWine) {
					//get wine title from a page-data.json request
					var winePageDataURL = window.location.href.replace('www.vinomofo.com/','www.vinomofo.com/page-data/')+'page-data.json';
					fetch(winePageDataURL, { method: 'get', mode: 'cors', credentials: 'include' })
						.then((response) => response.json())
						.then((json) => {
						var originalName = json.result.pageContext.offer.sku.wines[0].originalName;
						var $h2 = $("h2[class^='Heading__StyledHeading'][class*='OfferHeroCard__StyledHeading']:first");
						setWineID(wineID, originalName);
						setWineTitle($h2, originalName);
					});
				}
			}
		}
		//set BM List Titles
		$("a:contains('Black Market'),a:contains('#')").each(function() {
			var wineID = extractWineID($(this).text());
			if(wineID) {
				var wineTitle = getWineTitle(wineID);
				if(wineTitle)
					setWineTitle($(this), wineTitle);
			}
		});
		if(i < 5) //repeat setting titles for a while to deal with slow page loads
			setTimeout(() => setWineTitles(i+1, false), i*500);
	}

	function extractWineID(wineText) {
		var textSplit = wineText.split('#')[1];
		if(textSplit)
			return textSplit.split(' ')[0].trim();
		return null;
	}

	function setWineTitle($target, originalname) {
		$target.text(originalname);
	}

	function staleCache() {
		var wines = getWines();
		if(!wines || !wines.cacheDate)
			return true;
		var cacheDate = new Date(wines.cacheDate);
		return cacheDate.setDate(cacheDate.getDate() + 1) < new Date();
	}

	// START Local storage functions
	function getWines() {
		var wines = localStorage.getItem("wines");
		return wines ? JSON.parse(wines) : null;
	}

	function setWineID(wineID, wineTitle) {
		if(!wineID)
			return;
		var wines = getWines();
		wines['_'+wineID.trim()] = wineTitle;
		console.log('set wine id \''+wineID.trim() + '\' to \'' + wineTitle + '\'');
		localStorage.setItem("wines", JSON.stringify(wines));
	}

	function getWineTitle(wineID) {
		var wines = getWines();
        if(!(wines && wineID))
            return null;
        if(wines['v2_'+wineID.trim()])
            return wines['v2_'+wineID.trim()].name;
        else
            return wines['_'+wineID.trim()];
	}
	
	window.findWine = function (search) {
		var wines = getWines();
        if(!(wines && search))
            return null;
		
		for (var key in wines) {
			if(key.startsWith('v2_')) {
                if(isNaN(search)) {
                    var wineName = wines[key].name.toLowerCase();
                    var terms = search.split(" ");
                    if(terms.every(t => wineName.includes(t.toLowerCase())))
                        console.log(wines[key].name + ' - '+ window.location.origin + wines[key].path);
                } else {
                    if(key.substr(3) == search) {
                        console.log(wines[key].name + ' - '+ window.location.origin + wines[key].path);
                    }
                }
			}
		}
	}
	// END Local storage functions


	//This will listen for calls to page-data.json and see if it can extract wine titles
	function setupXMLHttpRequestIntercept() {
		const dummySend = XMLHttpRequest.prototype.send;
		XMLHttpRequest.prototype.send = function () {
			const _onreadystatechange = this.onreadystatechange;
			this.onreadystatechange = function () {
				if(this.responseURL.endsWith('page-data.json')) {
					if (this.readyState === 4) {
						if (this.status === 200 || this.status === 1223) {
							var j = JSON.parse(this.responseText);
							if(j && j.result.pageContext.offer && j.result.pageContext.offer.sku && j.result.pageContext.offer.sku.wines && j.result.pageContext.offer.sku.wines[0]) {
								var path = j.path;
								var originalName = j.result.pageContext.offer.sku.wines[0].originalName;
								var wineID = extractWineID(j.result.pageContext.offer.name);
								if(wineID && !getWineTitle(wineID)) {
									setWineID(wineID, originalName);
									setWineTitle($("a[href='"+path+"']"), originalName);
								}
							}
						}
					}
				}
				if (_onreadystatechange) {
					_onreadystatechange.apply(this, arguments);
				}
			}
			dummySend.apply(this, arguments);
		}
	}

})();