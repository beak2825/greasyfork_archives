// ==UserScript==
// @name               ardtext readability
// @namespace    akiom
// @version      0.1
// @description        increases readability of ardtext.com/mobil
// @author       akiom
// @include      http*://ardtext.de/mobil/*
// @grant        none
// @run-at       document-body
// @license     WTFPL
// @compatible        firefox 
// @downloadURL https://update.greasyfork.org/scripts/24489/ardtext%20readability.user.js
// @updateURL https://update.greasyfork.org/scripts/24489/ardtext%20readability.meta.js
// ==/UserScript==

var manipulate = function() {
  var e = document.querySelectorAll('p, h1 > b');
  Array.prototype.forEach.call(e, function(el, i){
	el.innerHTML = el.innerHTML.replace(/\"([^\"]*)\"/g,"<em>$1</em>");
    
	el.innerHTML = el.innerHTML.replace(/\'([^\']*)\'/g,"<q>$1</q>");
    
	//el.innerHTML = el.innerHTML.replace(/<br\s*\/>/g,"");
	//el.innerHTML = el.innerHTML.replace(/<\/b>\s*<b>/g,"");
	
	el.innerHTML = el.innerHTML.replace(/([a-zöäü])-(\s*\n)*([a-zöäü])/g,"$1&shy;$3");

	el.innerHTML = el.innerHTML.replace(/\s+-\s+/g," – ");
  });
};

document.addEventListener('DOMContentLoaded', manipulate);
