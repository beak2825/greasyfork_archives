// ==UserScript==
// @name     	Bulbapedia Cleanup 
// @version  	1.2
// @grant    	none
// @namespace   none
// @description Removes content from Bulbapedia Pokemon pages that doesn't pertain to the games (shows, manga, etc)
// @icon 	https://bulbapedia.bulbagarden.net/favicon.ico
// @match    	https://bulbapedia.bulbagarden.net/wiki/*
// @require  	https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @run-at 	document-idle
// @license     MIT
// @author      hangedmandesign
// @downloadURL https://update.greasyfork.org/scripts/477789/Bulbapedia%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/477789/Bulbapedia%20Cleanup.meta.js
// ==/UserScript==

(function() {
    'use strict';
  	var $ = window.jQuery;
    if (window.top !== window.self) { return; }

    //detect start and end of areas to remove
		var tocHideStart = $("a[href='#Biology']").closest("li");
    var tocHideEnd = $("a[href='#Game_data']").closest("li");
    var hideStart = $("#Biology").closest("h2");
    var hideEnd = $("#Game_data").closest("h2");
    var tocHideElement = $(tocHideStart).nextUntil(tocHideEnd);
    var hideElement = $(hideStart).nextUntil(hideEnd);
    console.log("detected bulba junk ok");
          
    //there's a way to do this more efficiently to include the starting element but whatever
    hideElement.remove();
    hideStart.remove();
    tocHideElement.remove();
    tocHideStart.remove();
})();
