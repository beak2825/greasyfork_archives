// ==UserScript==
// @name CH Redirect
// @namespace Violentmonkey Scripts
// @locale en
// @grant none
// @include /^http?://www\.collegehumor\.com.au/.*$/
// @include collegehumor.com.au
// @description Fixes blank pages showing up on the Australian College Humour site.
// @version 0.1.0
// @downloadURL https://update.greasyfork.org/scripts/26749/CH%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/26749/CH%20Redirect.meta.js
// ==/UserScript==

if(window.location.hostname.indexOf("www.collegehumor.com.au") > -1 ){
	url = "http://www.collegehumor.com" + window.location.pathname;
	window.location.assign(url + "?&edition=global");
    exit;
}