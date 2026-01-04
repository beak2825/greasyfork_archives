// ==UserScript==
// @name       ukrywanie wiesci.pl
// @namespace  http://www.wykop.pl/*
// @version    1.1
// @description  ukrywa wiesci.pl
// @match      *://www.wykop.pl/*
// @copyright  Arkatch
// @downloadURL https://update.greasyfork.org/scripts/32268/ukrywanie%20wiescipl.user.js
// @updateURL https://update.greasyfork.org/scripts/32268/ukrywanie%20wiescipl.meta.js
// ==/UserScript==

(function(){
	var z = document.getElementsByClassName('affect');
	for(var i=0;i<z.length;i++){
	if(z[i].innerText == "wiesci24.pl"){	
	 $(z[i]).closest('.article').remove();  
	}	
	}
})();