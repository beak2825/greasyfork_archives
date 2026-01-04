// ==UserScript==
// @name         Cofnij wykop
// @namespace    *
// @version      0.9
// @description  odk
// @author       Arkatch
// @match        *://www.wykop.pl/ludzie/wykopane/*
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/36767/Cofnij%20wykop.user.js
// @updateURL https://update.greasyfork.org/scripts/36767/Cofnij%20wykop.meta.js
// ==/UserScript==
function getAjaxLink(x){
	return x.getElementsByTagName('a')[0];
}
function getElem(){
	var x = document.getElementsByClassName('diggbox  digout');
	var j = x.length;
	var i;
	var tab = [];
	for(i = 0;i<j;i++){
		let temp = x[i];
		tab.push( getAjaxLink(temp) );
	}
	return tab;
}
function dig(){
	var ajaxLink = getElem();
	var j = ajaxLink.length;
	var i = 0;
	var x = setInterval(function(){
		try{
			ajaxLink[i].click();
		}catch(e){
			
		}
		i++;
		if(i>=j){
			clearInterval(x);
			next();
		}
	},50);
}
function next(){
	var x = document.querySelector('.wblock.rbl-block.pager > p');
	x.lastElementChild.click();
}
window.onload = (function(){
	dig();
})();