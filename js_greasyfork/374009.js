// ==UserScript==
// @name         ahk_codebox_quick_fix
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add 'EXPAND VIEW' to code box
// @author       You
// @match        https://autohotkey.com/boards/viewtopic.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374009/ahk_codebox_quick_fix.user.js
// @updateURL https://update.greasyfork.org/scripts/374009/ahk_codebox_quick_fix.meta.js
// ==/UserScript==

expand_code_init();

window.expandCode = function expandCode(e) {
    var c = e.parentNode.parentNode.getElementsByTagName('code')[0];
	if (c.style.maxHeight == 'none') {
		c.style.maxHeight = '200px';
		e.innerHTML = 'EXPAND VIEW';
	}
	else {
		c.style.maxHeight = 'none';
		e.innerHTML = 'COLLAPSE VIEW';
	}
}

function expand_code_init() {
	var boxes = document.getElementsByTagName('code');
	for (var i = 0; i < boxes.length; i++) {
		if (boxes[i].scrollHeight > boxes[i].offsetHeight + 1) {
			boxes[i].parentNode.previousSibling.innerHTML += ' &middot; <a href="#" onclick="expandCode(this); return false;">EXPAND VIEW</a>';
        }
	}
}