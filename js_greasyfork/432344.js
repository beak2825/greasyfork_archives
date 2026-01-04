// ==UserScript==
// @name         CityU: Redirect ACM
// @description  A script for CityU students to redirect ACM hyperlink.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       JY
// @include      http://*.*
// @include      https://*.*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/432344/CityU%3A%20Redirect%20ACM.user.js
// @updateURL https://update.greasyfork.org/scripts/432344/CityU%3A%20Redirect%20ACM.meta.js
// ==/UserScript==

window.onload = function() {
	'use strict';
    $('a[href*="dl.acm.org"]').each(function() {
    	console.log('Contains ACM href');
    	// console.log(this.href);
	    if ( this.href.match(/http[s]?:\/\/dl.acm.org/) ) {
	    	console.log("match")
	        this.href = this.href.replace(/http[s]?:\/\/dl.acm.org/, 'https://dl-acm-org.ezproxy.cityu.edu.hk');
	    }
	});
}