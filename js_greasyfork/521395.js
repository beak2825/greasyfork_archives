// ==UserScript==
// @name		   wings.io AdBlock
// @namespace	  https://github.com/AbdurazaaqMohammed
// @version		1.0
// @author		 Abdurazaaq Mohammed
// @description	Remove ads on wings.io
// @match		  https://wings.io/
// @homepage	   https://github.com/AbdurazaaqMohammed/userscripts
// @license		The Unlicense
// @supportURL	 https://github.com/AbdurazaaqMohammed/userscripts/issues
// @grant		  none
// @downloadURL https://update.greasyfork.org/scripts/521395/wingsio%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/521395/wingsio%20AdBlock.meta.js
// ==/UserScript==
(function() {
	'use strict';
	(document.head || document.documentElement).appendChild(document.createElement('style')).textContent = ('#slot-1 *, #slot-3 *, #slot-4 *, #ads *, #slot-2 *, #slot-1, #slot-3, #slot-4, #ads, #slot-2 { display: none !important; }');
})();