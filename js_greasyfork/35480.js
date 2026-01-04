// ==UserScript==
// @name         Seletion is Back!
// @version      3.1
// @description  Get select & copy & right-click back on nogizaka/keyakizaka/hinatazaka official website
// @author       nondanee
// @match        *://*.keyakizaka46.com/*
// @match        *://*.nogizaka46.com/*
// @match        *://*.hinatazaka46.com/*
// @namespace https://greasyfork.org/users/160192
// @downloadURL https://update.greasyfork.org/scripts/35480/Seletion%20is%20Back%21.user.js
// @updateURL https://update.greasyfork.org/scripts/35480/Seletion%20is%20Back%21.meta.js
// ==/UserScript==

(() => {
	'use strict'
	let styleSheet = Array.from(document.styleSheets).filter(styleSheet => !styleSheet.href)[0]
	if(window.location.href.includes('nogizaka')){
		document.body.oncontextmenu = null
		styleSheet.insertRule('::selection{background: rgba(126, 16, 131, 0.9); color: #ffffff}', 0)
	}
	else if(['keyakizaka', 'hinatazaka'].some(key => window.location.href.includes(key))){
		if(window.location.href.includes('keyakizaka')) styleSheet.insertRule('::selection{background: rgba(160, 212, 104, 0.9); color: #ffffff}', 0)
		Array.from(document.getElementsByTagName('img')).forEach(element => ['onmousedown', 'onselectstart', 'oncontextmenu'].forEach(event => element.setAttribute(event, '')))
		let inlineStyle = Array.from(document.getElementsByTagName('style')).find(element => element.innerHTML.includes('user-select'))
		if(inlineStyle) inlineStyle.parentNode.removeChild(inlineStyle)
	}
})()