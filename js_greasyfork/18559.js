// ==UserScript==
// @name         Prevent contextmenu hijack
// @namespace    http://github.com/kba
// @version      0.1
// @description  Removes all listeners to the contextmenu event
// @author       kba
// @match        */*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/18559/Prevent%20contextmenu%20hijack.user.js
// @updateURL https://update.greasyfork.org/scripts/18559/Prevent%20contextmenu%20hijack.meta.js
// ==/UserScript==
/* jshint -W097 */
/* globals GM_getValue, GM_setValue, GM_registerMenuCommand */
'use strict';


function removeContextMenuListeners() {
	document.oncontextmenu = null;
	var elems = document.querySelectorAll('div,img,video,figure,main,article,section,header,footer');
	for (var i = 0 ; i < elems.length ; i++) {
		elems[i].oncontextmenu = null;
	}
}

function isPermanent() { return GM_getValue('permanent'); }
function togglePermanent() { GM_setValue('permanent', ! isPermanent()); }

if (isPermanent()) {
	setTimeout(removeContextMenuListeners, 500);
}

GM_registerMenuCommand('Allow Right-Click', removeContextMenuListeners);
GM_registerMenuCommand((isPermanent() ? 'Dis' : 'En') +  'able Permanent Allow Right-Click', togglePermanent);
