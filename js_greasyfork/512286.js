// ==UserScript==
// @name		DryadQuest Premium Emulation
// @namespace	https://greasyfork.org/en/scripts/512286-dryadquest-premium-emulation
// @version		2025-5-20|v0.2.3-1
// @description	Unlocks Premium Features through Emulation for DryadQuest
// @author		V.H.
// @copyright	V.H.
// @icon		https://icons.duckduckgo.com/ip2/dryadquest.com.ico
// @match		https://dryadquest.com/
// @grant		unsafeWindow
// @grant		GM_log
// @run-at		document-start
// @tag			hacks
// @license		MIT
// @connect		self
// @connect		tools.vallenh.serv00.net
// @webRequest	[{"selector":"/api/token","action":{"redirect":"data:application/json,{\"user\":{\"_id\":\"6s9a6t9a6n9\",\"name\":\"HaXor\",\"patronId\":666,\"patronTier\":666,\"privTier\":666,\"privilege\":666}}"}}]
// @webRequest	[{"selector":"/premium","action":{"redirect":"/"}}]
// @antifeature	Routes traffic through a mock-api
// @downloadURL https://update.greasyfork.org/scripts/512286/DryadQuest%20Premium%20Emulation.user.js
// @updateURL https://update.greasyfork.org/scripts/512286/DryadQuest%20Premium%20Emulation.meta.js
// ==/UserScript==

/**
 * This game is very well-developed, congratulations to the developer.
 * I'm very sorry for making this (futile) script, I hope it doesn't harm you.
 * 
 * If you edit & redistribute this script, please credit the author.
 */

"use strict";

const	orig		= {
	xhr:	XMLHttpRequest.prototype.open,
},		cbu			= "https://tools.vallenh.serv00.net/api/hacks/dryadquest/main?cb=";

XMLHttpRequest.prototype.open	= function open(...args) {
	if (args.length >= 2 && args[1].endsWith("/api/token"))
		args[1]		= "https://tools.vallenh.serv00.net/api/hacks/dryadquest/patronapi";	//mock api to return fixed fake premium account
	
	GM_log("XHR:\t" + args.join(", "));
	
	return orig.xhr.call(this, ...args);
}; //open

function dynload() {
	window.stop();
	/*document.open();
	document.write("<html><body>PLEASE WAIT...</body></html>");
	document.close();*/
	
	getPage("/").then(async res => {
		res				= Document.parseHTMLUnsafe(res);
		
		const	main	= res.querySelector("script[src^='main.']");
		let		qs		= "", tmp;
		
		if (sessionStorage.getItem("half_cost") == "true")
			qs	+= qs ? "&half=y" : "half=y";
		if ((tmp = sessionStorage.getItem("accurate")) > 0)
			qs	+= qs ? `&accurate=${tmp}` : `accurate=${tmp}`;
		
		if (main) {
			main.id				= main.id || "mainscript";
			main.src			= encodeURI(cbu + encodeURIComponent(new URL(main.src, location.href + "data/").href) + (qs ? ('&' + qs) : ""));
			main.textContent	= await getPage(main.src);
		}
		
		document.documentElement.innerHTML	= res?.documentElement?.getHTML();
		setTimeout(updateScripts, 500);
	}).catch(console.error);
} //dynload

dynload();

function updateScripts() {
	for (const script of document.scripts) {
		if (script.hasAttribute("data-loaded"))
			continue;
		
		const	s			= document.createElement("script");
		
		s.id				= script.id;
		
		if (script.crossorigin)
			s.crossorigin	= script.crossorigin;
		if (script.type)
			s.type			= script.type;
		if (script.src)
			s.src			= script.src;
		if (script.textContent)
			s.textContent	= `/*${script.src}*/\n` + script.textContent;
		if (script.hasAttribute("defer"))
			s.setAttribute("defer", "");
		if (script.hasAttribute("async"))
			s.setAttribute("async", "");
		
		s.setAttribute("data-loaded", "y");
		
		try {
			script.replaceWith(s);
		} catch(e) {
			console.error(e);
		}
	}
} //updateScripts

async function getPage(sc = "/") {
	let			out		= "";
	
	try {
		const	req		= await fetch(sc);
		
		out				= await req.text();
	} catch(e) {
		console.error(e);
	}
	
	return out;
} //getPage
if (unsafeWindow)
	unsafeWindow.getPage	= getPage;
