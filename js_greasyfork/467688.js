// ==UserScript==
// @name        beehaw.org Ctrl + Enter to submit comment 
// @namespace   english
// @description beehaw.org Ctrl + Enter to submit comment  2
// @include     http*://*beehaw.org*
// @version     1.14
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/467688/beehaworg%20Ctrl%20%2B%20Enter%20to%20submit%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/467688/beehaworg%20Ctrl%20%2B%20Enter%20to%20submit%20comment.meta.js
// ==/UserScript==


// Main - CSS hides two classes - video add box, and call to action box under it. - also social media



// Body event delegation - any form (least efficient)
document.body.addEventListener('keydown', function(e) {
	if(!(e.keyCode == 13 && e.metaKey)) return;

	var target = e.target;
	if(target.form) {
		target.form.submit();
	}
});