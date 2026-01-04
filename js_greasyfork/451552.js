// ==UserScript==
// @name         traQ enter to submit first aid
// @namespace    https://github.com/tqkoh/traQ-enter-to-submit-first-aid
// @version      0.0.5
// @description  edge, chrome v105+ で traQ の enter でメッセージを送信できないバグの応急処置
// @author       tqk
// @match        https://q.trap.jp
// @match        https://q.trap.jp/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451552/traQ%20enter%20to%20submit%20first%20aid.user.js
// @updateURL https://update.greasyfork.org/scripts/451552/traQ%20enter%20to%20submit%20first%20aid.meta.js
// ==/UserScript==

(function() {
	'use strict';
	document.addEventListener('keydown', function (event) {
		if (event.key=='Enter' && !event.ctrlKey && !event.altKey && !event.shiftKey){
			document.querySelectorAll('[data-testid="message-send-button"]')[0].click();
		}
	}, false);
})();
