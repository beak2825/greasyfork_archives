// ==UserScript==
// @name          Wayback Machine Favicon Fixer
// @namespace     DoomTay
// @description   Attempts to add a favicon to a site crawled by the Wayback Machine in the event one does not come up normally
// @version       1.3.0
// @include       http://web.archive.org/web/*
// @include       http://wayback.archive.org/web/*
// @include       https://web.archive.org/web/*
// @include       https://wayback.archive.org/web/*
// @exclude       /\*/
// @grant         GM_addElement
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/16411/Wayback%20Machine%20Favicon%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/16411/Wayback%20Machine%20Favicon%20Fixer.meta.js
// ==/UserScript==

var timestamp = /web\/(\d{1,14})/.exec(window.location.href)[1];

var originalDomain = /.+web\/\d+(?:[a-z][a-z]_)?\/((?:https?:\/\/)?[^\/]+)/.exec(window.location.href)[1];

if(!originalDomain.endsWith("/")) originalDomain = originalDomain + "/";

if(!document.querySelector("link[rel~='icon']") && document.contentType == "text/html") retrieveFavicon();

function retrieveFavicon()
{
	fetch("https://archive.org/wayback/available?url=" + encodeURIComponent(originalDomain + "favicon.ico") + "&timestamp=" + timestamp).then(result => result.json()).then(function(data)
	{
		if(data.archived_snapshots && data.archived_snapshots.closest && data.archived_snapshots.closest.available)
		{
			GM_addElement("link",
						  {type: "image/x-icon",
						  rel: "shortcut icon",
						  href: data.archived_snapshots.closest.url.replace("http:","https:").replace("/ht","mp_/ht")
			});
		}
	})
}