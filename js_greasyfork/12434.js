// ==UserScript==
// @name           Prevent middle-click hijacking
// @description    Allows you to open links in new tabs by middle or control clicking on buggy sites like Instagram
// @include        *
// @version        1.0
// @namespace      GrayFace
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/12434/Prevent%20middle-click%20hijacking.user.js
// @updateURL https://update.greasyfork.org/scripts/12434/Prevent%20middle-click%20hijacking.meta.js
// ==/UserScript==

function handler(e){
	if(e.button == 1 || (e.button == 0 && e.ctrlKey)){
		e.stopPropagation();
	}
}

addEventListener('click', handler, true);
addEventListener('mousedown', handler, true);
addEventListener('mouseup', handler, true);