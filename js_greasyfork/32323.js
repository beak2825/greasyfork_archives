// ==UserScript==
// @id          Ali Mikhak
// @name        auto copy
// @namespace   auto copy
// @description auto copy selected text - Note: Please remember after you select your text you ---> one click your selected text for copy <----
// @version     1.3
// @include     http*
// @include file*
// @run-at      document-end
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/32323/auto%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/32323/auto%20copy.meta.js
// ==/UserScript==

if (typeof GM_setClipboard != 'function') alert('Your UserScript client has no GM_setClipboard support');

document.addEventListener('mouseup',
	function(e) {
		if (e.button != 0) return;
	GM_setClipboard(getSelection().toString());
	}, false);