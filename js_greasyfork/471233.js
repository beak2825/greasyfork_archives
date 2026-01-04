// ==UserScript==
// @name         Vimeo Player Custom Buttons
// @namespace    http://PennyJim.com/
// @version      6
// @description  Add an interface to add custom buttons to embeded Vimeo players
// @author       PennyJim
// @match        https://embed.vhx.tv/videos/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/471233/Vimeo%20Player%20Custom%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/471233/Vimeo%20Player%20Custom%20Buttons.meta.js
// ==/UserScript==


function addMessageHandler(handler) {
	if (window.onmessage === null)
	{
		window.onmessage = handler;
	} else {
		let oldHandler = window.onmessage
		window.onmessage = function(e) {
			oldHandler(e);
			handler(e);
		}
	}
}

//function addPlayerButton(name, callBack, width, icon, beforeWhat) {
function addPlayerButton(data, origin) {
    let newBtn = document.createElement("button")
	newBtn.classList.add(data.name)
	newBtn.onclick = event => {
		window.top.postMessage({method: data.callBack}, origin)
	}
	newBtn.innerHTML = data.icon;
	newBtn.style.width = data.width;
	newBtn.style.height = "100%";
	newBtn.style.marginLeft = "1em";
	document.querySelector(".vp-controls > div").insertBefore(newBtn, document.querySelector(data.beforeWhat));
	console.log(`${data.name} Button Added`);
	window.top.postMessage({method: "eventCall", event: "buttonAdded"}, origin);
}


(function() {
    'use strict';
	addMessageHandler(function(e) {
		let data = e.data
		if (data.method == "addPlayerButton") {
			addPlayerButton(data, e.origin);
		}
	});
})();