// ==UserScript==
// @name         Wishing Well - Quick Wish GM
// @namespace    greasemonkey
// @version      1.1
// @description  Writes donation amount and wish once the page loads
// @author       Nyu (clraik)
// @match        http://www.neopets.com/wishing.phtml*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/29566/Wishing%20Well%20-%20Quick%20Wish%20GM.user.js
// @updateURL https://update.greasyfork.org/scripts/29566/Wishing%20Well%20-%20Quick%20Wish%20GM.meta.js
// ==/UserScript==


var i = GM_getValue('wishcount', 0);
GM_setValue('wishcount', i + 1);


if(document.URL.indexOf("wishing.phtml?thanks") != -1){
	var mw=document.getElementsByClassName("content")[0].getElementsByTagName("center")[2].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].getElementsByTagName("input")[0];
	var mw1=document.getElementsByClassName("content")[0].getElementsByTagName("center")[2].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[2].getElementsByTagName("td")[1].getElementsByTagName("input")[0];
	var mw2=document.getElementsByClassName("content")[0].getElementsByTagName("center")[2].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[4].getElementsByTagName("td")[0].getElementsByTagName("input")[0];
}else{
	var mw=document.getElementsByClassName("content")[0].getElementsByTagName("center")[1].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].getElementsByTagName("input")[0];
  var mw1=document.getElementsByClassName("content")[0].getElementsByTagName("center")[1].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[2].getElementsByTagName("td")[1].getElementsByTagName("input")[0];
  var mw2=document.getElementsByClassName("content")[0].getElementsByTagName("center")[1].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[4].getElementsByTagName("td")[0].getElementsByTagName("input")[0];
}
mw.value="21";
mw1.value="Turned Tooth"; // Change Turned Tooth for the item you want to wish for.
if (i % 8!==0) {
		setTimeout(function(){ 
		mw2.click();}
	  ,1000);// Wait 1 second before clicking make a wish
}