// ==UserScript==
// @name			Coub Chat PM
// @version			2020.05.09
// @description		Ссылки на PM собеседников
// @include			http*://*coub.com/chat/*
// @author			Rainbow-Spike
// @namespace 		https://greasyfork.org/users/7568
// @homepage		https://greasyfork.org/ru/users/7568-dr-yukon
// @icon			https://www.google.com/s2/favicons?domain=coub.com
// @grant			none
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/381719/Coub%20Chat%20PM.user.js
// @updateURL https://update.greasyfork.org/scripts/381719/Coub%20Chat%20PM.meta.js
// ==/UserScript==

var timer = 1,
	links,
	newlink;

function coub_pm ( ) {
	links = document.querySelectorAll ( "a.kmJYsW:not(.stopscript)" );
 	for ( var i in links ) {
  		newlink = document.createElement ( 'a' );
  		if ( links [ i ].href ) {
			links [ i ].className += ' stopscript';
   			newlink.href = links [ i ].href.replace ( /.com\//, '.com/chat/@' );
			newlink.style = 'position: relative; bottom: 50px; left: 14px;';
   			newlink.innerHTML = 'PM';
   			newlink.target = '_blank';
   			links [ i ].parentNode.appendChild ( newlink )
  		}
 	}
}

setInterval ( coub_pm, timer * 1000 );
