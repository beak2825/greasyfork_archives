// ==UserScript==
// @name         Wanikani: Hide System Alert
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Adds button to dismiss system alerts
// @author       Kumirei
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387793/Wanikani%3A%20Hide%20System%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/387793/Wanikani%3A%20Hide%20System%20Alert.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function() {
	var last_alert = localStorage.getItem('WKHideSysAlert');
	var alert = $('.system-alert')[0];
	var text = alert.children[0].childNodes[1].textContent;
	if (text == last_alert) alert.remove();
	else {
		var btn = $('<div style="position:relative;"><span style="'+
					'    color: black !important;'+
					'    position: absolute;'+
					'    right: -21px;'+
					'    top: -4px;'+
					'    cursor: pointer;'+
					'    font-weight: 800;'+
					'">x</span></div>')[0];
		btn.onclick = ()=>{localStorage.setItem('WKHideSysAlert', text); alert.remove();}
		alert.prepend(btn);
	}
})();
