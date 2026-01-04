// ==UserScript==
// @name         Usuń wpis ajax
// @namespace    *
// @version      0.4
// @description  new ajax 
// @author       Arkatch
// @match        *://www.wykop.pl/ludzie/*
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/36789/Usu%C5%84%20wpis%20ajax.user.js
// @updateURL https://update.greasyfork.org/scripts/36789/Usu%C5%84%20wpis%20ajax.meta.js
// ==/UserScript==
function ajax(url){
	var request = new XMLHttpRequest();
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send();
}

function ajaxList(){
	var x = document.getElementsByClassName('wblock lcontrast dC  ownComment');
	var tab = [];
	for(var i of x){
		try{
			let tmp = i.getElementsByClassName('fa fa-trash-o')[0].closest('a').getAttribute("data-ajaxurl");
			tab.push(tmp);
		}catch(e){}
	}
	return tab;
}

function ajaxReq(){
	var tab = ajaxList();
	var l = tab.length;
	var i = 0;
	var x = setInterval(function(){
		ajax(tab[i]);
		i++;
		if(i>=l){
			clearInterval(x);
			location.reload();
		}
	}, 30);
}

window.onload = (function(){
	ajaxReq();
})();