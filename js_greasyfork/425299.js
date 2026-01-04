// ==UserScript==
// @name        DDUnlimited.net Highlighter
// @description highlights new posts of the day in ddunlimited.net pages
// @author      SH3LL
// @version     1.3
// @match       https://ddunlimited.net/viewforum.php?*
// @grant       none
// @run-at       document-idle
// @copyright	GPL3
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/425299/DDUnlimitednet%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/425299/DDUnlimitednet%20Highlighter.meta.js
// ==/UserScript==

let months = {
     '01':'gen', '02':'feb', '03':'mar', '04':'apr', '05':'mag', '06':'giu', '07':'lug', '08':'ago', '09':'set', '10':'ott', '11':'nov', '12':'dic'
};

// buildo la data odierna
let oggi = new Date();
let mese_o= months[String(oggi.getMonth() + 1).padStart(2, '0')];
let dd_o = String(oggi.getDate()).padStart(2, '0');
if(dd_o<10) dd_o=dd_o.replaceAll("0", "");
let yyyy_o = oggi.getFullYear();
oggi = dd_o + ' ' + mese_o + ' ' + yyyy_o;


//buildo la data di ieri
let ieri = new Date();
ieri.setDate(ieri.getDate() - 1);
let mese_i= months[String(ieri.getMonth() + 1).padStart(2, '0')];
let dd_i = String(ieri.getDate()).padStart(2, '0');
if(dd_i<10) dd_i=dd_i.replaceAll("0", "");
let yyyy_i = ieri.getFullYear();
ieri = dd_i + ' ' + mese_i + ' ' + yyyy_i;

// coloro tutti i post di grigio
let topics = document.getElementsByClassName("topictitle");
for (let el of topics){
	el.style.color = 'gray';
}
//seleziono solo i post che contengono la data di oggi e li coloro
for (let el of topics){
	if(el.parentElement.parentElement.parentElement.lastElementChild.innerText.includes(oggi)){
		el.style.color = 'greenyellow';
	}
  if(el.parentElement.parentElement.parentElement.lastElementChild.innerText.includes(ieri)){
		el.style.color = 'darkgreen';
	}
}