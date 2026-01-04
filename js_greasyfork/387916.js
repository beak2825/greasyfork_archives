// ==UserScript==
// @name          Wide Hentai 2019
// @namespace     widee-hentai
// @version       2019.07.27
// @description   Wide E-Hentai and Exhentai - support for wide 1920px monitors
// @match         http://e-hentai.org/*
// @match         http://exhentai.org/*
// @exclude       http://e-hentai.org/s/*
// @exclude       http://exhentai.org/s/*
// @match         https://e-hentai.org/*
// @match         https://exhentai.org/*
// @exclude       https://e-hentai.org/s/*
// @exclude       https://exhentai.org/s/*
// @run-at        document-end
// @grant         none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/387916/Wide%20Hentai%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/387916/Wide%20Hentai%202019.meta.js
// ==/UserScript==

function $(id) {return document.getElementById(id);}
function c(id) {return document.getElementsByClassName(id);}
if(window.location.pathname.indexOf("/g/") != 0)
{
	c("ido")[0].style.maxWidth = "1895px";
    c("itg gld")[0].style = "grid-template-columns: repeat(7,1fr)";
}
else // /g/
{
	c("ptt")[0].style.margin = "45px auto 2px";
	if(c("gdtl").length != 0) // large thumbs hathperk
	{
		$("gdt").style.maxWidth = "1890px";
		var im = c("gdtl");
		for(var i=0; i< im.length; i++)
		{
			im[i].style.width = "234px";
		}
	}
	else
	{
		$("gdt").style.maxWidth = "1681px";
	}
}
