// ==UserScript==
// @name        Wayback Machine Short Frame Fixer
// @namespace   DoomTay
// @description Removes frame stretching for thin frames on Wayback Machine
// @include     http://web.archive.org/web/*
// @include     https://web.archive.org/web/*
// @version     1.0.4
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/13209/Wayback%20Machine%20Short%20Frame%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/13209/Wayback%20Machine%20Short%20Frame%20Fixer.meta.js
// ==/UserScript==

if(innerWidth < 800 || innerHeight < 100)
{
	var wmToolBar = document.getElementById("wm-ipp");
	if(wmToolBar) wmToolBar.parentNode.removeChild(wmToolBar);
	var minWidth = Array.prototype.find.call(document.getElementsByTagName("style"),style => style.innerHTML.includes("min-width:800px !important"));
	if(minWidth) minWidth.parentNode.removeChild(minWidth);
	var scripts = document.scripts;
	for(var c = scripts.length - 1; c >= 0; c--)
	{
		if(scripts[c].src.includes("/static/js/disclaim-element.js") || scripts[c].src.includes("/static/js/graph-calc.js") || scripts[c].innerHTML.includes("var wbPrefix = \"/web/\";") || scripts[c].innerHTML.includes("__wm.bt();")) scripts[c].parentNode.removeChild(scripts[c]);
	}
}