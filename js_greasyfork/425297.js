// ==UserScript==
// @name        MIRcrew-releases.org Highlighter
// @match       https://mircrew-releases.org/viewforum.php?*
// @grant       none
// @version     1.2.1
// @author      SH3LL
// @description highlights new posts of the day in mircrew-releases.com pages
// @copyright	GPL3
// @run-at       document-idle
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/425297/MIRcrew-releasesorg%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/425297/MIRcrew-releasesorg%20Highlighter.meta.js
// ==/UserScript==

// buildo la data odierna
let oggi = new Date();
let mese_o= String(oggi.getMonth() + 1).padStart(2, '0');
let dd_o = String(oggi.getDate()).padStart(2, '0');
let yyyy_o = oggi.getFullYear();
oggi = dd_o + '/' + mese_o + '/' + yyyy_o;

//buildo la data di ieri
let ieri = new Date();
ieri.setDate(ieri.getDate() - 1);
let mese_i= String(ieri.getMonth() + 1).padStart(2, '0');
let dd_i = String(ieri.getDate()).padStart(2, '0');
let yyyy_i = ieri.getFullYear();
ieri = dd_i + '/' + mese_i + '/' + yyyy_i;

//riporta tutti i nuovi 1080p di oggi
let fullhd = document.getElementsByClassName("topictitle");
for (el of fullhd){
	if ((el.innerText.includes("1080p") || el.innerText.includes("720p")) && el.parentElement.lastElementChild.lastElementChild.innerText.includes(oggi)) {
		el.style.color = 'aqua';
	}else if ((el.innerText.includes("1080p") || el.innerText.includes("720p")) && el.parentElement.lastElementChild.lastElementChild.innerText.includes(ieri)) {
		el.style.color = 'royalblue';
	}else{
    el.style.color = 'gray';
  }
}