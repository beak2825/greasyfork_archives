// ==UserScript==
// @name           Chat reconnect
// @namespace      arreloco
// @description    Reconnects the chat whenever it lose connection
// @include        http://www.kongregate.com/games/*
// @version 0.0.1.20160306141234
// @downloadURL https://update.greasyfork.org/scripts/17787/Chat%20reconnect.user.js
// @updateURL https://update.greasyfork.org/scripts/17787/Chat%20reconnect.meta.js
// ==/UserScript==

function recon(){
	var dom;

	var dom = (typeof unsafeWindow === "undefined"?window:unsafeWindow);

	var holodeck = dom.holodeck;
	if(!holodeck) return;
	logIn = holodeck._chat_window._logged_in_to_chat;

	if(document.getElementById('fixChat') == null && logIn){
		 document.getElementById('quicklinks').innerHTML += '<li><span id="fixChat"><input type="checkbox" title="Fix Chat" name="fixChat"></span></li>';
	}
	if(document.getElementById('fixChat').lastChild.checked && document.getElementById('chat_disconnected_indicator').style.display != "none"){
		holodeck.reconnect();
	}
}


setInterval(recon,500);