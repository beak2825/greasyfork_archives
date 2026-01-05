// ==UserScript==
// @name        Steam - My Privacy Settings buttons on top
// @namespace   Barefoot Monkey
// @match       http://steamcommunity.com/id/*
// @match       http://steamcommunity.com/profile/*
// @match       https://steamcommunity.com/id/*
// @match       https://steamcommunity.com/profile/*
// @description On the Steam "My Privacy Settings" page, moves the Cancel and Save Changes buttons up to the top of the page.
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15473/Steam%20-%20My%20Privacy%20Settings%20buttons%20on%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/15473/Steam%20-%20My%20Privacy%20Settings%20buttons%20on%20top.meta.js
// ==/UserScript==

if (/^\/(?:id|profile)\/[^\/]+\/edit\/settings\/?$/.test(location.pathname)) {
	var style = document.createElement('style')
	style.appendChild(document.createTextNode(".group_content_bodytext { top: 0; right: 0; position: absolute; }"))
	document.head.appendChild(style)
}
