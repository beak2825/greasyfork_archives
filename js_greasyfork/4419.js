// ==UserScript==
// @name           SSL Accelerator
// @description    Speculatively performs SSL/TLS handshakes for hovered links to speed up browsing.
// @author         Anon
// @version        0.1.8
// @license        CC0 1.0 Universal; http://creativecommons.org/publicdomain/zero/1.0/
// @include        *
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.11.2/URI.min.js
// @grant          GM_xmlhttpRequest
// @namespace      https://greasyfork.org/users/4614
// @downloadURL https://update.greasyfork.org/scripts/4419/SSL%20Accelerator.user.js
// @updateURL https://update.greasyfork.org/scripts/4419/SSL%20Accelerator.meta.js
// ==/UserScript==

var alreadyHandshakedWith = {};
var requestStartTime = {};
var handshakeStartDelayTimerID = 0;

var currentHostname = (new URI(window.location.href)).hostname();

$("body").on("mouseenter mouseover", "a", function (e)
{
	if (e.target.href == undefined)
	{
		//console.log("Ignoring link with undefined HREF property.");
		return;
	}
	
	var targetURI = new URI(e.target.href);
	var targetProtocol = targetURI.protocol();
	var targetHostname = targetURI.hostname();
	
	if (targetProtocol != "https" ||  
		targetHostname == currentHostname)
	{
		return;
	}
	
	if (alreadyHandshakedWith[targetHostname])
	{
		//console.log("Already started or completed a handshake with \"" + targetHostname + "\".");
		return;
	}
	
	clearTimeout(handshakeStartDelayTimerID);
	
	handshakeStartDelayTimerID = setTimeout(function ()
	{
		console.log("Handshaking with \"" + targetHostname + "\"..");
		
		GM_xmlhttpRequest({
		
			method: "HEAD", 
			
			url: "https://" + targetHostname, 
			
			onload: function() 
			{
				console.log("Successfully handshaked with \"" + targetHostname + "\" in " + (Date.now() - requestStartTime[targetHostname]) + "ms.");
				requestStartTime[targetHostname] = undefined;
			},
			});
		
		requestStartTime[targetHostname] = Date.now();
		alreadyHandshakedWith[targetHostname] = true;
	}, 100);
});

$("body").on("mouseout", "a", function (e)
{
	clearTimeout(handshakeStartDelayTimerID);
});