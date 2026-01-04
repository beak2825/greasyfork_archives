// ==UserScript==
// @name         Thucydides' Chaoyang Trap
// @namespace    https://chaoyang.substack.com/
// @version      0.1
// @description  Can Beijing and Washington avoid the Chaoyang Trap?
// @author       Tianyu Fang
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432854/Thucydides%27%20Chaoyang%20Trap.user.js
// @updateURL https://update.greasyfork.org/scripts/432854/Thucydides%27%20Chaoyang%20Trap.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// This script is adapted from Brock Adams:
	// https://stackoverflow.com/questions/24417791/replace-many-text-terms-using-
	// tampermonkey-without-affecting-urls-and-not-look/24419809

	var replaceArry = [
		[/Thucydides Trap/gi,    'Chaoyang Trap'],
		[/Thucydides\' Trap/gi,  'Chaoyang\'s Trap'],
		[/Thucydides\'s Trap/gi, 'Chaoyang\'s Trap'],
	];

	var numTerms = replaceArry.length;
	var txtWalker = document.createTreeWalker (
		document.body,
		NodeFilter.SHOW_TEXT,
		{acceptNode: function (node) {
            // Skip whitespace-only nodes
            if (node.nodeValue.trim() )
            	return NodeFilter.FILTER_ACCEPT;

            return NodeFilter.FILTER_SKIP;
        }
    },
    false
    );

	var txtNode = null;

	while (txtNode = txtWalker.nextNode()) {
		var oldTxt = txtNode.nodeValue;

		for (var J = 0; J < numTerms; J++) {
			oldTxt = oldTxt.replace(replaceArry[J][0], replaceArry[J][1]);
		}
		txtNode.nodeValue = oldTxt;
	}

})();