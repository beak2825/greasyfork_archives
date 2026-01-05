// ==UserScript==
// @name       Change Gfycat link to giant gif link on reddit
// @namespace  https://gfycat.com/
// @version    1.8
// @description Changes any GFYCAT link to the giant.gfycat.com/*.gif, not size restricted
// @match      http://reddit.com/*
// @match      http://www.reddit.com/*
// @match      https://reddit.com/*
// @match      https://www.reddit.com/*
// @copyright  2016
// @downloadURL https://update.greasyfork.org/scripts/19579/Change%20Gfycat%20link%20to%20giant%20gif%20link%20on%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/19579/Change%20Gfycat%20link%20to%20giant%20gif%20link%20on%20reddit.meta.js
// ==/UserScript==
document.addEventListener("DOMContentLoaded", stripCats, false );
 
if( document.readyState === "complete" ) {
    stripCats();
}
 
function stripCats() 
{
    Array.forEach( document.links, function(a) 
	{
	    var url = a.href;
	    
	    var s = url.indexOf("gfycat.com/");	
	    if(s > 0)
	    {
	        url = url.slice(s + 11);	    
			console.log("Gfycat ID found: " + url);
	    }
	    else
	    {
	        return;     
	    }
	    	
	    var e1 = url.indexOf("#");
	    if(e1 > 0)
	    {
		    url = url.slice(0, e1);
	    }
	    var e2 = url.indexOf(".");
	    if(e2 > 0)
	    {
		    url = url.slice(0, e2);
	    }

	    url = "https://giant.gfycat.com/" + url + ".gif";
	    
		if(url.indexOf("giant.gfycat.com/.gif") > 0)
		{
			return;
		}
		else
		{	
		    a.href = url;
			console.log("New URL: " + url);
		}
    });
	console.log("Done."); 
}
