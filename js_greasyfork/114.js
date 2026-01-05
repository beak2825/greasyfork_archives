// ==UserScript==
// @name          directGelF
// @namespace     directGelF
// @version       1.81
// @description   direct link to all gelbooru images in search results+
// @homepage      https://greasyfork.org/ru/scripts/114-directgelf
// @run-at        document-end
// @grant         GM_openInTab
// @match         http://*.gelbooru.com/*
// @downloadURL https://update.greasyfork.org/scripts/114/directGelF.user.js
// @updateURL https://update.greasyfork.org/scripts/114/directGelF.meta.js
// ==/UserScript==

if (typeof GM_openInTab === "undefined")
{
	GM_openInTab = window.open;
}

if(document.location.hostname != "simg4.gelbooru.com")
{
	var els = document.getElementsByClassName("preview");

	for(var x = 0; x < els.length; x++) 
	{
		// Obtaining the final URL of the image
		var dir = els[x].src;
		dir = dir.split("thumbnails")[1] || dir.split("thumbs")[1]; // gelbooru sometimes can't decide one
		dir = dir.split('?')[0].replace("thumbnail_","");
		dir = "http://simg4.gelbooru.com//images" + dir;
		
		// Setting original link to right click
		els[x].id = els[x].parentNode.href; // save url
		els[x].setAttribute('oncontextmenu',"return false;"); // block menu
		els[x].addEventListener('contextmenu', function(aEvent) {GM_openInTab(this.id);window.focus();}, true, true); // R-Click

		// Setting the new href
		els[x].parentNode.href = dir;
	}
}
else  // file extension fix
{
	if(document.title.indexOf("404 ") == 0)
	{
		if(window.location.href.lastIndexOf(".jpg") != -1)
		{
			window.location.href = window.location.href.replace(".jpg", ".jpeg");
		}
		else if(window.location.href.lastIndexOf(".jpeg") != -1)
		{
			window.location.href = window.location.href.replace(".jpeg", ".png");
		}
		else if(window.location.href.lastIndexOf(".png") != -1)
		{
			window.location.href = window.location.href.replace(".png", ".gif");
		}
		else if(window.location.href.lastIndexOf(".gif") != -1)
		{
			window.location.href = window.location.href.replace(".gif", ".jpg");
		}
	}
}
