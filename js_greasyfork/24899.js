// ==UserScript==
// @name        Reddit Enhancer
// @namespace   http://null.frisch-live.de/
// @version     1.85
// @description Extends Reddit and adds some useful Functions. (Requires frisch's UserScript Extender)
// @author      frisch
// @include     http://*.reddit.com/*
// @include     https://*.reddit.com/*
// @exclude     https://*.reddit.com/message/*
// @exclude     http://*.reddit.com/message/*
// @exclude     https://*.reddit.com/search?*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/24899/Reddit%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/24899/Reddit%20Enhancer.meta.js
// ==/UserScript==
console.log("Initializing Reddit Enhancer...");

var settings = {};

var enumKeys = {
	'NONE': -1,
	'BACKSPACE': 8,
	'TAB': 9,
	'ENTER': 13,
	'SHIFT': 16,
	'CTRL': 17,
	'ALT': 18,
	'PAUSE/BREAK': 19,
	'CAPS LOCK': 20,
	'ESCAPE': 27,
	'SPACE': 32,
	'PAGE UP': 33,
	'PAGE DOWN': 34,
	'END': 35,
	'HOME': 36,
	'LEFT ARROW': 37,
	'UP ARROW': 38,
	'RIGHT ARROW': 39,
	'DOWN ARROW': 40,
	'INSERT': 45,
	'DELETE': 46,
	'0': 48,
	'1': 49,
	'2': 50,
	'3': 51,
	'4': 52,
	'5': 53,
	'6': 54,
	'7': 55,
	'8': 56,
	'9': 57,
	'A': 65,
	'B': 66,
	'C': 67,
	'D': 68,
	'E': 69,
	'F': 70,
	'G': 71,
	'H': 72,
	'I': 73,
	'J': 74,
	'K': 75,
	'L': 76,
	'M': 77,
	'N': 78,
	'O': 79,
	'P': 80,
	'Q': 81,
	'R': 82,
	'S': 83,
	'T': 84,
	'U': 85,
	'V': 86,
	'W': 87,
	'X': 88,
	'Y': 89,
	'Z': 90,
	'LEFT WINDOW KEY': 91,
	'RIGHT WINDOW KEY': 92,
	'SELECT KEY': 93,
	'NUMPAD 0': 96,
	'NUMPAD 1': 97,
	'NUMPAD 2': 98,
	'NUMPAD 3': 99,
	'NUMPAD 4': 100,
	'NUMPAD 5': 101,
	'NUMPAD 6': 102,
	'NUMPAD 7': 103,
	'NUMPAD 8': 104,
	'NUMPAD 9': 105,
	'MULTIPLY': 106,
	'ADD': 107,
	'SUBTRACT': 109,
	'DECIMAL POINT': 110,
	'DIVIDE': 111,
	'F1': 112,
	'F2': 113,
	'F3': 114,
	'F4': 115,
	'F5': 116,
	'F6': 117,
	'F7': 118,
	'F8': 119,
	'F9': 120,
	'F10': 121,
	'F11': 122,
	'F12': 123,
	'NUM LOCK': 144,
	'SCROLL LOCK': 145,
	'SEMI-COLON': 186,
	'EQUAL SIGN': 187,
	'COMMA': 188,
	'DASH': 189,
	'PERIOD': 190,
	'FORWARD SLASH': 191,
	'GRAVE ACCENT': 192,
	'OPEN BRACKET': 219,
	'BACK SLASH': 220,
	'CLOSE BRAKET': 221,
	'SINGLE QUOTE': 222,
};
enumKeys.hasValue = function(val){
	for(var k in this)
		if(this[k] === val) {
			return true;
		}

	return false;
};

// User Script Enhancer Properties and Functions
var jq = document.fExt.jq;
var fExtCreateStyle = document.fExt.createStyle;
var fExtAddSub = document.fExt.ctxMenu.addCtxSub;
var fExtMessage = document.fExt.message;
var fExtAddCtxItem = document.fExt.ctxMenu.addCtxItem;
var fExtAddCtxSeparator = document.fExt.ctxMenu.addSeparator;
var fExtClipboard = document.fExt.clipboard;
var fExtGetSelection = document.fExt.getSelection;
var fExtPopup = document.fExt.popup;
var fExtSetLoading = document.fExt.setLoading;

var typeCheck = Object.prototype.toString;
var numberOfSitesLoaded = 1;
var isHiding = false;

var ctxItemUsrHdr, ctxItemUsrHdrPg, ctxItemUsrUnhdr, ctxItemSbHdr, ctxItemSbUnhdr, ctxItemKeywHdr, ctxItemKeywUnhdr, ctxUndo, ctxRedo, ctxItemCpyHtml, ctxItemSett;
var upVoteLinks, downVoteLinks, rSubRedditLinks, rAuthorLinks, postList;

var loc = location.href;
var isSinglePost = location.href.indexOf("/comments/") > 0 || location.href.indexOf("/submit$") > 0;
var isUserPage = location.href.indexOf("/user/") > 0 || location.href.indexOf("/u/") > 0;
var isUserSubmittedPage = isUserPage && location.href.indexOf("/submitted") > 0;
var isMyMulti = location.href.indexOf("/me/m/") > 0;
var isFriendsPage = location.href.indexOf("/r/friends") > 0;
var isSubmitPage = location.href.indexOf("/submit?") > 0;
var isMySavedPage = location.href.indexOf(settings.accountName + "/saved") > 0;
var hiderElements;
var headerHeight = jq("#header").outerHeight(true);
var hideLinks = [];
var userHideLinks = [];
var subHideLinks = [];
var duplicateLinks = [];
var keywordsHideLinks = [];
var rTitleLinks;
var rEnhSub = fExtAddSub("Reddit Enhancer", undefined);
var pstItems = [];
pstItems.onlyVisible = function(){
	return this.filter(function(item){
		return jq("#" + item).is(":visible");
	});
};
pstItems.Next = function(steps){
	return GetFromArray(pstItems.onlyVisible(), pstItems.selected, steps ? steps : 1);
};
pstItems.Previous = function(steps){
	return GetFromArray(pstItems.onlyVisible(), pstItems.selected, steps ? steps * -1 : -1);
};
pstItems.First = function(){
	var visiblePosts = pstItems.onlyVisible();
	return visiblePosts.length > 0 ? visiblePosts[0] : undefined;
};
pstItems.Last = function(){
	var visiblePosts = pstItems.onlyVisible();
	return visiblePosts.length > 0 ? visiblePosts[visiblePosts.length - 1] : undefined;
};

function GetFromArray(array, item, steps) {
	if(array.length === 0)
		return undefined;
	else if(item && jq.inArray(item, array) < 0)
		return undefined;

	var ind = 0;
	if(item)
		ind = array.indexOf(item);

	if(ind < 0)
		ind = 0;

	var stepIndex = (steps < 0 ? steps * -1 : steps);
	var modifier = (steps < 0 ? -1 : 1);

	ind += steps;
	while(ind >= array.length)
		ind -= array.length;

	if(ind < 0)
		ind = array.length - 1;

	return array[ind] === item ? undefined : array[ind];
}

var reloadCancelled = true;
var resourcesLinks = [];
var subColors = {};
var settingTranslation = [
	{ key: "accountName", translation: "Your Profilename", hint: "Required to determine some pages (e.g. your saved pages)" },

	{ key: "markNSFW", translation: "Mark NSFW posts", hint: "Highlights NSFW posts" },
	{ key: "replaceTopNew", translation: "Replace Top with New", hint: "Instead of landing on the Top-Page of a reddit, you'll be redirected to the New-Page instead" },
	{ key: "sortByVotes", translation: "Sort by Votes", hint: "Sorts the posts by votes" },
	{ key: "autoExpandSelectedPost", translation: "Autoexpand Posts", hint: "Causes selected Posts to automatically collapse/expand" },
	{ key: "removeDuplicates", translation: "Remove Duplicates", hint: "Removes duplicate posts by checking the link/source of a post" },
	{ key: "maximumNumberOfSitesToLoad", translation: "Autoload # of Pages", hint: "Let's you load more than one page at once. Currently buggy and will be worked on." },

	{ key: "animationItemTimeout", translation: "Animation Speed", hint: "" },
	{ key: "hideItemTimeout", translation: "Posthiding Timeout", hint: "" },
	{ key: "imagePreloadingTimeout", translation: "Preloading timeout", hint: "" },

	{ key: "hideUsers", translation: "Hide Users", hint: "If true, users in the 'Users to hide'-list will be hidden" },
	{ key: "hideUsersNSFWonly", translation: "Hide Users NSFW posts only", hint: "Only hide NSFW posts by the users" },
	{ key: "usersToHide", translation: "Users to hide", hint: "" },

	{ key: "hideSubs", translation: "Hide Subs", hint: "If true, subsreddits in the 'Subs to hide'-list will be hidden" },
	{ key: "subsToHide", translation: "Subs to hide", hint: "" },

	{ key: "hideKeywords", translation: "Hide Keywords", hint: "If true, posts containing any keyword fromt he 'Keywords to hide'-list will be hidden" },
	{ key: "keywordsToHide", translation: "Keywords to hide", hint: "" },

	{ key: "panelView", translation: "Panelview", hint: "Not yet implemented" },

	{ key: "shortcuts", translation: "Keyboard Shortcuts", hint: "" },
	{ key: "voteUp", translation: "Upvote selected Post", hint: "" },
	{ key: "previousPost", translation: "Select previous Post", hint: "" },
	{ key: "voteDown", translation: "Downvote selected Post", hint: "" },
	{ key: "toggleSelected", translation: "Expand/Collapse selected Post", hint: "" },
	{ key: "hideSelected", translation: "Hide selected Post", hint: "" },
	{ key: "nextPost", translation: "Select next Post", hint: "" },
	{ key: "hideAll", translation: "Hide all Posts", hint: "Also reloads the page after hiding all posts (can be cancelled)" },

	{ key: "undoLast", translation: "Undo last action", hint: "Activates the latest element in the undo list" },
	{ key: "redoLast", translation: "Redo last action", hint: "Activates the latest element in the redo list" },

	{ key: "previousImage", translation: "Display previous Image", hint: "Used for RES-Albums" },
	{ key: "nextImage", translation: "Display next Image", hint: "Used for RES-Albums" },

	{ key: "zoomIn", translation: "Zoom in", hint: "Used for Images" },
	{ key: "zoomOut", translation: "Zoom out", hint: "Used for Images" },
	{ key: "rotateLeft", translation: "Rotate left", hint: "Used for Images" },
	{ key: "rotateRight", translation: "Rotate right", hint: "Used for Images" }
];

// Images
var imgBooks = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTMyQTVEQUUyQTIyMTFFMTlGMThGNDk3QjgyMTJCNjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTMyQTVEQUYyQTIyMTFFMTlGMThGNDk3QjgyMTJCNjUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFMzJBNURBQzJBMjIxMUUxOUYxOEY0OTdCODIxMkI2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFMzJBNURBRDJBMjIxMUUxOUYxOEY0OTdCODIxMkI2NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgQa4kwAAAGQSURBVHjazFaBjYMwDIQXAzACI4BYoN2AblA2oBO0neD5CWADukG7QAUbPCNkA95+HZKVJyGlIL0lK62d+OLLEfCHYfDYfN/3pixN0x0NFbl6Pp+J96KN9QPTBAIIafgkPxryEY8E3rsAfhiKZDR8W0AuyLeunQUTu2SadgjxbnPyEPkY+VjkOX4EtbdZIBS5j0XJrrTwonXRiLVX8pLiHMsQ8106qgDSkR9G7ie66NBlBPpCw/lW+HvQgcZCewJRmFyQn/UuUCQTwJ6FGaPqzjTZQ6EIMcUbwOJWxHV6CyjVLgZYMRH7QvFGioRAHhpVmZPqLFaDjvH3iekVVDWiS/fnSDcIQ9L1e4ZQYjsH8kpH0hoCUBBPaJiTC9UtBootuR5yVouoczQWRiKUuQkQn9seir1PURqsBKRfRd5WQO0q8nawWXmvKYb/B1RuUD//A0TyPCHxEA9cv3ADvC6hmvUY8Oe+gsQrYHAEueFmV05fQQuNb/XyXTHUDlSVb6uOiuR4lfcTG2CQzrb+R4ABALaxlqMMGvrUAAAAAElFTkSuQmCC";
var imgDuplicate = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDQxOEI0NzM3NDlBMTFFMTk1RDhCRjg3NzZFMkRGMjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDQxOEI0NzQ3NDlBMTFFMTk1RDhCRjg3NzZFMkRGMjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENDE4QjQ3MTc0OUExMUUxOTVEOEJGODc3NkUyREYyMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENDE4QjQ3Mjc0OUExMUUxOTVEOEJGODc3NkUyREYyMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ph2iTEwAAAGJSURBVHjatFbBcYMwEBSEAsiXV0ogwydPpwPTgd0BVMCkAruDuAOnA7sBZsgvT//40oFzx6wyZwfQacA7cyMBkvZuTzoRGEKWZWtqdmQvZhp7so+6rjvjiQAkR485Ddm7L1mESOwC7O2XeQAiIdcoyRLSsnRX7tDHYIJktrSRYqJKWnKowNiU7ETPN2ThFAMNjjXSCkcsLFmsIpJwbRL6fr57dUMWOiZ3MzdbT+YVkRJDjqUU1S5akoUUeBb5XVHDVpEVoXkQkLO9z/Z2grxPsbVXkC9nIs4xfTOL5AgkJyTeRvDvgC8hHZ+zHNWgpPZAFg/VujmRHMWB3kKmDdl5ESIhV08Asli8K2cT3ZEc0F5ETWQJm9EcoUpr8LcgIvmEdWMkluiCfqUk4y18wIIlCNlex0isdCWS2ifX7vuJO4o934jEG83VHqIq5yIyF3K0hbjkGufPiSL5V0vg+z8hb2fNgfXNYX9hYmxl1wh8vJqB/Mk1om3bnyRJvqn7NlRaFGpsWfJfAQYApiSqoZCrNjYAAAAASUVORK5CYII=";
var imgDelCat = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAG5SURBVEiJ3ZaxbhRBDIY/r45yOtImokVKc+N5gm0okiIFxUVpUiHlEWgipeENkNIkDQI6CiK60zZ0Z6p7ACQKmvAGic4UzMBmdTmSvRUI/mZ31rP+x/5tayTG+MDdD6qqOnJ3ZQCIiC0Wi5ci8srMrgBG7n4gImfuPgQHAO6uLZ/nAFVVVUeDMXTQ9l0Nla5laPselRczkyFJVPWGFtWQzlfh/yMaLftY8lt06+b7NqzS+e9G1D3ZEBX5T2n0GXgLfDCzj63vx8CzslgnoivgRQjhsZk975BgZichhK2ylhjjjdP3QUpp4u57QBk5JiLvZrPZm7JnaeruClV9yI/pvNMxPXL3p6q6Dxya2bc+Gn0NIWw1TXPdIvkEbAIbec8l8CXbzoHdPhGdNk1znVKatEjqTDTNe+pMNAV2UkqT3n2UNSETbJrZXFXrvH+uqtvZhrvvraNREX4DmKpqbWZzgEwy5Vcq9c9NbxExgBjjk3v+a/l5CdQlXaq6nSOrsw3AZDweH4rI2T0Ijs3sJPfOa35fDFFE9qXHdetneavqe1aXdwQuzGxX1rlmrWjYggtyw65FVHCXEfQdGszctvjNerkAAAAASUVORK5CYII=";
var imgAbort = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNDZCQkYwMzM2Q0ExMUUyQjY5RUUwNzIwODVEMzBFMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowNDZCQkYwNDM2Q0ExMUUyQjY5RUUwNzIwODVEMzBFMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA0NkJCRjAxMzZDQTExRTJCNjlFRTA3MjA4NUQzMEUzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA0NkJCRjAyMzZDQTExRTJCNjlFRTA3MjA4NUQzMEUzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Mya9PgAAAUlJREFUeNpi/P//PwM9ACPdLWJkZMSqwNjYWBJIxQKxOxAbALEQVOodEF8A4p1AvPjs2bPPsemHm4/LIqAFfECqGYgzgZiVgIN/A/F0IK4FWviJaIuAlmgBqc1ArERiCN0DYl+gZdcIWgS15CAQi5AZHW+A2B5mGVaLoMF1ngyfYPOZISgYYeYzoSlopoIlDFAzmrGmOhMTE1DqekhExBMLQAlE/syZM8/RfRRLRUsYoGbFwjjIFrnTIJ/CzWRBEjTAolABiD+SYPB7NL4BNouEsGj8CEw5H4i1BZhq0YWEsAUdTQGyRe9oYP47bEEHKiCd0MMcS3CQAi5g89FOGvhoJzaLFkMzGQMVM+xiDIug9cl0Klo0HbmOQk91tdACkVJwD2oW7hqWLtUELSs+rBkWqtAQiCcRmUB+Q9UaIlsysI2TYdOuAwgwAC/sonL067x5AAAAAElFTkSuQmCC";
var imgDelUser = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWhJREFUeNrEVottgzAQxVEGcDdwN4jEAA0bZAPMBFEmiDJB1AkKE2QEvAAqGzQjMELP1SOyELbPMlKfdLL4nN/5Pg9EEUBZlkdazmR2lWQTmSH7HIbBFAkQARJNy1fAtyGyNouISA60fDP8K+7Jdp77Z2agNfdEPqIT0/+USySZ/jKXaHP8O9HI9B9zibjDaHKJOqZ/t4UyPCLta2hYqy2a4QJtW4O932yidRG9e+kchLeG8CqyJ2rXufIUa28VCcQG0ZNp512F6x7Pg6I6R6k9aXsnu3ueL9HSyRqxQnBFGny4ITV9QomqPQgkasERyRbBpKAWILHRHRgOE6XhjXx+nJqMnu6Uzp5Pe6IHk8SVHLdJLmsfP5RhTq/aR+qxxCtCh+xOm06RT8jfiVIgaVOFZtAL8qAm7lIUGNApGjdroiWqUlQY/xMjuq9gzpERiz8fW68P5PcYE1RMvo4Na1TrOOBq3a8AAwDKrW/Ty1UcbgAAAABJRU5ErkJggg==";
var imgTree = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REIzNzg4NjJDMjdBMTFFMTgyQTdCNUFCM0MyNUJCMTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REIzNzg4NjNDMjdBMTFFMTgyQTdCNUFCM0MyNUJCMTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4REUwQTc2QkMyNzgxMUUxODJBN0I1QUIzQzI1QkIxNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4REUwQTc2Q0MyNzgxMUUxODJBN0I1QUIzQzI1QkIxNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqK2+9QAAAEGSURBVHjavJWNDYMgEIWFCewGHcHECRihG+gGdhLdQDdoN6ALkLpBR5AN2iM5EtI09fg5LyFEJH4+jnsnqgLRtu0GU/1ni5VVmaj33osCas4wvfb2iUyIU6JhNGygGIiLnByNCLGUzSJRzQxTh48KlZVVBJAhgPTGmAdBlRWUGoCPnRDiADOuX2F9ov6gpNQAQpoAssRAyEeHEB1A+tgjp+ZIo7LVHVnKBZIRFuMgCtRYTlB2UEEWi1Nzg5SHYbHygCAvLj/+pnUpMEmpaoTdv2BDDEgkWtAYWNBCcZcSpnqBcePsRx5mCTaW3WGfRzQ+f+1Xtsb3o6Vv7CCEvY/yut1a/AgwACqvUiICIj/gAAAAAElFTkSuQmCC";

// Variables - End

// Initialization - Start
GMLoad();

// Initialization - Styles - Start
jq("body").css("margin-bottom", "0");
// Initialization - Styles - End

// Initialization - Controls - Start
if (isSinglePost) {
	jq("div.media-preview").attr("style","");
	jq("#upvoter,#downvoter,#expander,#hideAll,#hideSelected,#toggleUserHidden,#toggleSubsHidden,#toggleKeywordsHidden,#toggleDuplicateHidden").addClass("disabled");
}

// Initialization - Controls - Settings Dialog
var settingsDialog = '<div style="display:none" id="rEnhSettings"><div class="tableContainer"><table cellspacing="0" cellpadding="0" border="0" width="700px"><colgroup><col width="200px" /><col width="auto" /></colgroup>';
settingsDialog += '<thead><tr><th class="label">Setting</th><th class="setting">Value</th></tr></thead>';

function BuildSettings(settingsObject) {
	for (var key in settingsObject) {
		var varType = typeof settingsObject[key];

		if (varType === "object") {
			if (typeCheck.call(settingsObject[key]) === '[object Array]')
				AddSettingToDialog(key, "list");
			else {
				settingsDialog += '<tr><td class="label" colspan="2"><b>' + key + '</b></td></tr>';

				if (key === 'shortcuts') {
					for (var shortcut in settingsObject[key]) {
						AddSettingToDialog(shortcut, 'key');
					}
				} else BuildSettings(settingsObject[key]);
			}
		} else AddSettingToDialog(key, varType);
	}
}

function getTranslationObject(key) {
	for (var i in settingTranslation) {
		if (settingTranslation[i].key === key) {
			return settingTranslation[i];
		}
	}

	return { key: key, translation: key, hint: "" };
}

function AddSettingToDialog(key, varType) {
	var transObject = getTranslationObject(key);
	settingsDialog += '<tr title="' + transObject.hint + '">';
	if (varType === "list") {
		settingsDialog += '<td class="label" colspan="2">' + transObject.translation + '</td>';
		settingsDialog += '</tr>';
		settingsDialog += '<tr title="' + transObject.hint + '">';
		settingsDialog += '<td class="setting" colspan="2"><textarea name="' + key + '" class="value" cols="80" rows="7" title="Separate entries by using comma"></textarea></td>';
	} else {
		settingsDialog += '<td class="label">' + transObject.translation + '</td>';
		if (varType === "key") {
			settingsDialog += '<td><select class="value" name="' + key + '">';
			for (var knownKey in enumKeys) {
				settingsDialog += '<option value="' + enumKeys[knownKey] + '">' + knownKey + '</option>';
			}
			settingsDialog += '</select><input type="Button" class="DetectShortcut" value="Assign" /></td>';
		} else {
			var inputType;
			switch (varType) {
				case "boolean":
					inputType = "checkbox";
					break;
				case "number":
					inputType = "number";
					break;
				case "string":
					inputType = "text";
					break;
				default:
					console.log("Cannot add setting " + key + " to settings dialog because unkown type " + varType);
					return;
			}

			settingsDialog += '<td class="setting">' + '<input type="' + inputType + '" class="value" name="' + key + '"></td>';
		}
	}
	settingsDialog += '</tr>';
}

jq(document).on("click", "input.DetectShortcut", function(e) {
	fExtMessage("Press the key to assign or press ESC to unassign.");
	jq(document).bind("keydown", { sender: this }, AssignShortcut);
});

function AssignShortcut(e){
	var sender = e.data.sender;
	var jqSender = jq(sender);

	e.preventDefault();

	var kc = e.which;

	if(kc != enumKeys.ESCAPE) {
		if(!enumKeys.hasValue(kc)){
			fExtMessage("Invalid Key! Choose a different key or press ESC to unassign.");
			return false;
		}
		else
			jqSender.parent().find("select").val(kc);
	}
	else
		jqSender.parent().find("select").val(enumKeys.NONE);


	fExtMessage(undefined);

	jq(document).unbind("keydown", AssignShortcut);
	return false;
}

BuildSettings(settings);

settingsDialog += '</table></div>';
settingsDialog += '<div class="settingsButtons"><a href="#" id="renhSettingsClose">Close</a><a href="#" id="renhSettingsSave">Save</a></div>';
settingsDialog += '</div>';
jq("body").append(settingsDialog);
// Initialization - Controls - End

// Moving the navigation buttons
var jqNavButtons = jq("div.nav-buttons");
if (jqNavButtons) {
	if (jqNavButtons.length === 1 && settings.maximumNumberOfSitesToLoad > 1) {
		GrabContent(jq("body").html());
	} else MainInitialization();
} else MainInitialization();

function MainInitialization() {
	InitializeElements();
	InitializeStyles();
	InitializeEventHandlers();


	var fnHandleShortcut;
	if (!isSinglePost) {
		fnHandleShortcut = handleShortcutForOverview;
		postList = jq("#siteTable").find("div.thing");

		postList.each(function(){
			jq(this).find("div.midcol").find("div.unvoted").each(function(index, item) {
				var jqItem = jq(item);
				var unvotedVal = jqItem.text();
				var multiplier = unvotedVal.indexOf("k") >= 0 ? 1000 : 1;
				var pts = parseFloat(unvotedVal.replace("k",""));
				if(isNaN(pts))
					pts = 0;
				else
					pts = pts * multiplier;
				if (pts > 100) jqItem.parent().css("background-color", "#99FF99");
				else if (pts > 0) jqItem.parent().css("background-color", "#CCFFCC");
				else if (pts < -10) jqItem.parent().css("background-color", "#FF9999");
				else if (pts < 0) jqItem.parent().css("background-color", "#FFCCCC");
				jqItem.parents("div.thing:first").data("VoteValue",pts);
			});
		});

		if (!isUserPage) {
			if(settings.sortByVotes){
				// Marks Rating of Posts
				postList.sort(function(a, b) {
					var scoreA = parseInt(jq(a).data("VoteValue"));
					var scoreB = parseInt(jq(b).data("VoteValue"));

					if (scoreA > scoreB)
						return -1;
					else if (scoreA < scoreB)
						return 1;
					else
						return 0;
				});

				postList.detach();
				postList.appendTo(jq("#siteTable"));
			}
		}

		for(var i = 0; i < postList.length; i++){
			var post = jq(postList[i]);
			if(!post.is(":visible"))
				continue;

			var hideBtn = post.find("form.hide-button");
			var eventData = { thingID: post.attr("id") };
			hideBtn.bind("click", eventData, handleHideClick);
		}
	}
	else {
		jq("div.thing:first").find("img, video").each(function() {
			jq(this).attr("style","width: auto !important");
		});
		jq("div.thing:first").find("iframe").each(function() {
			jq(this).attr("style","width: 100% !important");
		});
		var pstID = jq("div.thing:first").attr("id");

		fnHandleShortcut = handleShortcutForSinglePage;
		postList = jq(".sitetable").find("div.thing").not("#" + pstID);

		postList.each(function(index, item) {
			pstItems.push(item.getAttribute("id"));
		});
	}

	jq(document).bind("keydown", fnHandleShortcut);

	jq(document).on("focusin", "input, textarea, select", function(e) {
		jq(document).unbind("keydown", fnHandleShortcut);
	});
	jq(document).on("focusout", "input, textarea, select", function(e) {
		jq(document).bind("keydown", fnHandleShortcut);
	});

	// Removal of sponsor divs
	jq("[class^='sponsor'").remove();

	upVoteLinks = jq(".up:not(.archived)");
	downVoteLinks = jq(".down:not(.archived)");
	rSubRedditLinks = jq("a.subreddit");
	rAuthorLinks = jq("a.author");

	rAuthorLinks.each(function(index, item) {
		var href = item.getAttribute("href");
		if (href.indexOf("/submitted") === -1)
			item.setAttribute("href", href + "/submitted/");
	});

	// Holy crap that new outbound url remapping is annoying af... here let's fix this shit
	jq("a[data-href-url]").each(function() {
		var jqThis = jq(this);
		var currentDataHref = this.getAttribute("data-href-url");
		this.setAttribute("data-outbound-url", currentDataHref);
		this.setAttribute("href", currentDataHref);
	});

	if (settings.replaceTopNew) {
		jq("a.subreddit").each(function(index, item) {
			var hrefLink = item.getAttribute("href");
			if (!hrefLink.match(".*/$")) {
				hrefLink = hrefLink + "/";
			}
			hrefLink = hrefLink + "new";
			item.setAttribute("href", hrefLink);
		});
	}

	jq("span.nsfw-stamp").each(function(index, item) {
		var jqItem = jq(item).parent("li");
		var parent = jqItem.parents("ul.flat-list.buttons");
		if (settings.markNSFW) {
			jqItem.parents("div.entry:first").addClass("NsfwItem");
		}
		jqItem.detach().appendTo(parent);
		jqItem.parents("div.thing:first").addClass("NsfwPost");
	});

	jq("span.spoiler-stamp").each(function(index, item) {
		var jqItem = jq(item).parent("li");
		var parent = jqItem.parents("ul.flat-list.buttons");
		jqItem.detach().appendTo(parent);
		jqItem.parents("div.thing:first").addClass("SpoilerPost");
	});

	// remove Gild and Share button
	jq("li.give-gold-button, li.share").remove();
	jq("li a:contains('promoted')").parent().remove();
	jq("li a:contains('gilded')").parent().remove();
	jq("li a:contains('rising')").parent().remove();
	jq("li a:contains('controversial')").parent().remove();

	// highlight hide/unhide
	var hideSubsFromLocation = false;
	var hideUsersFromLocation = false;

	if (!isMyMulti && !isMySavedPage && !isSinglePost && !isFriendsPage) {
		hideSubsFromLocation = true;
		hideUsersFromLocation = true;
	}

	InitializeContextMenu();

	if (!isSinglePost) {
		jq("a.comments.empty").each(function(index, item) {
			Mark(jq(item), "uncommented");
		});

		jq("span.domain").each(function(index, span) {
			var item = jq(span).find("a");
			var jqItem = jq(item);
			var parentItem = jqItem.parents("div.entry");
			var txt = jqItem.text();

			if (txt.indexOf("youtu") >= 0)
				Mark(parentItem, "video");
			else if (txt.indexOf("imgur") >= 0 || txt.indexOf("gfycat") >= 0)
				Mark(parentItem, "image");
		});

		postList.find("a.title").each(function() {
			var text = this.text;
			if (text.length > 180) {
				var spacerInd = text.substring(0, 175).lastIndexOf(" ");
				this.setAttribute("title", "..." + text.substring(spacerInd));
				this.text = text.substring(0, spacerInd) + "... (more)";
			}
		});

		postList.each(function(index, item) {
			pstItems.push(item.getAttribute("id"));
		});

		for(var i = 0; i < pstItems.length; i++){
			var jqThing = jq("#" + pstItems[i]);
			var tagline = jqThing.find("p.tagline");
			tagline.detach();
			var subReddit = tagline.find("a.subreddit");
			subReddit.detach();
			var first = jqThing.find("div.entry p:first");
			var jqDiv = jq("<span class='thingUserSubInfo'></span>");
			jqDiv.insertBefore(first);
			var flatlistButtons = jqThing.find("ul.flat-list.buttons");
			flatlistButtons.detach();

			tagline.appendTo(jqDiv);
			subReddit.appendTo(jqDiv);
			flatlistButtons.appendTo(jqDiv);


			if (settings.removeDuplicates) {
				var resource = jqThing.find("a.thumbnail").get(0);
				if(resource) {
					if (resourcesLinks.indexOf(resource.href) >= 0) {
						if (!jqThing.hasClass("duplicateHidden"))
							jqThing.addClass("duplicateHidden");

						AddToHideLinks(jqThing);
						duplicateLinks.push(jqThing);
					} else
						resourcesLinks.push(resource.href);
				}
			}
		}

		jq("div.thing.promotedlink").each(function() {
			AddToHideLinks(jq(this));
		});

		if (!isFriendsPage && !isUserSubmittedPage) {
			rAuthorLinks.each(function(index, item) {
				var jqItem = jq(item);
				var userName = jqItem.text().replace("/r/", "").replace("r/","");
				var userIndex = jq.inArray(userName, settings.usersToHide);
				var itemThing = jqItem.parents("div.thing:first");
				if (userIndex >= 0) {
					var hideThisPost = settings.hideUsers &&
						!isUserPage &&
						(settings.hideUsersNSFWonly && jqItem.parents("div.entry").hasClass("NsfwItem") || !settings.hideUsersNSFWonly);

					if (hideThisPost)
						AddToHideLinks(itemThing);

					userHideLinks.push(itemThing);
					itemThing.addClass("userHidden");
				}
			});
		}

		var hideThisPost = settings.hideKeywords && !isUserPage;
		for (var iKW = 0; iKW < settings.keywordsToHide.length; iKW++) {
			var kwItem = settings.keywordsToHide[iKW];
			if (kwItem) {
				jq("a.title:contains(" + kwItem + ")").each(function(jndex, jtem) {
					var thing = jq(jtem).parents("div.thing:first");

					if (hideThisPost)
						AddToHideLinks(thing);

					keywordsHideLinks.push(thing);
					if (!thing.hasClass("keywordsHidden"))
						thing.addClass("keywordsHidden");
				});
			}
		}

		if (loc.indexOf("/r/all") >= 0 || loc.indexOf("/r/popular") >= 0) {
			rSubRedditLinks.each(function(index, item) {
				var subName = item.text.replace("/r/", "").replace("r/","");
				var subIndex = jq.inArray(subName, settings.subsToHide);
				if (subIndex >= 0) {
					var itemThing = jq(item).parents("div.thing:first");
					if (hideSubsFromLocation)
						AddToHideLinks(itemThing);
					subHideLinks.push(itemThing);
					itemThing.addClass("subsHidden");
				}
			});
		}

		jq("#toggleSubsHidden").find("span").text(subHideLinks.length);
		jq("#toggleUserHidden").find("span").text(userHideLinks.length);
		jq("#toggleKeywordsHidden").find("span").text(keywordsHideLinks.length);
		jq("#toggleDuplicateHidden").find("span").text(duplicateLinks.length);

		if(hideLinks.length > 0)
			HideAndAction(hideLinks, 0, null, "enhance");
		else
			InitializeHider();

		var subs = jq("a.subreddit");
		if (subs.length > 0) {
			subs.each(function(index, item) {
				var jqItem = jq(item);
				var subText = jqItem.text().replace("/r/", "").replace("r/","");
				var subColor = subColors[subText];

				if (!subColor) {
					subColor = getRandomColor();
					subColors[subText] = subColor;
				}

				//jqItem.detach().prependTo(eleParent);
				jqItem.text(subText);

				jqItem.parents("div.thing:first").css("background-color", subColor);
			});
		} else {
			jq("span.domain").each(function(index, span) {
				var item = jq(span).children("a");

				if(item){
					var subText = item.text().replace("/r/", "").replace("r/","");
					var subColor = subColors[subText];

					if (!subColor) {
						subColor = getRandomColor();
						subColors[subText] = subColor;
					}

					item.parents("div.thing:first").css("background-color", subColor);
				}
			});
		}

		jq(".last-clicked").removeClass("last-clicked");
		jq(".promotedlink").remove();

		jq("span.author:contains('[deleted]')").parents("div.thing").each(function(){
			jq(this).find("a:contains('hide')").click();
		});

		if (userHideLinks.length === 0) {
			jq("#toggleUserHidden").attr("style", "background-color: #808080 !important; color: #CFCFCF; border: 1px solid black;");
		} else {
			jq("#toggleUserHidden").click(function(e) {
				ToggleVisibility(e, this, ".userHidden");
				return false;
			});
		}
		if (subHideLinks.length === 0) {
			jq("#toggleSubsHidden").attr("style", "background-color: #808080 !important; color: #CFCFCF; border: 1px solid black;");
		} else {
			jq("#toggleSubsHidden").click(function(e) {
				ToggleVisibility(e, this, ".subsHidden");
				return false;
			});
		}
		if (duplicateLinks.length === 0) {
			jq("#toggleDuplicateHidden").attr("style", "background-color: #808080 !important; color: #CFCFCF; border: 1px solid black;");
		} else {
			jq("#toggleDuplicateHidden").click(function(e) {
				ToggleVisibility(e, this, ".duplicateHidden");
				return false;
			});
		}
		if (keywordsHideLinks.length === 0) {
			jq("#toggleKeywordsHidden").attr("style", "background-color: #808080 !important; color: #CFCFCF; border: 1px solid black;");
		} else {
			jq("#toggleKeywordsHidden").click(function(e) {
				ToggleVisibility(e, this, ".keywordsHidden");
				return false;
			});
		}

		var navButton = jq("div.nav-buttons").find(".next-button").find("a:first");
		if (navButton.length === 1) {
			navButton.prepend().appendTo("#postNavigation");
			var navButtonPrev = jq("div.nav-buttons .prev-button a");
			if (navButtonPrev)
				navButtonPrev.prepend().appendTo("#postNavigation");
		}
		jq("div.nav-buttons").remove();
	}

	fExtMessage(undefined);
}
// Initialization - End

// Events - Start
function HideAllClick(e) {
	if(e)
		e.preventDefault();

	if(jq("#hideAll").text().indexOf("?") >= 0)
		return;

	isHiding = true;

	var siteTable = jq("#siteTable");
	siteTable.css("display", "block");
	postList.css("display", "block");
	siteTable.css("height", siteTable.outerHeight(true) + "px");

	siteTable.find("div.thing").each(function(index, thing) {
		var jqThing = jq(thing);
		var offs = jqThing.offset();
		var top = parseInt(offs.top);
		var width = jqThing.width();
		var height = jqThing.height();

		setTimeout(function() {
			jqThing.css({
				top: top,
				left: 0,
				width: width,
				height: height,
				position: "absolute"
			});
		}, settings.animationItemTimeout);
	});


	reloadCancelled = false;
	setTimeout(function() {
		if(pstItems.selected)
			pstItems.jqSelected.animate({ scrollTop: pstItems.jqSelected.offset().top }, 0);

		HideAndAction(hiderElements, 0, null, "reload");
	}, settings.hideItemTimeout);
	jq(this).hide();

	return false;
}

function HideSelectedClick(e) {
	if (pstItems.selected) {
		var selPst = pstItems.selected;
		jq("#nextPost").click();
		Hide(jq("#" + selPst), false, false);
	}
	else
		MakeActivePost(undefined, pstItems.Next());

	if(e)
		e.preventDefault();
	return false;
}

// Kontext-Menü
jq("#fExtContextMenu").on("fExtContextMenuOpening", function(event, actor) {
	var txt = actor.text();
	var jqThing = getThingForCtxActor(actor);
	var usrTxt = 'Select a User';
	var subTxt = 'Select a Subreddit';
	var keywTxt = 'Select word(s)';

	ctxItemUsrHdr.Toggle(false);
	ctxItemUsrHdrPg.Toggle(false);
	ctxItemUsrUnhdr.Toggle(false);

	ctxItemSbHdr.Toggle(false);
	ctxItemSbUnhdr.Toggle(false);
	if(jqThing.length === 1) {
		var usrTxtFnd = jqThing.find(".author:first").text();
		var subTxtFnd = jqThing.find(".subreddit:first").text().replace("/r/","");

		if(usrTxtFnd !== "") {
			usrTxt = usrTxtFnd;
			var usrIndex = jq.inArray(usrTxt, settings.usersToHide);
			ctxItemUsrHdr.Toggle(usrIndex < 0);
			ctxItemUsrHdrPg.Toggle(usrIndex < 0);
			ctxItemUsrUnhdr.Toggle(usrIndex >= 0);
		}
		if(subTxtFnd !== "") {
			subTxt = subTxtFnd;
			var subIndex = jq.inArray(subTxt, settings.subsToHide);

			ctxItemSbHdr.Toggle(subIndex < 0);
			ctxItemSbUnhdr.Toggle(subIndex >= 0);
		}
	}

	var selText = fExtGetSelection();
	var keywIndex = jq.inArray(selText, settings.keywordsToHide);
	bCanHide = selText !== "" && keywIndex < 0;
	bCanUnhide = selText !== "" && keywIndex >= 0;

	ctxItemKeywHdr.Toggle(bCanHide);
	ctxItemKeywUnhdr.Toggle(bCanUnhide);
	ctxItemKeywHdr.ItemText("Hide Keywords - '" + (selText || keywTxt) + "'");
	ctxItemKeywUnhdr.ItemText("Unhide Keywords - '" + (selText || keywTxt) + "'");

	ctxItemUsrHdr.ItemText("Hide User - " + usrTxt);
	ctxItemUsrHdrPg.ItemText("Hide User and open Page - " + usrTxt);
	ctxItemUsrUnhdr.ItemText("Unhide User - " + usrTxt);

	ctxItemSbHdr.ItemText("Hide Sub - " + subTxt);
	ctxItemSbUnhdr.ItemText("Unhide Sub - " + subTxt);

	ctxRedo.Toggle(ctxRedo.find("li.ctxItem").length > 0);
	ctxUndo.Toggle(ctxUndo.find("li.ctxItem").length > 0);
});

if (!isSinglePost && !isSubmitPage) {
	jq(document).on("click", "div.thing, div.thing *", function(e) {
		if(e.target.nodeName === "A" || e.target.nodeName === "LI")
			return true;

		var jqThing;
		if(e.target.nodeName === "DIV" && jq.inArray("thing", e.target.classList) >= 0)
			jqThing = jq(e.target);
		else if(jq(e.target).parents("div.thing:first").length === 1 && (e.target.nodeName === "SPAN" || (e.target.nodeName === "DIV" && jq.inArray("entry", e.target.classList) >= 0)))
			jqThing = jq(e.target).parents("div.thing:first");

		if (jqThing && jqThing.is(":visible") && jqThing.attr("id") != pstItems.selected) {
			return MakeActivePost(pstItems.selected, jqThing.attr("id"));
		}
		else return true;
	});
}

jq("#topPost").click(function() {
	MakeActivePost(pstItems.selected, pstItems.First());
	return false;
});

jq("#botPost").click(function() {
	MakeActivePost(pstItems.selected, pstItems.Last());
	return false;
});

jq("#prevPost").click(function() {
	MakeActivePost(pstItems.selected, pstItems.Previous());
	return false;
});

jq("#nextPost").click(function() {
	MakeActivePost(pstItems.selected, pstItems.Next());
	return false;
});

jq("#frPost").click(function() {
	var pst = pstItems.selected;
	var pstNew = pst;
	pstNew = pstItems.Previous(5);

	MakeActivePost(pst, pstNew);
	return false;
});

jq("#ffPost").click(function() {
	var pst = pstItems.selected;
	var pstNew = pst;

	MakeActivePost(pstItems.selected, pstItems.Next(5));
	return false;
});

// Events - Settings
function SetSettingsValues(settingsObject) {
	for (var key in settingsObject) {
		var varType = typeof settingsObject[key];

		SetSettingValue(key, varType, settingsObject[key]);
	}
}

function SetSettingValue(key, varType, value) {
	var settingsElement = jq("#rEnhSettings").find("[name='" + key + "']");

	switch (varType) {
		case "boolean":
			if (value)
				settingsElement.attr("checked", "true");
			else
				settingsElement.removeAttr("checked");
			break;
		case "number":
			settingsElement.val(value);
			break;
		case "string":
			settingsElement.val(value);
			break;
		case "object":
			if (typeCheck.call(value) === '[object Array]')
				settingsElement.val(value.toString());
			else
				SetSettingsValues(value);
			break;
		default:
			console.log("Cannot get setting " + key + " to settings dialog because unkown type " + varType);
			break;
	}
}

function ShowSettings() {
	SetSettingsValues(settings);

	jq("#rEnhSettings").show();
	return false;
}

function SaveSettingsDialog(e) {
	e.preventDefault();

	jq("#rEnhSettings").find("input, textarea, select").each(function() {
		var val;
		var key = this.name;
		var tag = this.tagName;

		switch (tag) {
			case "INPUT":
				var type = this.type;
				switch (type) {
					case "checkbox":
						val = Boolean(this.checked);
						break;
					case "number":
						val = parseFloat(this.value);
						break;
					case "text":
						val = this.value;
						break;
					case "button":
						break;
					default:
						console.log("unhandled input type " + type + " for key " + key);
						break;
				}
				break;
			case "TEXTAREA":
				val = this.value.split(",");
				break;
			case "SELECT":
				val = parseInt(this.value);
				break;
			default:
				break;
		}

		if (val !== undefined) {
			if (key in settings)
				settings[key] = val;
			else if (key in settings.shortcuts)
				settings.shortcuts[key] = val;
		}
	});
	GMSave();

	fExtPopup("Settings saved!");

	return false;
}
// Events - End

// Functions - Start
function handleShortcutForOverview(e) {
	switch (e.which) {
		case settings.shortcuts.voteUp:
			Vote(pstItems.selected, "up");
			break;
		case settings.shortcuts.previousPost:
			jq("#prevPost").click();
			break;
		case settings.shortcuts.voteDown:
			Vote(pstItems.selected, "down");
			break;
		case settings.shortcuts.nextImage:
			var imgActorNext = jq(".pstSelected").find("div.res-gallery-individual-controls").find("div.res-gallery-next");
			if(imgActorNext.length > 0)
				imgActorNext.get(0).click();
			break;
		case settings.shortcuts.toggleSelected:
			if (pstItems.selected)
				pstItems.jqSelected.find(".expando-button").get(0).click();
			break;
		case settings.shortcuts.previousImage:
			var imgActorPrev = jq(".pstSelected").find("div.res-gallery-individual-controls").find("div.res-gallery-previous");
			if(imgActorPrev.length > 0)
				imgActorPrev.get(0).click();
			break;
		case settings.shortcuts.hideSelected:
			HideSelectedClick();
			break;
		case settings.shortcuts.nextPost:
			jq("#nextPost").click();
			break;
		case settings.shortcuts.hideAll:
			if (reloadCancelled)
				HideAllClick();
			break;
		case settings.shortcuts.zoomIn:
			if (pstItems.selected)
				pstItems.jqSelected.find("img, video, iframe").each(function() { document.fExt.zoomIn(this, 20); });
			break;
		case settings.shortcuts.zoomOut:
			if (pstItems.selected)
				pstItems.jqSelected.find("img, video, iframe").each(function() { document.fExt.zoomOut(this, 20); });
			break;
		case settings.shortcuts.rotateLeft:
			if (pstItems.selected)
				pstItems.jqSelected.find("img, video, iframe").each(function() { document.fExt.rotate(this, -90); });
			break;
		case settings.shortcuts.rotateRight:
			if (pstItems.selected)
				pstItems.jqSelected.find("img, video, iframe").each(function() { document.fExt.rotate(this, 90); });
			break;
		case settings.shortcuts.undoLast:
			if(ctxUndo.Items.length > 0)
				ctxUndo.Items[ctxUndo.Items.length - 1].Trigger();
			break;
		case settings.shortcuts.redoLast:
			if(ctxRedo.Items.length > 0)
				ctxRedo.Items[ctxRedo.Items.length - 1].Trigger();
			break;
		default:
			return true;
	}
	return false;
}

var jqPost = jq("div.thing:first");
var jqPostID = jqPost.attr("id");
function handleShortcutForSinglePage(e) {
	switch (e.which) {
		case settings.shortcuts.voteUp:
			Vote(jqPostID, "up");
			break;
		case settings.shortcuts.previousPost:
			jq("#prevPost").click();
			break;
		case settings.shortcuts.voteDown:
			Vote(jqPostID, "down");
			break;
		case settings.shortcuts.nextImage:
			var imgActorNext = jqPost.find("div.res-gallery-individual-controls").find("div.res-gallery-next");
			if(imgActorNext.length > 0)
				imgActorNext.get(0).click();
			break;
		case settings.shortcuts.toggleSelected:
			pstItems.jqSelected.find("a.expand:first").click();
			break;
		case settings.shortcuts.previousImage:
			var imgActorPrev = jqPost.find("div.res-gallery-individual-controls").find("div.res-gallery-previous");
			if(imgActorPrev.length > 0)
				imgActorPrev.get(0).click();
			break;
		case settings.shortcuts.nextPost:
			jq("#nextPost").click();
			break;
		case settings.shortcuts.zoomIn:
			jqPost.find("img, video, iframe").each(function() { document.fExt.zoomIn(this, 20); });
			break;
		case settings.shortcuts.zoomOut:
			jqPost.find("img, video, iframe").each(function() { document.fExt.zoomOut(this, 20); });
			break;
		case settings.shortcuts.rotateLeft:
			jqPost.find("img, video, iframe").each(function() { document.fExt.rotate(this, -90); });
			break;
		case settings.shortcuts.rotateRight:
			jqPost.find("img, video, iframe").each(function() { document.fExt.rotate(this, 90); });
			break;
		default:
			return true;
	}
	return false;
}

function InitializeElements() {
	var rPostNavigation = jq('<div id="postNavigation"><a href="#" id="topPost">Top</a><a href="#" id="frPost">&lt;&lt;</a><a href="#" id="prevPost">&lt;</a><a href="#" id="nextPost">&gt;</a><a href="#" id="ffPost">&gt;&gt;</a><a href="#" id="botPost">Bottom</a></div>');
	rPostNavigation.appendTo("body");

	var rTabMenu = jq("ul.tabmenu");
	jq('<li class="spacerLi"></li>').appendTo(rTabMenu);

	jq('<li><span class="">All Posts:</span></li>').appendTo(rTabMenu);
	jq('<li><a href="#" class="choice tabButton" title="Updvotes all displayed posts" id="upvoter">Upvote</a></li>').appendTo(rTabMenu);
	jq('<li><a href="#" class="choice tabButton" title="Downvotes all displayed posts" id="downvoter">Downvote</a></li>').appendTo(rTabMenu);

	jq('<li><a href="#" class="choice tabButton collapsed" title="Expands all posts" id="expander">Expand</a></li>').appendTo(rTabMenu);

	jq('<li class="spacerLi"></li>').appendTo(rTabMenu);
	jq('<li><span class="">Hide:</span></li>').appendTo(rTabMenu);
	jq('<li><a href="#" class="choice tabButton" style="background-color: rgb(255, 138, 138) !important;" title="Hides all displayed posts which prevents them from showing up again" id="hideAll">All (<span>?</span>)</a></li>').appendTo(rTabMenu);
	jq('<li><a href="#" class="choice tabButton" style="display: none; background-color: rgb(255, 138, 138) !important;" title="Hides all displayed posts which prevents them from showing up again" id="hideSelected">Selected</a></li>').appendTo(rTabMenu);

	jq('<li class="spacerLi"></li>').appendTo(rTabMenu);
	jq('<li><span class="">Toggle hidden:</span></li>').appendTo(rTabMenu);
	jq('<li><a href="#" class="choice tabButton" style="background-color: rgb(175, 255, 171) !important;" title="Toggles the hidden User posts" id="toggleUserHidden">Users (<span>?</span>)</a></li>').appendTo(rTabMenu);
	jq('<li><a href="#" class="choice tabButton" style="background-color: rgb(175, 255, 171) !important;" title="Toggles the hidden Sub posts" id="toggleSubsHidden">Subs (<span>?</span>)</a></li>').appendTo(rTabMenu);
	jq('<li><a href="#" class="choice tabButton" style="background-color: rgb(175, 255, 171) !important;" title="Toggles the hidden Keyword posts" id="toggleKeywordsHidden">Keywords (<span>?</span>)</a></li>').appendTo(rTabMenu);
	jq('<li><a href="#" class="choice tabButton" style="background-color: rgb(175, 255, 171) !important;" title="Toggles the duplicate posts" id="toggleDuplicateHidden">Duplicates (<span>?</span>)</a></li>').appendTo(rTabMenu);

	jq('<li class="spacerLi"></li>').appendTo(rTabMenu);
	if (loc.indexOf("show=all") < 0) {
		var parmChar = "?";
		if(loc.indexOf("?") >= 0)
			parmChar = "&";
		jq('<li><a href="' + loc.replace('#', '') + parmChar + 'show=all" title="Show all posts of this sub, including previously hidden posts" class="choice tabButton" style="background-color: rgb(187, 187, 255) !important;" id="showAll">Show All</a></li>').appendTo(rTabMenu);
	}
}

function InitializeStyles() {
	fExtCreateStyle("#header { z-index: 107; }");
	fExtCreateStyle("#siteTable { padding: 0 64px; }");
	fExtCreateStyle("body.with-listing-chooser>.content, body.with-listing-chooser .footer-parent { margin-left: 0 !important; }");
	fExtCreateStyle("div.listing-chooser { left: 0 !important; }");
	fExtCreateStyle("div.side { right: 0; }");
	fExtCreateStyle("div.side, div.listing-chooser { z-index: 106 !important; position: fixed !important; height: 90%; top: " + headerHeight + "px !important; margin: 0px; border: 1px solid black; width: 5px !important; overflow-y: hidden !important; padding: 8px !important; }");
	fExtCreateStyle("div.side:hover { width: 500px !important; overflow-y: auto !important; max-height: 100vh; }");
	fExtCreateStyle("div.listing-chooser:hover { width: 500px !important; overflow-y: auto !important; max-height: 100vh; }");
	fExtCreateStyle("span.domain { font-weight: bold; }");

	fExtCreateStyle("div.content { padding-top: 80px  !important; }");
	fExtCreateStyle(".tabButton { color: #333333 !important; background-color: rgb(252, 255, 215) !important; border: 1px solid black; }");
	fExtCreateStyle(".spacerLi { width: 50px; }");
	fExtCreateStyle("#postNavigation { position: fixed !important; top: 27px; width: 500px; margin: 0 auto; display: block; z-index: 108; /*font-size: 12px; font-weight: bold; */ left: 0; right: 0; } ");
	fExtCreateStyle("#postNavigation a { background-color: #ffffff;  border: 1px solid black;  padding: 8px 14px;  margin: 0 1px; }");
	fExtCreateStyle("#postNavigation a:hover { background-color: #dfdfdf; }");
	fExtCreateStyle(".pstSelected, .pstSelected * { z-index: 105; }");

	fExtCreateStyle(".midcol { width: 32px !important; }");
	fExtCreateStyle(".RES-keyNav-activeElement, .RES-keyNav-activeElement .md-container { background-color: transparent !important; }");
	fExtCreateStyle("div.md { border: none !important; }");

	if (isSinglePost) {
		fExtCreateStyle(".livePreview { width: 1600px !important; }");
		fExtCreateStyle(".livePreview p, .livePreview ol { width: 1500px !important; }");
		fExtCreateStyle("div.usertext-edit { max-width: 50%; };");
		fExtCreateStyle("div.usertext-edit div.md { width: 100%; max-width: 100%; }");
		fExtCreateStyle("div.usertext-edit div.md textarea { width: 100%; }");
		fExtCreateStyle(".pstSelected p.tagline { background-color: #DDDDFF; }");
	} else {
		fExtCreateStyle(".md { max-width: none !important; }");
		fExtCreateStyle(".madeVisible *,div.expando * { z-index: 105; }");
		fExtCreateStyle("a.madeVisible img, a.madeVisible video { max-height: 100vh !important; max-width: 95vw !important;}");
		fExtCreateStyle("body { margin-bottom: 650px !important; }");
		fExtCreateStyle("img.RESImage { border-bottom: #000 solid 3px !important; padding: 0 !important; }");
		fExtCreateStyle("div.thing { min-height: 80px; padding: 5px 0; margin: 0 0 8px 0; border: 1px solid black; }");
		fExtCreateStyle("div.thing.pstSelected div.entry>div:not(.expando-button) { background-color: #fff !important; padding: 10px 20px; border: 1px solid black; }");
		fExtCreateStyle("div.thing div.entry img, div.thing div.entry video { display: none !important; }");
		fExtCreateStyle("div.thing.pstSelected div.entry img, div.thing.pstSelected div.entry video { display: block !important; }");
		if (settings.markNSFW) {
			fExtCreateStyle(".NsfwPost { background-color: rgb(255, 81, 81) !important; }");
			fExtCreateStyle(".NsfwItem .madeVisible { display: none; }");
			fExtCreateStyle(".pstSelected .NsfwItem .madeVisible { display: initial !important; }");
			fExtCreateStyle(".pstSelected .NsfwItem .madeVisible div { width: auto !important; }");
			fExtCreateStyle(".pstSelected .NsfwItem * { z-index: 104 !important; }");
		}
		fExtCreateStyle(".entry .buttons li { line-height: inherit !important; width: 100px; }");
		fExtCreateStyle(".thingUserSubInfo { padding: 4px 8px; height: 26px; display: block; }");
		fExtCreateStyle(".thingUserSubInfo>* { float: left; clear: none; border: 1px solid black; margin: 0 2px; }");
		fExtCreateStyle(".thingUserSubInfo * { font-size: 12px !important; }");
		fExtCreateStyle(".thingUserSubInfo .nsfw-stamp { display: inline !important; }");
		fExtCreateStyle(".thingUserSubInfo p.tagline { width: 450px; }");
		fExtCreateStyle(".thingUserSubInfo a.subreddit { width: 160px; }");
		fExtCreateStyle("ul.flat-list.buttons { float: left; clear: none; padding: 0; position: absolute; left: 870px; }");
		fExtCreateStyle("ul.flat-list.buttons>li { cursor: pointer; }");
		fExtCreateStyle("ul.flat-list.buttons>li, .thingUserSubInfo p.tagline, .thingUserSubInfo a.subreddit { padding: 6px !important; background-color: #eeeeee !important;  text-align: center; }");
		fExtCreateStyle("ul.flat-list.buttons>li:hover, .thingUserSubInfo p.tagline:hover, .thingUserSubInfo a.subreddit:hover { background-color: #cee3f8 !important; }");
		//fExtCreateStyle("a.subreddit { float: left; background-color: white !important; color: #888; font-weight: bold; padding: 0 4px !important; }");
		// fExtCreateStyle("p.tagline { float: left; position: relative; background-color: white; color: #888; font-weight: bold; padding: 0 1px; }");
		fExtCreateStyle("p.title { color: #000000 !important; float: left; }");
		fExtCreateStyle("p.title a { color: #000000 !important; }");
		fExtCreateStyle("div.top-matter { height: 48px !important; }");
		//fExtCreateStyle("ul.flat-list.buttons { padding-bottom: 40px; width: 800px; margin: 20px auto 0 auto; font-size: larger; text-align: center; left: 0; right: 0; clear: both; }");
		//fExtCreateStyle("ul.flat-list.buttons li { padding: 4px; background-color: #fff; margin: 2px; border: 1px solid #999; }");
		fExtCreateStyle(".usertext * { z-index: 1; }");
		fExtCreateStyle("div.thing div.entry div.expando:not(.expando-uninitialized) { display: block !important; }");
		fExtCreateStyle("div.thing div.entry div.expando span { display: none; }");
	}
	fExtCreateStyle(".toggleHidden, div.thing.hidden { background: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px); }");

	if(settings.hideUsers)
		fExtCreateStyle(".userHidden .author { text-decoration: line-through; }");
	if(settings.hideSubs)
		fExtCreateStyle(".subsHidden .subreddit { text-decoration: line-through; }");

	fExtCreateStyle(".userHidden a.title, .subsHidden a.title, .duplicateHidden a.title { background-position: 0 !important; background-repeat: no-repeat !important; padding: 8px 8px 8px 26px; }");
	fExtCreateStyle(".userHidden a.title { background-image: url('" + imgDelUser + "') !important; }");
	fExtCreateStyle(".subsHidden a.title { background-image: url('" + imgDelCat + "') !important; }");
	fExtCreateStyle(".duplicateHidden a.title { background-image: url('" + imgDuplicate + "') !important; }");

	fExtCreateStyle("ul.tabmenu .disabled { background-color: #dfdfdf !important; }");

	fExtCreateStyle("#rEnhSettings { position: fixed; height: 750px; top: 50px; border: 1px solid black; width: 750px; padding: 12px; z-index: 1000; background-color: #FEFEFE; right: 0; left: 0; margin: 0 auto; }");
	fExtCreateStyle("#rEnhSettings table { }");
	fExtCreateStyle("#rEnhSettings table td.label, #rEnhSettings table td.value { }");
	fExtCreateStyle("#rEnhSettings table td.label { float: left; clear: right; font-size: larger; }");
	fExtCreateStyle("#rEnhSettings table td.value { float: right; clear: left; }");
	fExtCreateStyle("#rEnhSettings table thead { font-size: large; }");
	fExtCreateStyle("#rEnhSettings div.tableContainer { overflow-y: scroll; height: 700px; }");
	fExtCreateStyle("#rEnhSettings div.settingsButtons { height: 50px;  }");
	fExtCreateStyle("#rEnhSettings * { z-index: 1000; margin: 4px; }");
	fExtCreateStyle("#rEnhSettings td.label {  }");
	fExtCreateStyle("#rEnhSettings a { padding: 4px; border: 1px solid grey; float: right; }");
}

function InitializeHider() {
	if(!hiderElements) {
		hiderElements = [];
		for(var i = 0; i < postList.length; i++){
			var post = jq(postList[i]);
			if(!post.is(":visible"))
				continue;

			hiderElements.push(post);
		}

		if (hiderElements.length === 0)
			jq("#hideAll").attr("style", "background-color: #808080 !important; color: #CFCFCF; border: 1px solid black;");

		var len = jq("form.hide-button").length;
		if(len > 0)
			jq("#hideAll").text("All (" + len + ")");
		else
			jq("#hideAll").text("None");

		jq(".hide-button:contains(hidden)").click(function(e){
			e.preventDefault();

			jq(this).parents("div.thing:first").hide();

			return false;
		});
	}
}

function VoteAndNext(sender, voteLinks, ind) {
	var nextVoteItem = voteLinks[ind];
	jq(nextVoteItem).click();

	ind++;
	if (voteLinks.length > ind) {
		animateControl(sender);

		setTimeout(function() {
			VoteAndNext(sender, voteLinks, ind);
		}, settings.animationItemTimeout);
	} else {
		jq("#downvoter").text("Downvote");
		jq("#upvoter").text("Upvote");
	}
}

function ExpandAndNext(expandLinks, ind) {
	var jqExpander = jq("#expander");
	var expandItem = expandLinks[ind];
	jq(expandItem).click();

	if (expandLinks.length > ind) {
		animateControl(jqExpander);
		setTimeout(function() {
			ExpandAndNext(expandLinks, ind + 1);
		}, settings.animationItemTimeout);
	}
	else  {
		if(jqExpander.hasClass("collapsed")) {
			jqExpander.text("Collapse");
			jqExpander.removeClass("collapsed");
			jqExpander.addClass("expanded");
		}
		else {
			jqExpander.text("Expand");
			jqExpander.addClass("collapsed");
			jqExpander.removeClass("expanded");
		}
	}
}

function animateControl(sender) {
	var txt = jq(sender).text();
	if (txt.length >= 3)
		txt = ".";
	else
		txt = txt + ".";

	jq(sender).text(txt);
}

function HideAndAction(hideLinks, index, previousLink, action) {
	var jqLink = jq(previousLink);
	var item = hideLinks[index];
	if (jqLink.find("form.hide-button").length === 0) {
		if (hideLinks.length > index) {
			var perc = index * 100 / hideLinks.length;
			fExtSetLoading(perc);
			if (action !== "hideObject")
				fExtMessage(action + " (" + index + "/" + hideLinks.length + ") ...");

			Hide(item, action === "reload" || (action == "enhance" && jq(item).find("a.author.friend").length > 0 && duplicateLinks.indexOf(item) < 0));

			var actArgs = [hideLinks, index + 1, previousLink, action];
			ActionWhenElementIsInvisible(item, HideAndAction, actArgs);
		} else {
			isHiding = false;
			fExtSetLoading(100);
			fExtMessage(undefined);
			switch (action) {
				case "reload":
					ReloadLooper(5);
					break;
				case "enhance":
					if (pstItems.onlyVisible().length === 0)
						ReloadLooper(5);
					else
						InitializeHider();
					break;
				case "nextPost":
					if (pstItems.onlyVisible().length === 0)
						ReloadLooper(5);
					else
						jq("#nextPost").click();
					break;
				default:
					break;
			}
		}
	} else setTimeout(function() { HideAndAction(hideLinks, index, previousLink, action); }, settings.hideItemTimeout);
}

function ReloadLooper(loops) {
	if (reloadCancelled) {
		fExtMessage();
		return;
	} else {
		if (loops === 0) {
			fExtMessage("Reloading...");
			setTimeout(function() {
				location.reload();
			}, 1000);
		} else {
			var msg = "Reloading in " + loops + " seconds... (click here to cancel)";
			fExtMessage(msg);
			document.title = msg;
			setTimeout(function() {
				ReloadLooper(loops - 1);
			}, 1000);
		}
	}
}

function Hide(item, displayAfter, handled) {
	var jqHideButton = item.find("form.hide-button");

	if (!isHiding && pstItems.selected === item.attr("id")) {
		MakeActivePost(item.attr("id"), pstItems.Next());
	}

	if(!handled) {
		jqHideButton.unbind("click", handleHideClick);

		jqHideButton.find("a:first").click();

		var args = [item, displayAfter, true];
		AddUndo(Unhide, args, Hide, args, item.find("p.title").text());

		jqHideButton.bind("click", handleHideClick);
	}

	item.hide(settings.animationItemTimeout);

	if (displayAfter) {
		ActionWhenElementIsInvisible(item, item.show, undefined);
	}

	if(pstItems.onlyVisible().length === 0) {
		reloadCancelled = false;
		ReloadLooper(5);
	}

	return true;
}

function Unhide(item, displayAfter, handled) {
	jq(item).show();

	if(!handled){
		var args = [item, displayAfter, true];
		AddUndo(Hide, args, Unhide, args, item.find("p.title").text());
	}

	return true;
}

function Mark(item, itemType) {
	item.addClass("markedItem");
	item.addClass(itemType);
}

function MakeActivePost(oldId, newId) {
	if (oldId === undefined || newId === undefined || oldId !== newId) {
		if (newId) {
			if (newId !== pstItems.selected) {
				pstItems.selected = newId;
				pstItems.jqSelected = jq("#" + newId);
				if (!pstItems.jqSelected.hasClass("pstSelected"))
					pstItems.jqSelected.addClass("pstSelected");

				if (settings.autoExpandSelectedPost) {
					var jsExpander = pstItems.jqSelected.find(".expando-button.collapsed").get(0);
					if (jsExpander)
						jsExpander.click();
				}
			}
		}
		else {
			pstItems.selected = undefined;
			pstItems.jqSelected = undefined;
		}

		if (oldId) {
			var jqOldPost = jq("#" + oldId);
			jqOldPost.removeClass("pstSelected");

			if (settings.autoExpandSelectedPost) {
				var jsCollapser = jqOldPost.find(".expando-button.expanded").get(0);
				if (jsCollapser)
					jsCollapser.click();
			}
		}
	}

	if(pstItems.jqSelected)
		scrollTo(pstItems.jqSelected);

	return false;
}

// Image Preloading - Start
var preloadIndex = 0;
var preloadComplete = 0;
var preloadingImages = jq("a.title[href*='imgur'],a.title[href*='gfycat']").not(".thumbnail");
for(var i = 0; i < preloadingImages.length; i++){
	var img = preloadingImages.get(i);

	if (img.href.indexOf("https://") < 0) {
		img.href = img.href.replace("http://", "https://");
	}
}

function preloadSuccess(e){
	console.log("Preloading image " + preloadIndex + " successful!");
	preload();
}

function preloadError(e){
	console.log("Error preloading image " + preloadIndex);
	preload();
}

var preloadingImage = document.createElement('IMG');
preloadingImage.style.display = "block";
preloadingImage.style.position = "absolute";
preloadingImage.style.top = 0;
preloadingImage.style.left = 0;
preloadingImage.src= "about:blank";
preloadingImage.width=1;
preloadingImage.height=1;
preloadingImage.onerror = preloadError;
preloadingImage.onload = preloadSuccess;
document.body.appendChild(preloadingImage);

function preload() {
	if(preloadIndex >= preloadingImages.length) {
		preloadingImage.remove();
		return;
	}

	var href = preloadingImages.get(preloadIndex).href;
	preloadIndex++;

	console.log("Preloading Image " + preloadIndex + " of " + preloadingImages.length + "(" + href + ")...");
	preloadingImage.src = href;
}

setTimeout(function(){ preload(); }, 1000);
// Image preloading - End

function scrollTo(item) {
	var jqItem = jq(item);
	var offs = jqItem.offset();
	var topPos = offs.top - headerHeight;

	jq(document.body).scrollTop(topPos);
	//jq(document.body).animate({ scrollTop: topPos }, settings.animationItemTimeout);
}

function AddToHideLinks(elm) {
	if (!elm.hasClass("toggleHidden"))
		elm.addClass("toggleHidden");

	if (jq.inArray(elm, hideLinks) < 0)
		hideLinks.push(elm);
}

function Vote(id, direction) {
	if (id !== undefined) {
		var element;

		switch (direction) {
			case "up":
				element = jq("#" + id).find(".arrow.up, .arrow.upmod");
				break;
			case "down":
				element = jq("#" + id).find(".arrow.down, .arrow.downmod");
				break;
			default:
				break;
		}

		if (element.length > 0) {
			element.click();
		}
	}
}

function AddUndo(fnUndo, argsUndo, fnRedo, argsRedo, suffix) {
	if (ctxUndo.Items.length === 10) {
		var removeThis = ctxUndo.Items[0];
		ctxUndo.Items.splice(0, 1);
		removeThis.remove();
	}
	if(!suffix)
		suffix = "";
	else if(suffix.length > 25)
		suffix = suffix.substring(0, 25) + "...";

	var ctxItem = fExtAddCtxItem(suffix && suffix.length > 0 ? fnRedo.name + " - " + suffix : fnRedo.name, ctxUndo);
	ctxItem.ClickCloses = false;
	ctxItem.fnUndo = fnUndo;
	ctxItem.argsUndo = argsUndo;
	ctxItem.fnRedo = fnRedo;
	ctxItem.argsRedo = argsRedo;
	ctxItem.Action = function(event, sender, actor) {
		sender.fnUndo.apply(this, sender.argsUndo);
		AddRedo(sender.fnUndo, sender.argsUndo, sender.fnRedo, sender.argsRedo, suffix);
		sender.Remove();
	};
}

function AddRedo(fnUndo, argsUndo, fnRedo, argsRedo, suffix) {
	if (ctxRedo.Items.length === 10) {
		ctxRedo.Items[0].remove();
		ctxRedo.Items.splice(0, 1);
	}
	if(!suffix)
		suffix = "";
	else if(suffix.length > 25)
		suffix = suffix.substring(0, 25) + "...";

	var ctxItem = fExtAddCtxItem(suffix && suffix.length > 0 ? fnUndo.name + " - " + suffix : fnUndo.name, ctxRedo);
	ctxItem.ClickCloses = false;
	ctxItem.fnUndo = fnUndo;
	ctxItem.argsUndo = argsUndo;
	ctxItem.fnRedo = fnRedo;
	ctxItem.argsRedo = argsRedo;
	ctxItem.Action = function(event, sender, actor) {
		sender.fnRedo.apply(this, sender.argsRedo);
		AddUndo(sender.fnUndo, sender.argsUndo, sender.fnRedo, sender.argsRedo, suffix);
		sender.remove();
	};
}

function ToggleVisibility(event, sender, className) {
	event.preventDefault();
	if (jq(sender).data("state") === "shown") {
		jq(sender).data("state","hidden");
		jq(className).hide();
	} else {
		jq(sender).data("state","shown");
		jq(className).show();
	}
}

function HideObject(containingArray, arrayName, text, selector) {
	if (jq.inArray(text, containingArray) < 0) {
		fExtPopup("Adding '" + text + "' from '" + arrayName + "' to hide.");
		containingArray.push(text);
		GMSave();

		var links = [];
		var selectNext = false;

		jq(selector).parents("div.thing").each(function(index, item) {
			var jqItem = jq(item);
			selectNext = selectNext || item.id === pstItems.selected;

			if (jqItem.find("form.hide-button").length > 0)
				links.push(jqItem);
		});

		HideAndAction(links, 0, null, "hideObject");

		return true;
	}
	return false;
}

function UnhideObject(containingArray, arrayName, text, selector) {
	var arrayIndex = jq.inArray(text, containingArray);
	if (arrayIndex >= 0) {
		fExtPopup("Removing '" + text + "' from '" + arrayName + "'.");
		containingArray.splice(arrayIndex, 1);
		GMSave();
		return true;
	}
	return false;
}

function GrabContent(htmlContent) {
	fExtMessage("Loading additional Pages (" + numberOfSitesLoaded + " of max " + settings.maximumNumberOfSitesToLoad + ")");

	var navButtonNext = jq(htmlContent).find("div.nav-buttons").find(".next-button").find("a").get(0);
	if (numberOfSitesLoaded < settings.maximumNumberOfSitesToLoad && navButtonNext) {
		numberOfSitesLoaded += 1;
		var srcUrl = navButtonNext.href;
		//siteTable
		jq.ajax({
			url: srcUrl,
			method: "get",
			success: function(data) {
				jq(data).find("div#siteTable").find("div.thing").each(function() {
					jq(this).detach().appendTo("div#siteTable");
				});

				GrabContent(data);
			},
			error: function(data) {
				console.log(data);
			}
		});
	} else {
		if (navButtonNext)
			jq(navButtonNext).detach().appendTo("#postNavigation");

		fExtMessage(numberOfSitesLoaded + " Pages loaded, starting initialization...");

		MainInitialization();
	}
}

function InitializeContextMenu() {
	ctxItemUsrHdr = fExtAddCtxItem("Hide User", rEnhSub);
	ctxItemUsrHdr.Action = function(event, sender, actor) {
		var jqThing = getThingForCtxActor(actor);
		var user = jqThing.find(".author:first").text();
		var selector = "a.author:contains(" + user + ")";
		var args = [settings.usersToHide, "Users", user, selector];
		if (HideObject.apply(sender, args))
			AddUndo(UnhideObject, args, HideObject, args, user);
	};

	ctxItemUsrHdrPg = fExtAddCtxItem("Hide User and open Userpage", rEnhSub);
	ctxItemUsrHdrPg.Action = function(event, sender, actor) {
		ctxItemUsrHdr.Action(event, sender, actor);
		var jqThing = getThingForCtxActor(actor);
		var user = jqThing.find(".author:first").text();
		GM_openInTab("https://www.reddit.com/u/" + user + "/submitted/", true);
	};

	ctxItemUsrUnhdr = fExtAddCtxItem("Unhide User", rEnhSub);
	ctxItemUsrUnhdr.Action = function(event, sender, actor) {
		var jqThing = getThingForCtxActor(actor);
		var user = jqThing.find(".author:first").text();
		var selector = "a.author:contains(" + user + ")";
		var args = [settings.usersToHide, "Users", user, selector];
		if (UnhideObject.apply(sender, args)) {
			jq("a.author:contains(" + user + ")").parents("div.thing").each(function(index, item) {
				jq(item).show();
			});
			AddUndo(HideObject, args, UnhideObject, args, user);
		}
	};

	fExtAddCtxSeparator(rEnhSub);

	ctxItemSbHdr = fExtAddCtxItem("Hide Sub", rEnhSub);
	ctxItemSbHdr.Action = function(event, sender, actor) {
		var jqThing = getThingForCtxActor(actor);
		var sub = jqThing.find(".subreddit:first").text().replace("/r/", "").replace("r/","");
		var selector = "a.subreddit:contains(" + sub + ")";
		var args = [settings.subsToHide, "Subs", sub, selector];
		if (HideObject.apply(sender, args))
			AddUndo(UnhideObject, args, HideObject, args, sub);
	};

	ctxItemSbUnhdr = fExtAddCtxItem("Unhide Sub", rEnhSub);
	ctxItemSbUnhdr.Action = function(event, sender, actor) {
		var jqThing = getThingForCtxActor(actor);
		var sub = jqThing.find(".subreddit:first").text().replace("/r/", "").replace("r/","");
		var selector = "a.subreddit:contains(" + sub + ")";
		var args = [settings.subsToHide, "Subs", sub, selector];
		if (UnhideObject.apply(sender, args)) {
			jq(selector).parents("div.thing").each(function(index, item) {
				jq(item).show();
			});
			AddUndo(HideObject, args, UnhideObject, args, sub);
		}
	};

	fExtAddCtxSeparator(rEnhSub);

	ctxItemKeywHdr = fExtAddCtxItem("Hide Keywords", rEnhSub);
	ctxItemKeywHdr.Action = function(event, sender, actor) {
		var keyword = fExtGetSelection().trim();
		var selector = "a.title:contains(" + keyword + ")";
		var args = [settings.keywordsToHide, "Keywords", keyword, selector];
		if (HideObject.apply(sender, args))
			AddUndo(UnhideObject, args, HideObject, args, keyword);
	};

	ctxItemKeywUnhdr = fExtAddCtxItem("Unhide Keywords", rEnhSub);
	ctxItemKeywUnhdr.Action = function(event, sender, actor) {
		var keyword = fExtGetSelection();
		var selector = "a.title:contains(" + keyword + ")";
		var args = [settings.keywordsToHide, "Keywords", keyword, selector];
		if (UnhideObject.apply(sender, args)) {
			jq(selector).parents("div.thing").each(function(index, item) {
				jq(item).show();
			});
			AddUndo(HideObject, args, UnhideObject, args, keyword);
		}
	};

	fExtAddCtxSeparator(rEnhSub);

	// Undo/Redo
	ctxUndo = fExtAddSub("Undo", rEnhSub);
	ctxRedo = fExtAddSub("Redo", rEnhSub);

	fExtAddCtxSeparator(rEnhSub);

	ctxItemCpyHtml = fExtAddCtxItem("Copy HTML", rEnhSub);
	ctxItemCpyHtml.Action = function(event, sender, actor) {
		fExtClipboard("Copy", jq('div.content').html());
	};

	fExtAddCtxSeparator(rEnhSub);

	ctxItemSett = fExtAddCtxItem("REnhancer Settings", rEnhSub);
	ctxItemSett.Action = function() { ShowSettings(); };
}

function InitializeEventHandlers() {
	jq("#fExtMessage").click(function() { reloadCancelled = true; });
	jq("#hideAll").click(HideAllClick);
	jq("#hideSelected").click(HideSelectedClick);
	jq("#expander").click(function(e) {
		e.preventDefault();
		if(jq("#expander").hasClass("expanded"))
			ExpandAndNext(jq("div.expando-button.expanded:visible"), 0);
		else
			ExpandAndNext(jq("div.expando-button.collapsed:visible"), 0);
		return false;
	});
	jq("#renhSettingsSave").click(SaveSettingsDialog);
	jq("#upvoter").click(function(e) {
		e.preventDefault();
		VoteAndNext(jq(this), upVoteLinks, 0);
		return false;
	});
	jq("#downvoter").click(function(e) {
		e.preventDefault();
		VoteAndNext(jq(this), downVoteLinks, 0);
		return false;
	});
	jq("#renhSettingsClose").click(function(e) {
		jq("#rEnhSettings").hide();
		return false;
	});

	jq("ul.flat-list.buttons>li:not(.report-button)").click(function(e){
		if(e.target.tagName !== "A" && e.target.tagName !== "FORM") {
			var targetItem = jq(e.target).find("a").first().get(0);
			if(targetItem) targetItem.click(e);
			else return true;
		}
		else return true;
	});
}

function handleHideClick(e){
	var jqThing;
	if (e.data)
		jqThing = jq("#" + e.data.thingID);
	else
		jqThing = jq(this).parents("div.thing:first");

	var args = [jqThing, false, true];
	AddUndo(Unhide, args, Hide, args, jqThing.find("p.title").text());

	Hide(jqThing, undefined, true);
}

function ActionWhenElementIsInvisible(element, action, args, step) {
	if (element.hasClass("hidden") || element.find("a[text=hidden]").length === 1 || step === 3)
		action.apply(element, args);
	else {
		if(isNaN(step))
			step = 0;

		step++;

		setTimeout(function() {
			ActionWhenElementIsInvisible(element, action, args, step);
		}, settings.hideItemTimeout);
	}
}

// Functions - Load and Save
function GMLoadValue(valueName) {
	var ret = GM_getValue(valueName);
	if (ret !== undefined)
		return ret.toString().split(",");

	return [];
}

function GMSave() {
	GM_setValue("settings", JSON.stringify(settings));
}

function GMLoad() {
	settings = { // Defaults
		accountName: "enter your account name here, e.g. throwaway001",
		markNSFW: true,
		replaceTopNew: false,
		sortByVotes: false,
		autoExpandSelectedPost: true,
		removeDuplicates: true,
		maximumNumberOfSitesToLoad: 1,

		animationItemTimeout: 500,
		imagePreloadingTimeout: 250,
		hideItemTimeout: 750,

		hideUsers: true,
		hideUsersNSFWonly: true,
		usersToHide: undefined,

		hideSubs: true,
		subsToHide: undefined,

		hideKeywords: true,
		keywordsToHide: undefined,

		shortcuts: {
			nextPost: 98,
			previousPost: 104,
			toggleSelected: 101,
			hideSelected: 99,

			hideAll: 97,

			voteUp: 105,
			voteDown: 103,

			nextImage: 102,
			previousImage: 100,
			zoomIn: 107,
			zoomOut: 109,
			rotateLeft: 111,
			rotateRight: 106,

			undoLast: -1,
			redoLast: -1,
		},

		panelView: false,
	};

	var lSettings = GM_getValue("settings");
	if (lSettings !== undefined) {
		settingsFromLoad(settings, JSON.parse(lSettings.toString()));
	}

	if (!settings.usersToHide)
		settings.usersToHide = GMLoadValue("usersToHide");
	if (!settings.subsToHide)
		settings.subsToHide = GMLoadValue("subsToHide");
	if (!settings.keywordsToHide)
		settings.keywordsToHide = GMLoadValue("keywordsToHide");
}

function settingsFromLoad(setSettings, getSettings){
	for (var k in getSettings) {
		var varType = typeof getSettings[k];
		var varTypeB = typeof setSettings[k];
		switch (varType) {
			case "boolean":
				setSettings[k] = Boolean(getSettings[k]);
				break;
			case "number":
				setSettings[k] = parseInt(getSettings[k]);
				break;
			case "object":
				if(Array.isArray(getSettings[k]))
					setSettings[k] = getSettings[k];
				else
					settingsFromLoad(setSettings[k], getSettings[k]);
				break;
			case "string":
			default:
				setSettings[k] = getSettings[k];
				break;
		}
	}
}

// Functions - Misc
function getThingForCtxActor(actor){
	return jq(actor).hasClass("thing") ? jq(actor) : jq(actor).parents("div.thing:first");
}

function grabExtension(src) {
	var start, end;

	start = src.lastIndexOf(".") + 1;
	if (src.lastIndexOf("?") >= 0)
		end = src.lastIndexOf("?");
	else
		end = src.length;

	return src.substring(start, end);
}

function colorObject(r, g, b, a){
	var rv = {
		red: 0,
		blue: 0,
		green: 0,
		alpha: 100
	};

	if(r)
		rv.red = parseInt(r);
	if(g)
		rv.green = parseInt(g);
	if(b)
		rv.blue = parseInt(b);
	if(a)
		rv.alpha = parseInt(a);

	rv.getRgba = function(){
		return "rgba(" + this.red + "," + this.green + "," + this.blue + ", " + (this.alpha / 100) + ")";
	};
	rv.getHex = function(){
		var strR = this.red.toString(16);
		var strG = this.blue.toString(16);
		var strB = this.green.toString(16);
		if(strR.length === 1) strR = "0" + strR;
		if(strG.length === 1) strG = "0" + strG;
		if(strB.length === 1) strB = "0" + strB;

		return "#" + strR + strG + strB;
	};

	return rv;
}

function getRandomColor() {
	var color = '#';

	// Neu rgb-style
	var min = 155, max = 255;
	var cO = colorObject(Math.random() * (max - min) + min, Math.random() * (max - min) + min, Math.random() * (max - min) + min);

	if(cO.red > cO.green && cO.red > cO.blue)
		color = getRandomColor();
	else
		color = cO.getHex();

	return color;
}
// Functions - End
