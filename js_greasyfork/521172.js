// ==UserScript==
// @name	Unfix
// @description	Stop fixed/sticky elements leeching my valuable screen real estate!
// @author	Remph
// @license	GPL-3.0-or-later
// @version	0.2.5
// @include	*
// @namespace	https://git.sr.ht/~remph/unfix.js
// @homepageURL	https://git.sr.ht/~remph/unfix.js
// @supportURL	https://git.sr.ht/~remph/unfix.js
// @grant	none
// @compatible	firefox
// @downloadURL https://update.greasyfork.org/scripts/521172/Unfix.user.js
// @updateURL https://update.greasyfork.org/scripts/521172/Unfix.meta.js
// ==/UserScript==

'use strict';

function unfix_element(e) {
	var newpos;
	switch (getComputedStyle(e).position) {
	case 'fixed':
		newpos = 'absolute';
		break;
	case 'sticky':
		newpos = 'relative';
	}
	if (newpos) {
//		console.debug('setting ' + e.tagName + ' to ' + newpos);
		e.style.setProperty('position', newpos, 'important');
		/* I would rather not have abused !important ^ here, to let
		   pages specify when the position really *is* important
		   and shouldn't be elided, but no-one can be responsible
		   with it so I will take it away */
	}
}

function unfix_tree(root) {
	if (root.nodeType !== Node.ELEMENT_NODE)
		return;
	unfix_element(root);
	// NodeFilter.SHOW_ATTRIBUTE ?
	var t = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
	while (t.nextNode())
		unfix_element(t.currentNode);
}

(function () {
	// wait for window to finish loading to prevent races on style
	window.addEventListener('load', () => unfix_tree(document.body));

	// Catch sneaky attempts to re-fix an element from js
	new MutationObserver((muts) => muts.forEach(function (mut) {
		/* Are these sure to be mutually exclusive? Can an
		   attributes change also have addedNodes? */
		switch (mut.type) {
		case 'attributes':
			unfix_element(mut.target); // if (mut.attributeName == 'style') ?
			break;
		case 'childList':
			mut.addedNodes.forEach(unfix_tree);
		}
	})).observe(document.body, {
		subtree: true, childList: true, attributes: true
	});
})();