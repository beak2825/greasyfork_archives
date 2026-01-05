// ==UserScript==
// @name           eUkraine Battle Orders
// @namespace      www.erepublik.com
// @version        0.01
// @author         vist
// @description    Orders for eUkraine in eRepublik.
// @include        http*erepublik.com*
// @connect        docs.google.com
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/19611/eUkraine%20Battle%20Orders.user.js
// @updateURL https://update.greasyfork.org/scripts/19611/eUkraine%20Battle%20Orders.meta.js
// ==/UserScript==

(function(window, undefined){
	var w;
	if(unsafeWindow != "undefined")
	{
		w = unsafeWindow;
	}
	else
	{
		w = window;
	}
	if(w.self != w.top)
	{
		return;
	}

	console.log('init: ' + GM_info.script.name);

	var mapContainer = jQuery('#mapContainer');
	if(mapContainer.length)
	{
		GM_xmlhttpRequest({
			method: 'GET',
			// url: 'https://docs.google.com/spreadsheets/d/1hkNxf004pUl_8gb8e0Bh4W2ryavzntTw7JG5YLVNET4/edit?usp=drive_web',
			url: 'https://docs.google.com/spreadsheets/d/1hkNxf004pUl_8gb8e0Bh4W2ryavzntTw7JG5YLVNET4/pubhtml',

			onload:function(response){
				var page = jQuery(response.responseText);
				var table = page.find('table').html();
				mapContainer.after(table);
			}
		});
	}
})(window);
