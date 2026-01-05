// ==UserScript==
// @name        poe.xyz.is no Comic Sans
// @namespace   http://poe.xyz.is/
// @description adblock users would get poe.xyz.is in Comic Sans. This script removes all of it and returns it to the normal defined fonts.
// @include     http://poe.xyz.is*
// @run-at 	document-end
// @grant       none
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/5237/poexyzis%20no%20Comic%20Sans.user.js
// @updateURL https://update.greasyfork.org/scripts/5237/poexyzis%20no%20Comic%20Sans.meta.js
// ==/UserScript==

window.onload=function(){ 
	jQuery("[style*='Comic Sans MS']").removeAttr('style'); 
};

