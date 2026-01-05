// ==UserScript==
// @name         京东E卡余额
// @namespace    https://greasyfork.org/en/users/22079-hntee
// @version      0.1
// @description  查看当前页面所有E卡的余额
// @author       You
// @match        https://mygiftcard.jd.com/giftcard/bindingClosedList.action*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25076/%E4%BA%AC%E4%B8%9CE%E5%8D%A1%E4%BD%99%E9%A2%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/25076/%E4%BA%AC%E4%B8%9CE%E5%8D%A1%E4%BD%99%E9%A2%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var prices = $('#detailPage > tbody td:nth-child(4)')
    .map(function (index, c) {
		var price = c.textContent.substring(1); // remove ￥
		return parseFloat(price);
	});

    var sum = Array.from(prices).reduce((a, b) => a + b, 0);

    var anchor = $('#card02 > div.mt');

    var el = $("<div/>");
    el.css("display","block");
    el.text("总余额："+sum);

    anchor.append(el);

})();