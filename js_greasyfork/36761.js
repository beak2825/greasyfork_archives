// ==UserScript==
// @name         Odplusowanie
// @namespace    *
// @version      0.5
// @description  odpl
// @author       Arkatch
// @match        *://www.wykop.pl/i/ludzie/plusowane-wpisy/*
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/36761/Odplusowanie.user.js
// @updateURL https://update.greasyfork.org/scripts/36761/Odplusowanie.meta.js
// ==/UserScript==
function ajax(url){
	var request = new XMLHttpRequest();
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send();
}
function more(){
	try{
		var x = document.querySelectorAll('.more > a');
		for(var i of x){
			i.click();
		}	
	}catch(e){
		return true;
	}
	return true;
}
function isset(x){
	if(x.getElementsByClassName('voted plus').length > 0){
		return true;
	}else{
		return false;
	}	
}
function getAjaxLink(x){
	return x.getElementsByClassName('button mikro ajax')[0].href;
}
function getElem(){
	var x = document.getElementsByClassName('author ellipsis');
	var j = x.length;
	var i;
	var tab = [];
	for(i = 0;i<j;i++){
		let temp = x[i];
		if( isset(temp) ){
			tab.push( getAjaxLink(temp) );
		}
	}
	return tab;
}
function ajaxRequest(){
	var ajaxLink = getElem();
	for(var i of ajaxLink){
		ajax(i);
	}
	console.log(true);
}
function next(){
	location.reload();
}
window.onload = (function(){
	more();
	setTimeout(ajaxRequest, 1500);
	setTimeout(next, 7100);
})();