// ==UserScript==
// @name         Dota 2 Hero Build Editor: Author Note Fix
// @version      0.1
// @description  Fixes an issue with the hero builder that removes the author note on mouseover
// @author       Luxocracy
// @match        http://www.dota2.com/workshop/builds*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/30239
// @downloadURL https://update.greasyfork.org/scripts/19169/Dota%202%20Hero%20Build%20Editor%3A%20Author%20Note%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/19169/Dota%202%20Hero%20Build%20Editor%3A%20Author%20Note%20Fix.meta.js
// ==/UserScript==

(function() {
	/*jshint multistr: true */
    'use strict';

	GM_addStyle('\
	#editTooltip.fixedTooltip {\
		position: absolute;\
		text-align: left;\
		float: left;\
		border: solid #000 1px;\
		background-color: #111;\
		width: 410px;\
		padding: 12px;\
		background: -moz-linear-gradient(top, #2e2e2d, #000000);\
		z-index: 100;\
	}');

	var editTooltip;
	var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.addedNodes.length > 0 && mutation.addedNodes[0].id === "editTooltip") {
                editTooltip = document.querySelector('#editTooltip');
				editTooltip.className = 'fixedTooltip';
                observer.disconnect();
            }
        });
    });

    observer.observe(document.querySelector('body'), { childList: true, subtree: true });
})();