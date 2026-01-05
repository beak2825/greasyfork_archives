// ==UserScript==
// @name ZyXEL password clearer
// @namespace ZyxelPasswordClear
// @include		http://192.168.1.*/login.cgi
// @include		http://router.home/login.cgi
// @version 1.0
// @description Auto clear router login page password field
// @downloadURL https://update.greasyfork.org/scripts/12066/ZyXEL%20password%20clearer.user.js
// @updateURL https://update.greasyfork.org/scripts/12066/ZyXEL%20password%20clearer.meta.js
// ==/UserScript==

(function(){
var inp=document.getElementsByTagName('input');
	var len=inp.length;
	for(var i=0;i<len;i++)
	{
		if(inp[i].getAttribute('type')=='password')
		{
			inp[i].removeAttribute('value');
		}
	}
})();
