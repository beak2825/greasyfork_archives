// ==UserScript==
// @name         Toped Bayar
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       Jamielcs
// @match        https://www.tokopedia.com/cart/shipment?ref=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376395/Toped%20Bayar.user.js
// @updateURL https://update.greasyfork.org/scripts/376395/Toped%20Bayar.meta.js
// ==/UserScript==

(function() {
    'use strict';   
    
setTimeout(function() {
    var as = document.querySelectorAll('div.toggle-handler');
		for(var i = 0; i < as.length; i++) {
				var kw = as[i].click();
				console.log(kw);
		}               
}, 1500);
	
	
setTimeout(function() {
 var asu = document.querySelectorAll('div.rbh__item-label');
 for(var i = 0; i < asu.length; i++) {
    var dus = asu[i].click();
    console.log(i);
}   

}, 2000);

setTimeout(function() {
 document.querySelectorAll('div.btn.proceed-button')[0].click();
}, 3500);

})();