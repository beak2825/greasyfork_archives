// ==UserScript==
// @name         RabbitMQ MGMT UI Additions
// @namespace    cpriest
// @version      0.1
// @description  Depends on rabbitmq being in the URL somewhere
//                 • Adds Update every 1 & .5 second to rabbitmq UI's
// @author       Clint Priest
// @homepage	 https://github.com/cpriest/userscripts/tree/master/RabbitMQ
// @include      http*://*rabbitmq*
// @grant        none
// @license		 MIT
// @compatible 	 firefox
// @compatible 	 chrome
// @compatible 	 opera
// @compatible 	 safari
// @downloadURL https://update.greasyfork.org/scripts/387807/RabbitMQ%20MGMT%20UI%20Additions.user.js
// @updateURL https://update.greasyfork.org/scripts/387807/RabbitMQ%20MGMT%20UI%20Additions.meta.js
// ==/UserScript==

(function() {
    'use strict';
	if(!document.querySelector('IMG[src="img/rabbitmqlogo.png"]'))
		return;

	let sel = document.querySelector('SELECT#update-every');
	if(sel) {
		sel.innerHTML = '<option value="500">Refresh every 1/2 second</option>' +
			'<option value="1000">Refresh every 1 second</option>' + sel.innerHTML;
		sel.selectedIndex = 2;
	}
})();
