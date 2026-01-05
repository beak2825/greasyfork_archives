// ==UserScript==
// @name       Change Gfycat link to giant gif link
// @namespace  https://gfycat.com/
// @version    1.3
// @description Changes the link of the GFYCAT logo to the giant.gfycat.com/*.gif, not size restricted
// @match      http://gfycat.com/*
// @match      http://www.gfycat.com/*
// @match      https://gfycat.com/*
// @match      https://www.gfycat.com/*
// @copyright  2016
// @downloadURL https://update.greasyfork.org/scripts/19575/Change%20Gfycat%20link%20to%20giant%20gif%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/19575/Change%20Gfycat%20link%20to%20giant%20gif%20link.meta.js
// ==/UserScript==
document.addEventListener("DOMContentLoaded", stripCats, false );
 
if( document.readyState === "complete" ) {
    stripCats();
}
 
function stripCats() 
{
	var url = window.location.href;
	console.log("Getting the current URL: " + url);
		
	var s = url.indexOf(":");	
	url = url.slice(s + 3);	
	
	var e = url.indexOf("#");
	if(e > 0)
	{
		url = url.slice(0, e);
	}
	
	url = "https://giant." + url + ".gif";
	console.log("Setting new URL(s): " + url);

    Array.forEach( document.links, function(a) 
	{
        a.href = url;
    });
	console.log("Done."); 
}
