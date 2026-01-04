// ==UserScript==
// @name         CityU: Redirect sciencedirect
// @description  A script for CityU students to redirect sciencedirect hyperlink.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       JY
// @include      http://*.*
// @include      https://*.*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/433995/CityU%3A%20Redirect%20sciencedirect.user.js
// @updateURL https://update.greasyfork.org/scripts/433995/CityU%3A%20Redirect%20sciencedirect.meta.js
// ==/UserScript==

window.onload = function() {
	'use strict';
    $('a[href*="www.sciencedirect.com"]').each(function() {
    	console.log('Contains sciencedirect href');
    	// console.log(this.href);
	    if ( this.href.match(/http[s]?:\/\/www.sciencedirect.com/) ) {
	    	console.log("match")
	        this.href = this.href.replace(/http[s]?:\/\/www.sciencedirect.com/, 'https://www-sciencedirect-com.ezproxy.cityu.edu.hk');
	    }
	});
}