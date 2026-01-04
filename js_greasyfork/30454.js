// ==UserScript==
// @name        Filter Extra Flags
// @namespace   http://vexxed.github.io/
// @description Filtering specific regional flags for int
// @include     http*://boards.4chan.org/int/*
// @include     http*://boards.4chan.org/pol/*
// @include     http*://boards.4chan.org/bant/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     0.01
// @grant       none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/30454/Filter%20Extra%20Flags.user.js
// @updateURL https://update.greasyfork.org/scripts/30454/Filter%20Extra%20Flags.meta.js
// ==/UserScript==

//TODO: Make a native 4chan version, only filter and check new posts when updating
$(window).load(function(){
	dBug("Document is ready!");
	var filteredRegions = ["California", "Iroquois"]; //replace these with any you like
	var regions = [];

	document.addEventListener('ThreadUpdate', function (e) {
		getFlags();
	}, false);

	function matchRegions(filteredFlags, flags){
		for (var i = flags.length - 1; i >= 0; i--) {
			for (var j = filteredFlags.length - 1; j >= 0; j--) {
				if (flags[i].children[0].title == filteredFlags[j]){
					dBug("filtered: " + filteredFlags[j]);
					if ( isVisible(flags[i].parentNode.parentNode.parentNode.previousSibling.children[0]))
						flags[i].parentNode.parentNode.parentNode.previousSibling.children[0].click();
				}
			}
		}
	};

	function isVisible(e) {
    	return !!( e.offsetWidth || e.offsetHeight || e.getClientRects().length );
	}

	function getFlags(){
		regions = document.getElementsByClassName("extraFlag");
		matchRegions(filteredRegions, regions);
	};

	function dBug(data){
		//console.log(data);
	};

	setTimeout(function() {
		getFlags();
    }, 0);
});