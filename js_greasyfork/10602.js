// ==UserScript==
// @name         RedRem
// @namespace    http://www.twprogrammers.com/
// @version      0.7
// @description  Converts links containing redirects to their resolved version.
// @author       Patrick Thomas (Timberwolf)
// @grant        none
// @include      http://www.free-tv-video-online.info/*
// @include      http*://www.webmasterworld.com/*
// @include      http://www.researchgate.net/*
// @exclude      http://www.free-tv-video-online.info/player/*
// @downloadURL https://update.greasyfork.org/scripts/10602/RedRem.user.js
// @updateURL https://update.greasyfork.org/scripts/10602/RedRem.meta.js
// ==/UserScript==

var orig_page_links = document.links;
var page_links = new Array(orig_page_links.length);
var newlinkhref, pglh, query, queryEncoded, tArray, tkvArray, i;

function anchorMatch(a)
{
	for(; a; a = a.parentNode) if(a.localName == 'a') return a;
	return null;
}
function getQueryParams(qs)
{
	query = {};
	qs = qs.substring(qs.indexOf('?')+1);
	if(getContains("&", qs))
	{
		tArray = qs.split("&");
		for(i = 0; i < tArray.length; i++)
		{
			tkvArray = tArray[i].split("=");
			query[tkvArray[0]] = decodeURIComponent(tkvArray[1]);
		}
	}
	else
	{
		tkvArray = qs.split("=");
		query[tkvArray[0]] = decodeURIComponent(tkvArray[1]);
	}
	return query;
}
function getQueryParamsEncoded(qs)
{
	queryEncoded = {};
	qs = qs.substring(qs.indexOf('?')+1);
	if(getContains("&", qs))
	{
		tArray = qs.split("&");
		for(i = 0; i < tArray.length; i++)
		{
			tkvArray = tArray[i].split("=");
			queryEncoded[tkvArray[0]] = tkvArray[1];
		}
	}
	else
	{
		tkvArray = qs.split("=");
		queryEncoded[tkvArray[0]] = tkvArray[1];
	}
	return queryEncoded;
}
function getContains(needle, haystack)
{
	return haystack.match(new RegExp(".*("+needle.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")+").*", "i"));
}
function directify()
{
	for (i=0; i < page_links.length; i++)
	{
		page_links[i] = orig_page_links[i];
	}
	for (i=0; i < page_links.length; i++)
	{
		pglh = page_links[i].href;
		getQueryParams(pglh);
		getQueryParamsEncoded(pglh);
		if (getContains("free-tv-video-online.info/interstitial2.html", pglh))
		{
			newlinkhref = query.lnk;
			console.log(page_links[i].href + " => " + newlinkhref);
			page_links[i].href = newlinkhref;
		}
		else if(pglh.match(/webmasterworld\.com(\/.*)?/i))
		{
			newlinkhref = queryEncoded.url;
			console.log(page_links[i].href + " => " + newlinkhref);
			page_links[i].href = newlinkhref;
		}
		else if(getContains("www.researchgate.net/go.Deref.html", pglh))
		{
			newlinkhref = query.url;
			console.log(page_links[i].href + " => " + newlinkhref);
			page_links[i].href = newlinkhref;
		}
	}
}
directify();