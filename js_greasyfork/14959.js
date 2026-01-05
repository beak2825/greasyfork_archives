// ==UserScript==
// @name        SP_HotKeys
// @namespace   SP_HotKeys
// @description SuperiorPics thread navigation hotkeys
// @include     http://forums.superiorpics.com/ubbthreads/ubbthreads.php/topics/*
// @include		http://forums.superiorpics.com/ubbthreads/ubbthreads.php/ubb/showflat/*
// @grant       GM_info
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     0.0.2
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/14959/SP_HotKeys.user.js
// @updateURL https://update.greasyfork.org/scripts/14959/SP_HotKeys.meta.js
// ==/UserScript==



// @grant       none

const myDebug = false;

if (myDebug) { console.log(GM_info.script.name + " is running."); }

const KEY_RIGHT = 39;
const KEY_LEFT = 37;

/*var d = {
	console: {
		log: function() {
			
		},
		error: function() {
			
		}
	}
};*/


var loading = false;
//var navFound = false;
var nav = null;
var onNavLoadCalled = false;

var mut;

var thePage = {
	backButton: null,
	nextButton: null
};

var backButtonClass = GM_info.script.name + "-backButton";
var nextButtonClass = GM_info.script.name + "-nextButton";



//var tempCB = false;

/*$(document).on("ready", '.pagination', function(e) {
	if (myDebug) { console.log("pagination class found"); }
});*/

mut = new MutationObserver(function() {
	/*if (!tempCB && document.body !== null) {
		alert(document.body);
		$(document.body).load(function() {
			if (myDebug) { alert("body load event has fired."); }
		});
		tempCB = true;
	}*/
	
	
	nav = findNavLoaded();
	if (nav === null) {
		return;
	}
	//navFound = true;
	/*nav.ready(function() {
		if (myDebug) { console.log("nav elem ready() func called"); }
		onNavLoad();
	});*/
	onNavLoad();
	blind();
});

//var mutCfg = { childList: true, attributes: true, subtree: true, attributeFilter: ["class"] };
var mutCfg = { childList: true, subtree: true };


$(document).ready(function() {
	if (myDebug) { console.log("ready event"); }
	blind();
	
	if (myDebug && nav !== null) {
		if (myDebug) { console.log("nav was found before ready event"); }
	}
	if (nav === null) {
		nav = findNavLoaded();
	}
	if (nav === null) {
		if (myDebug) { console.log("ready(): failed to find navbar"); }
		return;
	}
	onNavLoad();
});

$(window).keydown(function(e) {
	//console.log("key pressed: [" + e.which + "]");
	/*if (myDebug && thePage.backButton !== null) {
		console.log(thePage.backButton.parent());
	}*/
	if (isCursorInText()) { return; }
	if (e.which === KEY_RIGHT) {
		if (myDebug) { console.log("right arrow"); }
		
		if (thePage.nextButton !== null) {
			thePage.nextButton.get(0).click();
		}
	} else if (e.which === KEY_LEFT) {
		if (myDebug) { console.log("left arrow"); }
		if (thePage.backButton !== null) {
			thePage.backButton.get(0).click();
		}
	}
});

observe();

/* function defs */

function isCursorInText() {
	//var focus = $(':focus').first();
	var focus = $( document.activeElement );
	if (focus.length == 0) { return false; }
	return isTextEl(focus[0]);
}
function isTextEl(el) {
	var tagName = $(el).prop('tagName').toLowerCase();
	var typeAttr = $(el).attr('type');
	if (typeof(typeAttr) !== 'undefined' && typeAttr !== null) { typeAttr = typeAttr.toLowerCase(); }
	if (tagName === 'textarea') { return true; }
	if (tagName === 'input' && typeAttr === 'text') { return true; }
	return false;
}

function observe() {
	mut.observe(document, mutCfg);
}
function blind() {
	mut.disconnect();
}

function findNavLoaded() {
	// .body_col > div:nth-child(1) > table:nth-child(1)
	var nav = $('.pagination').first();
	if (nav.length == 0) {
		if (myDebug) { console.log("pagination not found"); }
		return null;
	}
	var elemAfter = $('#options_control').first();
	if (elemAfter.length == 0) {
		if (myDebug) { console.log("Elem after pagination not found"); }
		return null;
	}
	if (myDebug) { console.log("pagination WAS found"); console.log(nav); }
	
	return nav;
}

/*function parse() {
	if (myDebug) { console.log('parse'); }
	nav.load(onNavLoad);
	
	if (myDebug) { console.log('checking for nav load'); }
	return true;
}*/

function onNavLoad() {
	if (onNavLoadCalled) { return; }
	if (myDebug) { console.log("nav bar has loaded"); }
	
	var backButton = nav.find(".alt-1 a:contains('<')").first();
	var backIsValid = backButton.is(function(ind, e) {
		return ($(e).text() === '<');
	});
	if (myDebug) {
		if (backIsValid) {
			console.log("Found back button");
		} else {
			console.log("Did not find back button");
		}
	}
	if (backIsValid) {
		thePage.backButton = backButton;
	}
	
	var nextButton = nav.find(".alt-1 a:contains('>')").first();
	var nextIsValid = nextButton.is(function(ind, e) {
		return ($(e).text() === '>');
	});
	if (myDebug) {
		if (nextIsValid) {
			console.log("Found next button");
		} else {
			console.log("Did not find next button");
		}
	}
	if (nextIsValid) {
		thePage.nextButton = nextButton;
	}
	
	onNavLoadCalled = true;
}






