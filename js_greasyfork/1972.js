// ==UserScript==
// @name        	Guzik Zgłoszeń
// @description 	Tworzy skrót do panelu zgłoszeń na belce.
// @namespace  		http://www.wykop.pl/ludzie/Deykun/
// @author      	Deykun 
// @include	    	htt*wykop.pl*
// @version     	1.1.2
// @grant       	none
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/1972/Guzik%20Zg%C5%82osze%C5%84.user.js
// @updateURL https://update.greasyfork.org/scripts/1972/Guzik%20Zg%C5%82osze%C5%84.meta.js
// ==/UserScript==

if(unsafeWindow.jQuery){
var $ = unsafeWindow.jQuery;
 main();
} else {
 addJQuery(main);
}

function main(){

    $('li[class="m-hide"]').eq(0).after('<li><a href="http://www.wykop.pl/naruszenia/moje/" title="Panel zgłoszeń"><i class="fa fa-flag-o"></i></a></li>');
	}
function addJQuery(callback) {
  var script = document.createElement("script");
  script.textContent = "(" + callback.toString() + ")();";
  document.body.appendChild(script);
}