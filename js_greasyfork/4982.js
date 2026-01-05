// ==UserScript==
// @name          feedsportal link
// @author        kl
// @description   Automatically follows the 'click here to continue to article' link on feedsportal pages.
// @include       http://*.feedsportal.com/*.htm
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version       0.0.2
// @history       0.0.1 2012-01-31
// @namespace https://greasyfork.org/users/5206
// @downloadURL https://update.greasyfork.org/scripts/4982/feedsportal%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/4982/feedsportal%20link.meta.js
// ==/UserScript==

var blhost=location.host.toLowerCase(); 
var bllink=location.href.toLowerCase(); 
var blhref;
if (blhost.indexOf(".feedsportal.com")>=0 && bllink.indexOf(".htm")>=0){
	var blelement=document.querySelectorAll("a"); 
	for (var i=0;i<blelement.length;i++){
		if (blelement[i].innerText==undefined){blhref=blelement[i].textContent;}
		else {blhref=blelement[i].innerText;}
		if (blhref=="click here to continue to article" || blhref=="﻿继续阅读文章，请点击这里"){
			location.href=blelement[i].getAttribute("href");
			break;
		}
    }
}