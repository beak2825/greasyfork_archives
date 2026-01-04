// ==UserScript==
// @name        cerberus_update
// @namespace   cerberus_update
// @include     http://cerberus.intr/index.php/pages/147-Support
// @version     1
// @grant       none
// @description cerberus_auto_update
// @downloadURL https://update.greasyfork.org/scripts/35552/cerberus_update.user.js
// @updateURL https://update.greasyfork.org/scripts/35552/cerberus_update.meta.js
// ==/UserScript==
console.log("Cerberus_updatet was runing");setInterval(function() {
console.log("update " + new Date());
genericAjaxGet('viewcust_1624','c=internal&a=viewRefresh&id=cust_1624');
genericAjaxGet('viewcust_600','c=internal&a=viewRefresh&id=cust_600');
}, 5000*60);
