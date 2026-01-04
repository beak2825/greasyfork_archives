// ==UserScript==
// @name        Personal FB
// @namespace   Pogmog
// @description Make all FB home links enforce "most recent" setting, remove theatre mode.
// @version     1.11
// @grant       none
// @include     http://www.facebook.com/*
// @include     https://www.facebook.com/*
// @downloadURL https://update.greasyfork.org/scripts/36065/Personal%20FB.user.js
// @updateURL https://update.greasyfork.org/scripts/36065/Personal%20FB.meta.js
// ==/UserScript==

var fb_links = document.links; 

for (var i=0; i<fb_links.length; i++)
{
	//Set up link to variable
	var p = fb_links[i].href;
  
	//If link is the raw FB link, replace.
	if(p == "https://www.facebook.com/" || p == "https://www.facebook.com/?ref=tn_tnmn" || p == "https://www.facebook.com/?ref=logo") 
	{
		//Change to "most recent".
		fb_links[i].href = "https://www.facebook.com/?sk=h_chr";
	}
  // Remove theatre mode
  if (p.includes("&force_theater=true")) fb_links[i].href = p.replace("&force_theater=true","&force_theater=false");
  
}

removeTheatre();

// Brutal enforcer (because FB is pretty fluid)
var chronos;
chronos = setInterval(chronosEvent, 3000);

function chronosEvent() {
  removeTheatre();
}


function removeTheatre()
{
	var window_url = window.location.href;
  if (window_url.includes("theater") && !window_url.includes("&set=pcb"))
  {
    var reset_url = false;
    if (window_url.includes("&force_theater=1"))
    {
      window_url = window_url.replace("&force_theater=1","&force_theater=0");
    	reset_url = true;
    }
    if (window_url.includes("&theater"))
    {
      window_url = window_url.replace("&theater","");
      reset_url = true;
    }
  	if (reset_url) 
    {
      window.location.href = window_url;
    }
  }
}


// I can't find the Greasemonkey dashboard, so I'm adding this here...
// Disable Facebook theatre:
var shit_popup_element = getElementsByClass("_3ixn");
shit_popup_element[0].style.display = "none";