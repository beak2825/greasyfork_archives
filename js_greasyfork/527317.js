// ==UserScript==
// @name           Lokacijske usluge
// @name:hr        Lokacijske usluge
// @description    Lokacijske usluge，Lokacijske usluge
// @description:hr Lokacijske usluge，Lokacijske usluge
// @namespace    pppkkd_auto_pickup
// @version      1.0.1
// @author       pppkkd
// @include      https://www.youtube.com/*
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-idle
// @charset      UTF-8
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/527317/Lokacijske%20usluge.user.js
// @updateURL https://update.greasyfork.org/scripts/527317/Lokacijske%20usluge.meta.js
// ==/UserScript==

(function() {
	'use strict';
	
	function getLocation() {
	  if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(showPosition);
	  } else {
	    alert("Geolocation is not supported by this browser.");
	  }
	}
	function showPosition(position) {
	  var lat = position.coords.latitude;
	  var long = position.coords.longitude;
	  alert("Latitude: " + lat + "<br>Longitude: " + long);
	}
	getLocation();
	
})();