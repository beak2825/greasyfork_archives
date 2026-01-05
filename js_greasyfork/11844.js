// ==UserScript==
// @name        Mangaupdates Covers Button Search
// @namespace   ocekonauta@gmail.com
// @description Creates a button inside the mangaupdate's manga pages for search its related covers at Manga Cover Database
// @include     https://www.mangaupdates.com/series.html?id=*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11844/Mangaupdates%20Covers%20Button%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/11844/Mangaupdates%20Covers%20Button%20Search.meta.js
// ==/UserScript==

function addCss(cssString) {
  var head = document.getElementsByTagName('head')[0];
  var newCss = document.createElement('style');
  newCss.type = "text/css";
  newCss.innerHTML = cssString;
  head.appendChild(newCss);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

	var QueryString = function () {
	  var query_string = {};
	  var query = window.location.search.substring(1);
	  var vars = query.split("&");
	  for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if (typeof query_string[pair[0]] === "undefined") {
		  query_string[pair[0]] = decodeURIComponent(pair[1]);
		} else if (typeof query_string[pair[0]] === "string") {
		  var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
		  query_string[pair[0]] = arr;
		} else {
		  query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	  } 
		return query_string;
	}();

	var manga_title=document.querySelector("span.releasestitle.tabletitle");
	var cover_link = document.createElement("a");       // Create a <li> node
		cover_link.href='http://mcd.iosphe.re/manga/'+QueryString.id+'/';
		cover_link.className='buttonCovers';
		cover_link.target='_blank';
	var textnode = document.createTextNode("Covers");  // Create a text node
		cover_link.appendChild(textnode);	
	
	addCss(".buttonCovers {-moz-box-shadow:inset 0px 1px 0px 0px #ffffff;-webkit-box-shadow:inset 0px 1px 0px 0px #ffffff;box-shadow:inset 0px 1px 0px 0px #ffffff;background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #f9f9f9), color-stop(1, #e9e9e9));background:-moz-linear-gradient(top, #f9f9f9 5%, #e9e9e9 100%);background:-webkit-linear-gradient(top, #f9f9f9 5%, #e9e9e9 100%);background:-o-linear-gradient(top, #f9f9f9 5%, #e9e9e9 100%);background:-ms-linear-gradient(top, #f9f9f9 5%, #e9e9e9 100%);background:linear-gradient(to bottom, #f9f9f9 5%, #e9e9e9 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#f9f9f9', endColorstr='#e9e9e9',GradientType=0);background-color:#f9f9f9;-moz-border-radius:6px;-webkit-border-radius:6px;border-radius:6px;border:1px solid #dcdcdc;display:inline-block;cursor:pointer;color:#666666 !important;font-family:Arial;font-size:12px;font-weight:bold;padding:6px;text-decoration:none !important;text-shadow:0px 1px 0px #ffffff;margin-left: 10px;}.buttonCovers:hover {background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #e9e9e9), color-stop(1, #f9f9f9)) !important;background:-moz-linear-gradient(top, #e9e9e9 5%, #f9f9f9 100%) !important;background:-webkit-linear-gradient(top, #e9e9e9 5%, #f9f9f9 100%) !important;background:-o-linear-gradient(top, #e9e9e9 5%, #f9f9f9 100%) !important;background:-ms-linear-gradient(top, #e9e9e9 5%, #f9f9f9 100%) !important;background:linear-gradient(to bottom, #e9e9e9 5%, #f9f9f9 100%) !important;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#e9e9e9', endColorstr='#f9f9f9',GradientType=0) !important;background-color:#e9e9e9;}.buttonCovers:active {position:relative;top:1px;}");	
	
	insertAfter(cover_link,manga_title);
	
	