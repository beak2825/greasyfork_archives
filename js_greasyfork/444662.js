// ==UserScript==
// @name         No Fancy Background Discord
// @namespace    Hans5958
// @author       Hans5958
// @description  Removes that fancy background on some parts of Discord. (Deprecated: Use at your own risk.)
// @license      MIT
// @version      1
// @match        *://discordapp.com/login
// @match        *://discordapp.com/register
// @match        *://discordapp.com/invite/*
// @homepageURL  https://github.com/Hans5958/userscripts
// @supportURL   https://github.com/Hans5958/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/444662/No%20Fancy%20Background%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/444662/No%20Fancy%20Background%20Discord.meta.js
// ==/UserScript==

function a() {
	if (e = document.getElementsByClassName("wrapper-3Q5DdO")[0]) {
  	e.attributes.class.value = "splashBackground-1FRCko scrollbarGhost-2F9Zj2 scrollbar-3dvm_9"
		e.firstChild.firstChild.remove()
		e.children[1].remove()
  }
}

if (!a()) {
	document.onmousemove = function() {
  	if (a()) {
			document.onmousemove = null
	  }
	}
}
