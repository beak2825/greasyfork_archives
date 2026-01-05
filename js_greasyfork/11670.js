// ==UserScript==
// @name        Saner Environment Canada Weather
// @namespace   AlbionResearch
// @description Make the weather forecast appear above the fold on small screens.
// @include     http://weather.gc.ca/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11670/Saner%20Environment%20Canada%20Weather.user.js
// @updateURL https://update.greasyfork.org/scripts/11670/Saner%20Environment%20Canada%20Weather.meta.js
// ==/UserScript==
// We're not likely to maintain this, so try and gracefully degrade if page changes
// Hide the gigantic logo
try { document.getElementById("wb-bnr").style.display = "none"; } catch (e) {}
// Remove on-weather navbar - setting display none doesn't work for this
try {
	var element = document.getElementById("wb-sm")
	element.parentNode.removeChild(element);
} catch (e) {}
// Smaller but bolder breadcrumbs
try {
	var wbbc = document.getElementById("wb-bc");
	wbbc.style.fontSize = "smaller";
	// wbbc.style.fontWeight = "bold";
	wbbc.getElementsByTagName("ol")
	var list = wbbc.getElementsByTagName("li");	// Lose some external links
	list[0].innerHTML = "Environment Canada"; // Was link to "Canada"!
	list[1].style.display = "none"; // Environment Canada
} catch (e) {}
// Useless Menu to the right
try { document.getElementById("cityjump").parentNode.style.display = "none"; } catch (e) {}
// Wasted space
try { document.getElementById("mainContent").style.marginTop = "0px" } catch (e) {}
try { document.getElementById("wxo-cityforecast").style.marginTop = "0px" } catch (e) {}
// Unimportant stuff we can get from looking outside in smaller font
try { document.getElementById("currconditionscontainer").style.fontSize = "smaller"; } catch(e) {}
// Smaller Headings
var headings = document.getElementsByTagName("h1");
for (var i = 0; i < headings.length; i++) {
	headings[i].style.fontSize = "larger";	// Which is smaller than it was!
}
headings = document.getElementsByTagName("h2");
for (var i = 0; i < headings.length; i++) {
	headings[i].style.fontSize = "large";	// Which is smaller than it was!
}
// Why show alerts when there aren't any
if (document.getElementById("noalert")) {
	document.getElementById("noalert").style.display = "none";
}
// Hide the footer... why link to the prime minister?
try { document.getElementById("wb-info").style.display = "none"; } catch(e) {}