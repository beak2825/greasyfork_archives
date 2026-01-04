// ==UserScript==
// @name            WME GPID finder
// @version			0.07
// @authorCZ		MajkiiTelini
// @description		Finds all Google Places IDs in Waze Map Editor
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @run-at			document-end
// @namespace		https://greasyfork.org/cs/users/110192
// @downloadURL https://update.greasyfork.org/scripts/32508/WME%20GPID%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/32508/WME%20GPID%20finder.meta.js
// ==/UserScript==

var W;
var I18n;
init();

function init(e) {
	W = unsafeWindow.W;
	if (e && e.user === null) {
		return;
	}
	if (typeof W === "undefined" || typeof W.loginManager === "undefined") {
		setTimeout(init, 100);
		return;
	}
	if (!W.loginManager.user) {
		W.loginManager.events.register("login", null, init);
		W.loginManager.events.register("loginStatus", null, init);
	}
	Timer();
}

function ButtonClickEventHandler() {
	return function() {
		if (W.selectionManager.getSelectedFeatures()[0].model.type == "venue") {
			var venueID = W.selectionManager.getSelectedFeatures()[0].model.attributes.id;
			var oldExternalProviderID = W.model.venues.getByIds([venueID])[0].attributes.externalProviderIDs.map(function(a) {return a.attributes.id;}).join('","');
			var newGPID = prompt("Zadej GooglePlace ID, případně více odděleno čárkou");
			if (newGPID !== "") {
				var externalProviderID = ((oldExternalProviderID === '') ? '' : oldExternalProviderID + '","') + newGPID;
				$.ajax({
					async: true,
					method: 'post',
					url: '/row-Descartes/app/Features?language=' + I18n.locale + '&bbox=0%2C0%2C0%2C0&ignoreWarnings=',
					data: '{"actions":{"name":"CompositeAction","_subActions":[{"_objectType":"venue","action":"UPDATE","attributes":{"externalProviderIDs":["' + externalProviderID + '"],"id":"' + venueID + '"}}]}}',
					dataType: 'json',
					contentType: 'application/json',
					global: false,
					headers: {
						'x-csrf-token': getCookie('_csrf_token')
					}
				});
			}
		}
	};
}

var Timer = function() {
	setTimeout(function(){
		if (document.getElementById("landmark-edit-general") !== null) {
			var extProvs = document.getElementsByClassName("external-providers-view");
			var isDisplayed = (document.getElementById("GPIDFinder") !== null);
			if (extProvs.length > 0 & !isDisplayed) {
				var extProvElement = extProvs[0];
				var GPIDfinder = document.createElement("div");
				GPIDfinder.id = "GPIDFinder";
				var WazePermalink = $('.WazeControlPermalink a.permalink').attr('href');
				var wMap = WazePermalink ?JSON.parse('{"' + WazePermalink.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) { return key === "" ? value : decodeURIComponent(value); }):{};
				var lat = wMap.lat;
				var lon = wMap.lon;
				var zoom = Number(wMap.zoom) + 12;
				var a = document.createElement('a');
				var linkText = document.createTextNode("Otevři GPID finder");
				a.appendChild(linkText);
				a.href = "https://codepen.io/d2-mac/pen/xLpjwV?lon=" + lon + '&lat=' + lat + '&z=' + zoom;
				a.target = "_blank";
				GPIDfinder.appendChild(a);
				extProvElement.appendChild(GPIDfinder);
				var button = document.createElement("button");
				var buttonText = document.createTextNode("Přidej GPID natvrdo!");
				button.appendChild(buttonText);
				extProvElement.appendChild(button);
				button.addEventListener("click", ButtonClickEventHandler());
				isDisplayed = true;
			}
		}
		Timer();
	},300);
};

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}