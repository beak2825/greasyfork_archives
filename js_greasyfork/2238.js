// ==UserScript==
// @name        DeviantArt More From Hider
// @description For those that open far more tabs than your browser can handle (stupid x86 memory limits), this script hides the "More From" sidebar elements but adds button that toggles them on and off
// @namespace   arof
// @include     *//*.deviantart.com/art/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2238/DeviantArt%20More%20From%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/2238/DeviantArt%20More%20From%20Hider.meta.js
// ==/UserScript==

function inject(func)
{
	var script = document.createElement("script");
	script.setAttribute("type", "application/javascript");
	script.appendChild(document.createTextNode(func));
	document.body.appendChild(script);
}

function hideAll()
{
	var array = document.getElementsByClassName("deviation-mlt-preview deviation-mlt-preview-b");
	for(var key in array)
	{
		var elem = array[key];
		elem.setAttribute("hidden", "true");
	}
}

function expandAll()
{
	var array = document.getElementsByClassName("deviation-mlt-preview deviation-mlt-preview-b");
	for(var key in array)
	{
		var elem = array[key];
		if (elem.hasAttribute("hidden"))
			elem.removeAttribute("hidden");
		else
			elem.setAttribute("hidden", "true");
	}
}

function insertButton()
{
	var metaActions = document.getElementsByClassName("dev-meta-actions")[0];
	inject(expandAll);

	var button = document.createElement("input");
	button.type = "button";
	button.value = 'Show "More Froms"';
	button.setAttribute("onclick", "expandAll()");

	metaActions.insertBefore(button, metaActions.firstChild);
}

insertButton();
hideAll();