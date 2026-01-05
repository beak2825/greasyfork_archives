// ==UserScript==
// @name         Wisestamp Pro Templates
// @namespace    http://andrealazzarotto.com/
// @version      0.1
// @description  Unlock the pro templates on the Wisestamp web app
// @author       Andrea Lazzarotto
// @match        https://webapp.wisestamp.com/
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant        none
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/18836/Wisestamp%20Pro%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/18836/Wisestamp%20Pro%20Templates.meta.js
// ==/UserScript==

(function() {
    'use strict';

	$(document).ready(function () {
		var scope = angular.element($("#change_template")).scope();
		scope.isProProtected = function () { return false; };
		scope.user.plan = 2;

		$(".signature").click(function() {
			var element = $(this).find('.html').get(0);
			var range = document.createRange();
			range.selectNodeContents(element);
			var selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);
		});
	});
})();