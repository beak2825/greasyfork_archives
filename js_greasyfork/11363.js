// ==UserScript==
// @name           Voat nightwalker mode
// @version        1.0
// @author         Citizen
// @description    This script modifies the "Checking your bits" page from daystar mode to nightwalker mode.
// @include        https://voat.co*
// @run-at	   document-start
// @namespace https://greasyfork.org/en/users/13883-citizen
// @downloadURL https://update.greasyfork.org/scripts/11363/Voat%20nightwalker%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/11363/Voat%20nightwalker%20mode.meta.js
// ==/UserScript==

if ((document.title.indexOf("Checking your bits")==0) && (document.cookie.length>0) && (document.cookie.indexOf("theme=dark") != -1))
{
	document.body.style.background = "#333";
	document.body.style.color = "#dfdfdf";
	document.getElementById("header").style.background = "#333";
	document.getElementById("header-container").style.background = "#333";
	document.getElementById("header-container").style.borderBottom  = "1px solid #222";
	document.getElementById("header-container").style.borderTop = "1px solid #222";
	document.getElementsByClassName("panel")[0].style.background = "#333";
	document.getElementsByClassName("panel-heading")[0].style.background = "#333";
	document.getElementsByClassName("panel-title")[0].style.background = "#333";
	document.getElementsByClassName("panel-title")[0].style.color = "#dfdfdf";
	document.getElementsByClassName("panel-body")[0].style.background = "#333";
	document.getElementsByClassName("panel-body")[0].style.border = "1px solid #222";
}