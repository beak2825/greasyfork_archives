// ==UserScript==
// @name         Linkedin Degree
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://view.appen.io/assignments/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407063/Linkedin%20Degree.user.js
// @updateURL https://update.greasyfork.org/scripts/407063/Linkedin%20Degree.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var cml = document.getElementsByClassName('cml');
for(var i=0;cml.length>i;i++){
	//Obtengo checkbox
	var checkbox = jQuery(':checkbox',cml[i]).each(function(position,element){
		var span = document.createElement('span');
		span.innerText=position+1;
		span.style='float:left;font-size:12pt;color:red';
		//Obtenemos nodo padre e insertamos
		element.parentNode.insertBefore(span,null);
	})
}

})();