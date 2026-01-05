// ==UserScript==
// @name        Penny Arcade Combine News and Comic
// @namespace   http://userscripts.org/users/Scuzzball
// @include     http://penny-arcade.com/2*
// @version     1.0
// @description This puts the penny arcade comic on the news page.
// @downloadURL https://update.greasyfork.org/scripts/2018/Penny%20Arcade%20Combine%20News%20and%20Comic.user.js
// @updateURL https://update.greasyfork.org/scripts/2018/Penny%20Arcade%20Combine%20News%20and%20Comic.meta.js
// ==/UserScript==


var comicPage = document.location.protocol + "//" + document.location.hostname + "/comic" + document.location.pathname;

GM_xmlhttpRequest({
	method: "GET",
	url: comicPage,
	onload: function( response ) 
	{
		var patt = /\<div class\=\"post comic\"\>\n(.*)/;
		var comicURL = patt.exec(response.responseText);
		comicURL = comicURL[1];
		document.getElementById("heroFeature").innerHTML = comicURL;
		document.getElementById("heroFeature").style.background = "";
		document.getElementById("heroFeature").style.width = '800px';
		document.getElementById("heroFeature").style.height = '401px';
		document.getElementById("heroFeature").style.overflow="visible"
	}
});
document.getElementById("heroFeature").innerHTML = "";
document.getElementById("sidebar").style.display = 'none';
