// ==UserScript==
// @name         Ziggo GO - Beschikbaar tot
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Beschikbaarheidsdatums op Ziggo GO, Telenet, UPC en Virgin GO
// @author       Flitskikker
// @match        *://*.ziggogo.tv/*
// @match        *://*.telenettv.be/*
// @match        *://*.upctv.ch/*
// @match        *://virgintvgo.virginmedia.com/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/392228/Ziggo%20GO%20-%20Beschikbaar%20tot.user.js
// @updateURL https://update.greasyfork.org/scripts/392228/Ziggo%20GO%20-%20Beschikbaar%20tot.meta.js
// ==/UserScript==
(function() {
	var currentTitle = "";
	var currentSubtitle = "";
	var currentMetadata = "";

	var writeDates = function(availableDate, expirationDate) {
		var daysRemaining = Math.floor(new Date(expirationDate - new Date()) / 1000 / 60 / 60 / 24);
		$(".item__synopsis").after('<div class="js-available-from item__metadata-item item__metadata-item--expiration-date">Beschikbaar sinds ' + availableDate.toLocaleString("nl-NL", { dateStyle: "full", timeStyle: "short" }) + '</div><div class="js-available-to item__metadata-item item__metadata-item--expiration-date">Beschikbaar tot ' + expirationDate.toLocaleString("nl-NL", { dateStyle: "full", timeStyle: "short" }) + ' (nog ' + (daysRemaining == 1 ? daysRemaining + ' dag' : daysRemaining + ' dagen') + ')</div>');
	};

	setInterval(function() {
		var title = $(".item__title").text();
		var subtitle = $(".item__secondary-title").text();
		var metadata = $(".item-primary-metadata").text();

		if (title != currentTitle || subtitle != currentSubtitle || metadata != currentMetadata) {
			currentTitle = title;
			currentSubtitle = subtitle;
			currentMetadata = metadata;

			// Use correct API
			var apiURL = "https://obo-prod.oesp.ziggogo.tv/oesp/v3/NL/nld/web";
			var newApiURL = apiURL;
			var isLegacy = false;

			if (window.location.href.includes("ziggogo.tv")) {
				if (window.location.href.includes("ziggogo.tv/obo")) {
					apiURL = "https://obo-prod.oesp.ziggogo.tv/oesp/v3/NL/nld/web";
				} else {
					apiURL = "https://web-api-pepper.horizon.tv/oesp/v2/NL/nld/web";
					newApiURL = "https://obo-prod.oesp.ziggogo.tv/oesp/v3/NL/nld/web";
					isLegacy = true;
				}
			} else if (window.location.href.includes("telenettv.be")) {
				apiURL = "https://obo-prod.oesp.telenettv.be/oesp/v3/BE/nld/web";
			} else if (window.location.href.includes("upctv.ch")) {
				if (window.location.href.includes("upctv.ch/obo")) {
					apiURL = "https://obo-prod.oesp.upctv.ch/oesp/v3/CH/eng/web";
				} else {
					apiURL = "https://web-api-pepper.horizon.tv/oesp/v2/CH/eng/web";
					newApiURL = "https://obo-prod.oesp.upctv.ch/oesp/v3/CH/eng/web";
					isLegacy = true;
				}
			} else if (window.location.href.includes("virgintvgo.virginmedia.com")) {
				apiURL = "https://web-api-pepper.horizon.tv/oesp/v3/GB/eng/web";
			}

			// Clean old divs
			$(".js-available-from").remove();
			$(".js-available-to").remove();

			// Get id from URL
			var urlSplit = window.location.href.split("/");

			if (urlSplit.length > 2) {
				if (urlSplit[urlSplit.length - 2].startsWith("crid:") || urlSplit[urlSplit.length - 2].startsWith("crid%3A")) {
					var crid = urlSplit[urlSplit.length - 2];

					if (crid.includes("-imi:") || crid.includes("-imi%3A") || crid.includes("%2Cimi%3A")) {
						// Recording
					} else {
						// VOD

						// Add date
						$.getJSON(apiURL + "/mediaitems/" + crid, function(data) {
							if (isLegacy) {
								var availableDate = new Date(data.availableDate || data.latestOfferStartDate);
								var parentTitle = $(".item__title").text();
								var title = data.title;
								var cast = data.cast;
								var directors = data.directors;

								$.getJSON(newApiURL + "/search-contents/" + escape(((title == parentTitle ? title : parentTitle + " " + title) + " " + (cast[0] || "") + " " + (directors[0] || "")).replace("/", "")) + "?clientType=209&contentSourceId=1&contentSourceId=101&contentSourceId=2&contentSourceId=3&filterVodAvailableNow=true&includeNotEntitled=true&maxResults=1&startResults=0", function(data) {
									$.getJSON(newApiURL + "/mediaitems/" + data[0].titleId, function(data) {
										var expirationDate = new Date(data.expirationDate || data.offersLatestExpirationDate);

										writeDates(availableDate, expirationDate);
									});
								});
							} else {
								var availableDate = new Date(data.availableDate || data.latestOfferStartDate);
								var expirationDate = new Date(data.expirationDate || data.offersLatestExpirationDate);

								writeDates(availableDate, expirationDate);
							}
						});
					}
				}
			}
		}
	}, 100);
})();