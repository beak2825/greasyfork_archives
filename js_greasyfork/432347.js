// ==UserScript==
// @name         CityU: Redirect Springer
// @description  A script for CityU students to redirect Springer hyperlink.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       JY
// @include      http://*.*
// @include      https://*.*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/432347/CityU%3A%20Redirect%20Springer.user.js
// @updateURL https://update.greasyfork.org/scripts/432347/CityU%3A%20Redirect%20Springer.meta.js
// ==/UserScript==

window.onload = function() {
	'use strict';
    $('a[href*="link.springer.com"]').each(function() {
    	console.log('Contains Springer href');
    	// console.log(this.href);
	    if ( this.href.match(/http[s]?:\/\/link.springer.com/) ) {
	    	console.log("match")
	        this.href = this.href.replace(/http[s]?:\/\/link.springer.com/, 'https://link-springer-com.ezproxy.cityu.edu.hk');
	    }
	});
}