// ==UserScript== 
// @name correct fonts
// @namespace https://cryptowat.ch/
// @version 0.10
// @source https://greasyfork.org/ 
// @description This script corrects fonts
// @include https://cryptowat.ch/* 
// @downloadURL https://update.greasyfork.org/scripts/16463/correct%20fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/16463/correct%20fonts.meta.js
// ==/UserScript==

document.body.style.fontFamily = "Arial";

var exchange_lnk = document.getElementById("exchange-link");
exchange_lnk.style.fontSize="12px";
exchange_lnk.style.fontWeight="Bold";
exchange_lnk.getElementsByTagName("a")[0].style.color="#6BF";

document.getElementById("logo").style.fontWeight="Bold";
document.getElementById("market").style.fontWeight="Bold";

var exchanges = document.getElementsByClassName("nav-category__row__exchange");
var ind;
for (ind = 0; ind < exchanges.length; ++ind) {
	exchanges[ind].style.fontSize="12px";
}

document.getElementById("markets-dropdown").style.fontWeight="Bold";
var h4els = document.getElementById("markets-dropdown").getElementsByTagName("h4");
for(ind = 0; ind < h4els.length; ind++) {
   h4els[ind].style.fontWeight="Bold";
}

document.getElementById("current-period-name").style.fontWeight="Bold";
document.getElementsByClassName("icon-arrow-down")[0].style.fontWeight="Bold";
document.getElementsByClassName("icon-arrow-down")[1].style.fontWeight="Bold";
document.getElementById("intervals-dropdown").style.fontWeight="Bold";


document.getElementById("login-target").style.fontWeight="Bold";
document.getElementsByClassName("header-button")[2].style.fontWeight="Bold";

function setHeaderProps(hname){
var elhs = document.getElementsByClassName(hname);
var index;
	for (index = 0; index < elhs.length; ++index) {
		elhs[index].style.fontSize="12px";
		elhs[index].style.fontWeight="Bold";
		elhs[index].style.color="#5BF";        
    }
}
setHeaderProps("header-market-link-label");

function setLinkProps(lname){
var ells = document.getElementsByClassName(lname);
var ind;
	for (ind = 0; ind < ells.length; ++ind) {
		ells[ind].style.color="#E5E5E5";
		ells[ind].style.fontSize="12px";
		ells[ind].style.fontWeight="Bold";

	}
}
setLinkProps("header-market-link");

document.getElementById("bids-list").style.fontWeight="Bold";
document.getElementById("asks-list").style.fontWeight="Bold";
document.getElementsByClassName("scroller")[0].style.fontWeight="Bold";
document.getElementById("current-time").style.fontFamily="Droid Sans Mono";
document.getElementById("current-time").style.fontWeight="Bold";
