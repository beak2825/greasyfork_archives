// ==UserScript==
// @name        pomf2webarchive
// @namespace   periselene@yandex.com
// @include     *.tumblr.com/*
// @version     1
// @grant       GM_log
// @grant       GM_xmlhttpRequest 
// @description redirects pomf links to webarchive.org
// @downloadURL https://update.greasyfork.org/scripts/10973/pomf2webarchive.user.js
// @updateURL https://update.greasyfork.org/scripts/10973/pomf2webarchive.meta.js
// ==/UserScript==


var links = document.getElementsByTagName("a")
for (i = 0; i < links.length; i++) {
//     console.log("url" + links[i].href);
	var link = links[i];
	var url = link.href;
	var find = url.search("pomf"); 
	if(find >= 0)
	{
		console.log(url);
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://archive.org/wayback/available?url=" + url,
			context: {link: link}, 
			onload: getJson
		});
// 		$.ajax({
// 			dataType: 'json',
// 		url: 'http://archive.org/wayback/available?url=' + url ,
// 		crossDomain: true,
// 		success: getJson,
// 		link: link
// 		});
	}
}

function getJson(text)
{
// 	console.log(text.responseText);
// 	console.log("parsing");
	var json = JSON.parse(text.responseText);
	var link = text.context.link;
// 	console.log("parsed");
	if(json.archived_snapshots && json.archived_snapshots.closest && json.archived_snapshots.closest.url)
	{
		console.log("Found on WEBARCHIVE" );
		console.log(link.href + "->" + json.archived_snapshots.closest.url);
		link.href = json.archived_snapshots.closest.url;
		var watext = document.createTextNode("*Webarchive*.");
		link.appendChild(watext);
	}
	else
	{
		console.log("NOT found on WEBARCHIVE" );
	}
}