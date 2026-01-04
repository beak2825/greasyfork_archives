// ==UserScript==
// @name        mcstories fixer
// @namespace   hell@hell.hell
// @include     http://www.mcstories.com/*/index.html
// @include     https://www.mcstories.com/*/index.html
// @include     http://mcstories.com/*/index.html
// @include     https://mcstories.com/*/index.html
// @exclude     http://www.mcstories.com/Titles/index.html
// @exclude     http://www.mcstories.com/Authors/index.html
// @exclude     http://www.mcstories.com/Tags/index.html
// @exclude     http://www.mcstories.com/ReadersPicks/index.html
// @version     1
// @description depaginates stories on mcstories.com
// @grant       none
// @require     http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/374313/mcstories%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/374313/mcstories%20fixer.meta.js
// ==/UserScript==

var link = window.location.toString().split("/");
function fixMC() {
	if ($("tbody").length != 0) {
		var chapters = $("#index > tbody:nth-child(1) > tr").length - 1;
		for (let i = 2; i <= chapters + 1; i++) {
			$("#index > tbody:nth-child(1) > tr:nth-child("+i+")").load("http://www.mcstories.com/"+link[3]+"/"+link[3]+(i-1)+".html #mcstories");
		} 
	} else {
		$(".chapter").load("http://www.mcstories.com/"+link[3]+"/"+link[3]+".html #mcstories");
	}
	$("#index > tbody:nth-child(1) > tr:nth-child(1)").remove();
}

fixMC();

function removeCSS() {
  for (let i = 0; i < document.styleSheets.length; i++) {
		document.styleSheets[i].disabled = true;
	}	
}

removeCSS();
