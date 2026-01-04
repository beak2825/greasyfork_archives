// ==UserScript==
// @name         Scale Chatbox with resized sidebar
// @namespace    Niblhenne Swamp
// @version      1.0
// @description  Does a thing the title says it does
// @author       Maguillage
// @match        https://app.roll20.net/editor/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roll20.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454657/Scale%20Chatbox%20with%20resized%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/454657/Scale%20Chatbox%20with%20resized%20sidebar.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var sidebar;
	var currentSidebarStyle;

	var chatbox;
	var tabMenu;

	var waitForDOM = setInterval(checkReadyDOM, 1000);

	function checkReadyDOM() {
		if (document.getElementById("rightsidebar")) {
			clearInterval(waitForDOM);
			doThings();
		}
	}

	var resizeWatcher = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.type == "attributes") {
				currentSidebarStyle = sidebar.getAttribute("style");
				let widthValue = currentSidebarStyle.split("width: ")[1].split(";")[0];
				chatbox.style = "display: block; width: "+widthValue+";";
				tabMenu.style = "width: "+widthValue+";";

			}
		});
	});

	function doThings () {
		sidebar = document.getElementById("rightsidebar");
		currentSidebarStyle = sidebar.getAttribute("style");

		chatbox = document.getElementById("textchat-input");
		tabMenu = sidebar.getElementsByClassName("tabmenu")[0];

		resizeWatcher.observe(sidebar, {
		attributes: true,
		attributeFilter: ["style"]
	});
	}
})();