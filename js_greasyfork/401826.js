// ==UserScript==
// @name            ZeldaMaps CIHotKey
// @version         2020.04.23
// @description     Hot Key for "Completed Items" option in zeldamaps.com
// @include         http*://*zeldamaps.com*
// @author          Rainbow-Spike
// @namespace       https://greasyfork.org/users/7568
// @homepage        https://greasyfork.org/ru/users/7568-dr-yukon
// @icon            https://www.google.com/s2/favicons?domain=zeldamaps.com
// @grant           none
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/401826/ZeldaMaps%20CIHotKey.user.js
// @updateURL https://update.greasyfork.org/scripts/401826/ZeldaMaps%20CIHotKey.meta.js
// ==/UserScript==

function access ( ) {
	document.querySelector ( '.infoWindowIcn' ).accessKey = "p";
}

setTimeout ( access, 10000 )
