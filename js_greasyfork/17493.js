// ==UserScript==
// @name		Reddit - Block NSFW
// @description		Redirects NSFW subreddits to another site.
// @version		1.2
// @include		/^https?://.*\.reddit\.com/r/.*$/
// @license		GPLv3
// @grant		GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/10480
// @downloadURL https://update.greasyfork.org/scripts/17493/Reddit%20-%20Block%20NSFW.user.js
// @updateURL https://update.greasyfork.org/scripts/17493/Reddit%20-%20Block%20NSFW.meta.js
// ==/UserScript==

var redirectUrl = "https://www.reddit.com";	// Set this to url you want to redirect to.

var url = document.URL;

if (url.substring(url.length-1) != "/")
{
	url = url + "/";
}

var jsonUrl = url + "about.json";

GM_xmlhttpRequest
({
	method: "GET",
	url: jsonUrl,
	onload: function(response)
	{
		var json = JSON.parse(response.responseText);
		if (json.data.over18 || json[0].data.children[0].data.over_18)
		{
			window.location.replace(redirectUrl);
		}
	}
});