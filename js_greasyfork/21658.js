// ==UserScript==
// @name         Wanikanify Extension
// @namespace    https://greasyfork.org/users/649
// @version      1.0.5
// @description  Adds a class to wanikanify elements so you can do special styling when it's in japanese
// @author       Adrien Pyke
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21658/Wanikanify%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/21658/Wanikanify%20Extension.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var Util = {
		qq: function(query, context) {
			return [].slice.call((context || document).querySelectorAll(query));
		}
	};

	var processVocab = function() {
		Util.qq('.wanikanified').forEach(function(vocab) {
			if(vocab.dataset.jp === vocab.textContent) {
				vocab.classList.add('wanikanified-jp');
			} else {
				vocab.classList.remove('wanikanified-jp');
			}
		});
	};
	processVocab();

	var obs = new MutationObserver(processVocab);
	obs.observe(document.body, {subtree: true, childList: true});
})();