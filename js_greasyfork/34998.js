// ==UserScript==
// @name         Aliexpress easy order confirmation
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Adding a functionality to open the confirm order pages in a new tab with a middle click on the buttons and check all check boxes automatically 
// @author       Sela Oren
// @match        https://trade.aliexpress.com/orderList.htm*
// @match        https://trade.aliexpress.com/order_list.htm*
// @match        https://trade.aliexpress.com/order_detail.htm*
// @grant        unsafeWindow
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/34998/Aliexpress%20easy%20order%20confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/34998/Aliexpress%20easy%20order%20confirmation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.onmousedown = function(e) { if (e.button === 1) return false; };

    $(".button-confirmOrderReceived").attr("onmouseup", "whichButton(event);").attr("oncontextmenu", "event.preventDefault();"); // add middke click event to buttons
	unsafeWindow.whichButton = function (e) {
		let btnCode = e.button;
		if (btnCode == 1) {
			window.open('https://trade.aliexpress.com/order_detail.htm?orderId='+e.path[0].getAttribute("orderid"),'_blank');
		return false;
		}
	};

    $(':checkbox').prop('checked', true); // check all check boxes, it's for the confirm order page
})();