// ==UserScript==
// @name           GaiaOnline: Link Trade Items (Double Click)
// @namespace      http://userscripts.org/users/62850
// @description    Links trade items to a market search (only items that were in the trade window when it the page loaded)
// @include        http://www.gaiaonline.com/gaia/bank.php*
// @version 0.0.1.20140525024111
// @downloadURL https://update.greasyfork.org/scripts/1641/GaiaOnline%3A%20Link%20Trade%20Items%20%28Double%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/1641/GaiaOnline%3A%20Link%20Trade%20Items%20%28Double%20Click%29.meta.js
// ==/UserScript==
var eles=document.getElementById('trade_panel');
if(eles){
	eles=eles.getElementsByClassName('item_image');
	for(var i=0;i<eles.length;i++){
		eles[i].setAttribute('ondblclick',"window.open('/marketplace/itemsearch/?search="+escape(eles[i].title)+"&filter=0&floor=0&ceiling=No+Limit')");
	}
}