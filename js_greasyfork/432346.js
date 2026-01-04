// ==UserScript==
// @name         CityU: Redirect IEEE
// @description  A script for CityU students to redirect IEEE hyperlinks.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       JY
// @include      http://*.*
// @include      https://*.*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/432346/CityU%3A%20Redirect%20IEEE.user.js
// @updateURL https://update.greasyfork.org/scripts/432346/CityU%3A%20Redirect%20IEEE.meta.js
// ==/UserScript==

window.onload = function() {
	'use strict';
    $('a[href*="ieeexplore.ieee.org"]').each(function() {
    	console.log('Contains IEEE href');
    	// console.log(this.href);
	    if ( this.href.match(/http[s]?:\/\/ieeexplore.ieee.org/) ) {
	    	console.log("match")
	        this.href = this.href.replace(/http[s]?:\/\/ieeexplore.ieee.org/, 'https://ieeexplore-ieee-org.ezproxy.cityu.edu.hk');
	    }
	});
}