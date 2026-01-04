// ==UserScript==
// @name          Pixiv - No link warnings
// @namespace     Pixiv
// @version       1.1
// @description   No link warnings
// @author        Owyn
// @match         https://www.pixiv.net/*/artworks/*
// @run-at        document-end
// @grant		  none
// @downloadURL https://update.greasyfork.org/scripts/389654/Pixiv%20-%20No%20link%20warnings.user.js
// @updateURL https://update.greasyfork.org/scripts/389654/Pixiv%20-%20No%20link%20warnings.meta.js
// ==/UserScript==

var links_removed = 0;
function removeWarning()
{
	var links = document.querySelectorAll('a[href*="/jump.php?"]');
	for(var i = 0; i < links.length; i++)
	{
		links[i].href = decodeURIComponent(links[i].href.replace('https://www.pixiv.net/jump.php?', ''));
		links[i].target = "_self";
	}
	if(links_removed !== 0 && links.length === 0 )
	{
		console.log("removed warning from " + links_removed + " links");
	}
	else
	{
		links_removed = links.length;
		setTimeout(function() { removeWarning(); }, 1000);
	}
}

removeWarning();
