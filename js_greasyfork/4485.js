// ==UserScript==
// @name        Kleinanzeigen Schnellbuttons
// @namespace   softwarecanoe.de
// @description Installiert bei jedem Inserat Schnellzugriffsknöpfe, um Artikel wie im Inserat bei Amazon und eBay zu suchen
// @include     http://kleinanzeigen.ebay.de/*
// @version     1.0.1
// @copyright   Eugen Kremer
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/4485/Kleinanzeigen%20Schnellbuttons.user.js
// @updateURL https://update.greasyfork.org/scripts/4485/Kleinanzeigen%20Schnellbuttons.meta.js
// ==/UserScript==

(function(){
	var searchUrls = [
		{name:"Amazon", url:"http://www.amazon.de/s?tag=wwwsoftwareca-21&field-keywords=", icon:"http://www.amazon.de/favicon.ico"},
		{name:"eBay.de", url:"http://www.ebay.de/sch/i.html?_nkw=", icon:"http://www.ebay.de/favicon.ico"}
	];

	var priceRx = /\d*(\.\d*)?\s*(EUR(O)?|€)/gi;
	var stateRx = /((sehr)?\s+gut(er|e)?)?\s*(erhalten(es|er|e)?|(top\s+|1a\s+)?zustand)|neuwertig(er|es|e)?|(wie\s+|nagel)?neu(er|es|e)?|unbenutzt|zu\s*verkaufen|\s+top\s+|\s+top$|^top\s+/gi;
	var separatorRx = /\!+|<+|>+|(,|\s|\.|\!|\?)$/gi;
	var verbsRx = /(verkaufe|biete)\s+/gi;
	
	
	function PrepareKeywords(title){
		title = title.replace(priceRx, " ");
		title = title.replace(separatorRx, " ");
		title = title.replace(stateRx, " ");
		title = title.replace(verbsRx, " ");
		title = title.replace(/\s{2,}/gi," ");
		return title;
	}
	
	function GetAdvertsHeaders(){
		var list = document.querySelectorAll(".ad-listitem-main h2");

		if (!list || list.length == 0)
			return null;
		
		return list;
	}
	function InstallButton(h){
		var parent = h.parentNode;
		var buttonsEl = document.createElement("div");
		
		for(var i=0; i<searchUrls.length; i++){
			var buttonEl = document.createElement("a");
			
			buttonEl.style = " margin:3px; float:left; height:16px; width:16px; background: url("+searchUrls[i].icon+")";
			buttonEl.target        = "_blank";			
			buttonEl.href          = searchUrls[i].url + PrepareKeywords(h.textContent);
			buttonEl.alt           = searchUrls[i].name;
			
			buttonsEl.appendChild(buttonEl);
		}
		
		parent.appendChild(buttonsEl);
	}
	function InstallButtons(){
		var headers = GetAdvertsHeaders();
		if (!headers)
			return;
			
		for(var i=0; i<headers.length; i++){
			InstallButton(headers[i]);
		}
	}
	
	window.addEventListener('load', 
		function() { 
			try{
				InstallButtons();
			}catch(e){
				if (typeof(console)!='undefined')
					console.log(e);
			} 
		},
		true
	);
	
})();