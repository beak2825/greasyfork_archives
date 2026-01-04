// ==UserScript==
// @name        Redirect db.vanillagaming.org links to db.excalibur.la
// @namespace   uso2usom
// @description On any web page it will check if the clicked links goes to db.vanillagaming.org. It will then redirect to a working vanilla gaming database site.
// @include     http://*.*
// @include     https://*.*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/38103/Redirect%20dbvanillagamingorg%20links%20to%20dbexcaliburla.user.js
// @updateURL https://update.greasyfork.org/scripts/38103/Redirect%20dbvanillagamingorg%20links%20to%20dbexcaliburla.meta.js
// ==/UserScript==

for(var i = 0; i < document.links.length; i++)
{ 
	//Some sites use redirect links for security reasons which can screw up the script function. This line will remove that feature.
  document.links[i].removeAttribute("data-safe-url");
  document.links[i].href = document.links[i].href.replace(/http:\/\/db.vanillagaming.org/i,"http://db.excalibur.la");
	document.links[i].title = document.links[i].title.replace(/http:\/\/db.vanillagaming.org/i,"http://db.excalibur.la");
}