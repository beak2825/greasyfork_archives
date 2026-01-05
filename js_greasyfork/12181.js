// ==UserScript==
// @name        Majomparádé borito nezet script (cover view)
// @namespace   http*://*majomparade.net/*
// @include     http*://*majomparade.net/*
// @version     1
// @grant       none
// @description:hu poster view
// @description poster view
// @downloadURL https://update.greasyfork.org/scripts/12181/Majompar%C3%A1d%C3%A9%20borito%20nezet%20script%20%28cover%20view%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12181/Majompar%C3%A1d%C3%A9%20borito%20nezet%20script%20%28cover%20view%29.meta.js
// ==/UserScript==

var elemek, elem;

//tömbbe beteszem az összes linket
elemek = document.getElementsByTagName('a');
var text=""; //text egy string típusú változó

//ciklus a "linktömb" végéig
for (var i = 0; i < elemek.length; i++)
{

	//elem tárolja az aktuális (i-edik) linket
	elem = elemek[i];
	text=String(elem.href);  //text értékül kapja az URL-t
	
	if(text.indexOf("boritok2")>=1) //azokat mutatja ahol az URL-ben van a "boritok2"
	{
			
	//simán hozzáadva a kép, 300pixel magas, természetesen átírható
	elemek[i].innerHTML=elemek[i].innerHTML+"<br><img src="+text+" border=0 height=300>";
	
	}

}