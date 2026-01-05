// ==UserScript==
// @name Lukkarimaatti oodiin
// @description Script lisää lukkarimaati napin oodiin. Eka pirkka versio. Varmasti buginen.
// @include https://weboodi.lut.fi/oodi/omatopinn.jsp*
// @namespace https://greasyfork.org/users/3167
// @run-at document-end
// @grant none
// @version 0.0.1.20160823195452
// @downloadURL https://update.greasyfork.org/scripts/16035/Lukkarimaatti%20oodiin.user.js
// @updateURL https://update.greasyfork.org/scripts/16035/Lukkarimaatti%20oodiin.meta.js
// ==/UserScript==

lukkarimaatti = "http://lukkarimaatti.herokuapp.com/?courses=";

var hook = function()
{
	var TRS = document.querySelectorAll(".eisei tbody tr td .eisei tbody tr"), i;
	var CIDSTR = "";
	for(i = 1; i < TRS.length; ++i) {
		var TDS = TRS[i].cells.item(0);
		var CID = TDS.childNodes[0].innerHTML.slice(0,-7);
		//console.log(CID);
		if (CIDSTR=="")
		{
		   CIDSTR = CID;
		}
		else
		{
		   CIDSTR = CIDSTR + "+" + CID;
		}
	}
	var lukkarilink = lukkarimaatti + CIDSTR;
	//window.open(lukkarilink,'_blank');
	
	var element = document.querySelectorAll('body table')[0];

	var clickaction = "window.open('" + lukkarilink + "','_blank');";
	var newelement = document.createElement("span");
	newelement.innerHTML = '<span onclick="' + clickaction + '" style="cursor:pointer; color:blue;">Lukkarimaatti</span>';
	
	
	//var newelement = document.createElement("a");
    //newelement.setAttribute('href', lukkarilink);
	//newelement.innerHTML = "Lukkarimaatti";
	
	element.parentNode.insertBefore(newelement, element.nextSibling);
}

setTimeout(function(){hook();},1000);

