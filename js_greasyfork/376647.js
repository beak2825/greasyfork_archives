// ==UserScript==
// @id			frankerfacez
// @name		FrankerFaceZ
// @namespace	FrankerFaceZ
//
// @version		1.58
//
// @description	FrankerFaceZ gives Twitch users custom chat emotes and introduces new features to improve the viewing experience.
// @homepage	https://www.frankerfacez.com/
// @icon		https://cdn.frankerfacez.com/script/icon32.png
// @icon64		https://cdn.frankerfacez.com/script/icon64.png
// @icon128		https://cdn.frankerfacez.com/script/icon128.png
//
// @include		http://twitch.tv/*
// @include		https://twitch.tv/*
// @include		http://*.twitch.tv/*
// @include		https://*.twitch.tv/*
//
// @exclude		http://api.twitch.tv/*
// @exclude		https://api.twitch.tv/*
//
// @grant		none
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/376647/FrankerFaceZ.user.js
// @updateURL https://update.greasyfork.org/scripts/376647/FrankerFaceZ.meta.js
// ==/UserScript==

function ffz_init()
{
	var script = document.createElement('script');

	script.id = 'ffz_script';
	script.type = 'text/javascript';
	script.src = '//cdn.frankerfacez.com/script/script.min.js?_=' + Date.now();

	if ( localStorage.ffzDebugMode == "true" ) {
		// Developer Mode is enabled. But is the server running? Check before
		// we include the script, otherwise someone could break their
		// experience and not be able to recover.
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "//localhost:8000/dev_server", true);
		xhr.onload = function(e) {
			var resp = JSON.parse(xhr.responseText);
			console.log("FFZ: Development Server is present. Version " + resp.version + " running from: " + resp.path);
			script.src = "//localhost:8000/script/script.js?_=" + Date.now();
			document.body.classList.add("ffz-dev");
			document.head.appendChild(script);
		};
		xhr.onerror = function(e) {
			console.log("FFZ: Development Server is not present. Using CDN.");
			document.head.appendChild(script);
		};
		return xhr.send(null);
	}

	document.head.appendChild(script);
}

ffz_init();