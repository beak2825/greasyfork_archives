// ==UserScript==
// @name         SillyTavern Screenreader Accessibility Fixes
// @namespace    http://tampermonkey.net/
// @version      2024-08-11
// @description  Adds Aria labels and roles to the various divs in SillyTavern.
// @author  originally by chigkim, userscriptified by fastfinge
// @match        http://127.0.0.1:8000/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @grant        none
// @license public domain
// @downloadURL https://update.greasyfork.org/scripts/503246/SillyTavern%20Screenreader%20Accessibility%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/503246/SillyTavern%20Screenreader%20Accessibility%20Fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var divs = document.querySelectorAll('div');
divs.forEach(function(div) {
	if (div.textContent.trim() === '' && div.hasAttribute('title')) {
		div.setAttribute('aria-label', div.getAttribute('title'));
		div.setAttribute('role', 'button');
	}
});
})();