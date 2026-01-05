// ==UserScript==
// @name        draw.io
// @namespace   Test
// @include     *draw.io/*
// @version     1.1
// @grant       none
// @description Deletes annoying bars in draw.io sites
// @icon https://www.draw.io/images/apple-touch-icon-ipad.png
// @downloadURL https://update.greasyfork.org/scripts/4637/drawio.user.js
// @updateURL https://update.greasyfork.org/scripts/4637/drawio.meta.js
// ==/UserScript==
function removeFooter ()
{
	// Element anhand des Css-Namens finden
	var footer = document.getElementsByClassName ('geFooterContainer')[0];
	// Element entfernen
	if (footer != null)
	{
		footer.outerHTML = '';
	}
	// Den Abstand der Bearbeitungsfläche zum Boden der Website auf 0 setzen

	var diagram = document.getElementsByClassName('geDiagramContainer')[0];
	if (diagram != null)
	{
	    diagram.style.bottom = '0px';
	}

	var sidebar1 = document.getElementsByClassName ('geSidebarContainer')[1];
	// Element entfernen
	if (sidebar1 != null)
	{
	    sidebar1.outerHTML = '';
	}

	var sidebar2 = document.getElementsByClassName ('geSidebarContainer')[0];
	if (sidebar2 != null)
	{
		sidebar2.style.bottom = '0px';
	}
}

//window.setInterval (function () { removeFooter (); }, 1000);
// geFooterContainer

window.addEventListener("load", removeFooter, false);
