// ==UserScript==
// @name         10ff Logout Message
// @namespace    http://tampermonkey.net/
// @version      0.111
// @description  tells you if you aren't logged in anymore
// @author       Ayasu/godsblade
// @match        *://10fastfingers.com/typing-test/*
// @match        *://10fastfingers.com/widget*
// @match        *://10fastfingers.com/competition/*
// @match        *://10fastfingers.com/advanced-typing-test/*
// @match        *://10fastfingers.com/top1000/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379362/10ff%20Logout%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/379362/10ff%20Logout%20Message.meta.js
// ==/UserScript==
setInterval(function() {
	var cookies = document.cookie;

	if (!(cookies.includes("CakeCookie[remember_me_cookie]")))
	{

		var notLoggedInEle = document.getElementById("notLoggedIn");
		if(!notLoggedInEle){
			$('#words').before("<div id='notLoggedIn'></div>");
		}
		$('#notLoggedIn').html("Might not be logged in anymore...");

		document.getElementById("notLoggedIn").style.color = "red";
		document.getElementById("notLoggedIn").style.fontSize = "2em";
		document.getElementById("notLoggedIn").style.textAlign = "center";
	}
	else
	{
		var notLoggedInEle = document.getElementById("notLoggedIn");
		if(notLoggedInEle){
			notLoggedInEle.remove();
		}
	}
} , 100);

