// ==UserScript==
// @name           Prefetch links when hovered
// @description    Speculatively prefetches hovered links to speed up browsing.
// @author         Anon
// @version        0.1.6
// @license        CC0 1.0 Universal; http://creativecommons.org/publicdomain/zero/1.0/
// @include        *
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant          GM_xmlhttpRequest
// @grant          GM_log
// @namespace      https://greasyfork.org/users/4614
// @downloadURL https://update.greasyfork.org/scripts/4397/Prefetch%20links%20when%20hovered.user.js
// @updateURL https://update.greasyfork.org/scripts/4397/Prefetch%20links%20when%20hovered.meta.js
// ==/UserScript==

var alreadyPrefetched = {};
var excludedPatterns = /sign[\s_-]?in|sign[\s_-]?out|log[\s_-]?in|log[\s_-]?out|sign[\s_-]?up|(un)?subscribe|(un)?register|edit|delete|purge|remove|send|submit|apply|confirm|cancel/i;
var prefetchStartTimerID = 0;
var currentRequest = null;

function testRegExp(regexp, strings)
{
	for (var i = 0; i < strings.length; i++)
	{
		if (regexp.test(strings[i]))
			return true;
	}
	
	return false;
}

$("body").on("mouseenter", "a", function (e)
{
	var anchorObject = $(e.target);
	var anchorHref = anchorObject.attr("href");
	var anchorInnerText = anchorObject.text();
	var anchorTitle = anchorObject.attr("title");
	
	if (anchorHref === undefined || alreadyPrefetched[anchorHref])
		return;
		
	if (/^#/.test(anchorHref) || testRegExp(excludedPatterns, [anchorHref, anchorInnerText, anchorTitle]))
	{
		GM_log("Did not prefetch \"" + anchorHref + "\" because it contained an excluded pattern."); 
		
		return;
	}
	
	clearTimeout(prefetchStartTimerID);
	
	prefetchStartTimerID = setTimeout(function ()
	{
		GM_log("Prefetching \"" + anchorHref + "\"..");
		
		currentRequest = GM_xmlhttpRequest({ 
			method: "GET", 
			url: anchorHref, 
			onload: function() 
			{
				GM_log("Successfuly prefetched \"" + anchorHref + "\".");
				
				alreadyPrefetched[anchorHref] = true;
				currentRequest = null;
			},
			
			onabort: function()
			{
				GM_log("Aborted prefetching \"" + anchorHref + "\".");
			}
			});
	}, 200);
});

$("body").on("mouseout", "a", function (e)
{
	if (currentRequest)
	{
		GM_log("Aborting current request..");
		currentRequest.abort();
		currentRequest = null;
	}
	
	clearTimeout(prefetchStartTimerID);
});
