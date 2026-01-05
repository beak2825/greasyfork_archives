// ==UserScript==
// @name          URL Stripper
// @namespace     DoomTay
// @description   Takes offsite links that stick the original URL into an onsite link with extra parameters and changes the href to that original URL.
// @version       1.1.9
// @include       *
// @exclude       *iqdb.org/*
// @exclude       *saucenao.com/*
// @exclude       *imgops.com/*
// @exclude       *.svg

// @downloadURL https://update.greasyfork.org/scripts/12996/URL%20Stripper.user.js
// @updateURL https://update.greasyfork.org/scripts/12996/URL%20Stripper.meta.js
// ==/UserScript==

var links = document.links;

var isInArchive = window.location.hostname == "web.archive.org" || window.location.hostname == "wayback.archive.org";

var specialCases = [];
	specialCases["https://www.youtube.com/redirect"] = "q";
	specialCases["http://www.amazon.com/exec/obidos"] = "path";
	specialCases["http://t.umblr.com/redirect"] = "z";
	specialCases["http://image.baidu.com/search/redirect"] = "objurl";
	specialCases["http://l.facebook.com/"] = "u";

var blacklist = ["tineye.com/search","saucenao.com/search.php","web.archive.org/web/form-submit.jsp","wayback/available","iqdb.org","amazon.com","smashbros.com/wii/en_us/notify.html","multiez.com","regex.info"];

var archivePrefix = isInArchive ? /\/web\/\d{1,14}\//.exec(window.location.href) : "";

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if(mutation.target.nodeName == "A" && !blacklist.some(elem => mutation.target.href.includes(elem))) replaceURL(mutation.target);
	});
});

var config = { attributes: true, childList: true, subtree: true };
observer.observe(document.body, config);

for(var l = 0; l < links.length; l++)
{
	if(blacklist.some(elem => links[l].href.includes(elem))) continue;
	replaceURL(links[l]);
}

function replaceURL(link)
{
	if(link.href.indexOf("r.search.yahoo.com") > -1 && link.href.split(";") != link.href)
	{
		var URLBits = {};
		var splitURL = link.href.split(";");
		var params;
		if(splitURL[0].indexOf("/RU=") > -1 ) params = splitURL[0].split("/");
		else params = splitURL[1].split("/");

		for(var i = 0; i < params.length; i++)
		{
			var splitParameter = params[i].split("=");
			if(splitParameter[1] == undefined) continue;
			URLBits[splitParameter[0]] = decodeURIComponent(splitParameter[1]);
		}
		if(URLBits.hasOwnProperty("RU")) link.href = URLBits["RU"];
	}
	var testURL = URLToObject(link.href);
	if(testURL == null) return;
	if(link.href.substring(link.href.indexOf("?") + 1).indexOf("http") == 0)
	{
		var strippedURL = link.href.substring(link.href.indexOf("?") + 1);
		while(strippedURL.indexOf("%") > -1) strippedURL = decodeURIComponent(strippedURL);
		link.href = archivePrefix + strippedURL;
		return;
	}
	if(specialCases.hasOwnProperty(testURL.base))
	{
		link.href = archivePrefix + testURL[specialCases[testURL.base]];
		return;
	}
	if(link.href.indexOf("r.msn.com") > -1)
	{
		link.href = testURL.u;
		return;
	}
	if(testURL.hasOwnProperty("url")) link.href = archivePrefix + testURL.url;
}

function URLToObject(url)
{
	var URLBits = {};

	var splitURL = [url.substring(0,url.indexOf("?")),url.substring(url.indexOf("?") + 1)];

	if(splitURL[0] == "") return null;
	URLBits.base = splitURL[0];
	var params = splitURL[1].split("&");

	for(var i = 0; i < params.length; i++)
	{
		var splitParameter = params[i].split("=");
		if(splitParameter[1] == undefined) continue;
		URLBits[splitParameter[0].toLowerCase()] = splitParameter[1];
		while(URLBits[splitParameter[0].toLowerCase()].toLowerCase().includes("%2f") || URLBits[splitParameter[0].toLowerCase()].toLowerCase().includes("%3f")) URLBits[splitParameter[0].toLowerCase()] = decodeURIComponent(URLBits[splitParameter[0].toLowerCase()]);
	}

	return URLBits;
}