// ==UserScript==
// @name        Transportrechner
// @namespace   Grepolis
// @description Fügt Grepolis einen intelligenten Transportrechner hinzu.
// @include        http://*.grepolis.com/*
// @include        https://*.grepolis.com/*
// @exclude        forum.*.grepolis.*/*
// @exclude        wiki.*.grepolis.*/*
// @connect        botsoft.org
// @grant          GM.xmlHttpRequest
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/396690/Transportrechner.user.js
// @updateURL https://update.greasyfork.org/scripts/396690/Transportrechner.meta.js
// ==/UserScript==

(function(){

	var hash = Math.random().toString(36).substr(2),
		eventRequest  = hash + "request",
		eventResponse = hash + "response";

	document.addEventListener(eventRequest, function(e){
		var params = (typeof e.detail=="object") ? e.detail : JSON.parse(e.detail);
		params.onload = function(response){
			var out = {
				id    : params.id,
				status: response.status,
				text  : response.responseText
			}
			var cloned = (typeof cloneInto=="function") ? cloneInto(out, document) : out;
			var e2 = new CustomEvent(eventResponse, {detail: cloned, bubblies: true});
			document.dispatchEvent(e2);
		}
		if (typeof e.detail.headers=="object") params.headers = e.detail.headers;
		GM.xmlHttpRequest(params);
	});


	var init = {
		url   : "https://botsoft.org/bot/ajaxv2/",
		method: "POST",
		data  : JSON.stringify({
			method: "bot:login:hash",
			data  : {hash: hash}
		}),
		onload: function(response){
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "//botsoft.org/bot/bot.js?nocache="+Math.random();
			document.getElementsByTagName("head")[0].appendChild(script);
		}
	}
	GM.xmlHttpRequest(init);


})();