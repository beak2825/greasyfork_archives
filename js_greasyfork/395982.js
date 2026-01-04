// ==UserScript==
// @name        New script - 100rad.ru
// @namespace   Violentmonkey Scripts
// @match       http://100rad.ru/
// @grant       none
// @version     1.1
// @author      lubitel1997
// @description 01.03.2020, 0:41:00
// @downloadURL https://update.greasyfork.org/scripts/395982/New%20script%20-%20100radru.user.js
// @updateURL https://update.greasyfork.org/scripts/395982/New%20script%20-%20100radru.meta.js
// ==/UserScript==
var a = '';
setInterval(function() {
   var elem = document.getElementsByClassName('leaflet-popup-content')[0].innerHTML;
  elem = document.body.getElementsByTagName('a')[0].href;
  if(elem != a) {
	var xhr = new XMLHttpRequest()	;					
	xhr.withCredentials = true;									
	xhr.onreadystatechange = function()					
	{
		if(xhr.readyState == 4)									
		{
			if(xhr.status == 200)								
			{
				var html = xhr.response;					
				document.getElementsByClassName('leaflet-popup-content')[0].innerHTML = document.getElementsByClassName('leaflet-popup-content')[0].innerHTML + html;
				}
			}
		}
	
	xhr.open('GET','http://f0321390.xsph.ru/ph.php?url='+ elem, true)	;	
	xhr.send()						;							
 a = elem;
}
}, 1000);