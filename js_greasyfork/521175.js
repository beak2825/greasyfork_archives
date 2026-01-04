// ==UserScript==
// @name        Untarget _blank
// @namespace   https://git.sr.ht/~remph
// @include     *
// @grant       none
// @version     0.2
// @author      Remph
// @description Murderise target="_blank"
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/521175/Untarget%20_blank.user.js
// @updateURL https://update.greasyfork.org/scripts/521175/Untarget%20_blank.meta.js
// ==/UserScript==

function unblank(root) {
	root.querySelectorAll(
		'a[target="_blank"], base[target="_blank"]' // form[target="_blank"]
	).forEach((a) => a.setAttribute('target', '_self')); // could also removeAttribute
}

(function() {
	unblank(document.body); // run straight away to unblank static content
	// hang around in the background to keep interfering
	new MutationObserver(
		(muts) => muts.forEach((mut) => unblank(mut.target))
	).observe(document.body, {
		subtree: true, childList: true, attributes: true
	});
})();