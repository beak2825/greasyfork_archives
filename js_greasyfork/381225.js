// ==UserScript==
// @name        Amazon Questions New Tab
// @namespace   iamMG
// @version     1.0
// @description Open questions page of Amazon products in a new tab.
// @author      iamMG
// @grant     	GM.openInTab
// @include		/^https?:\/\/(www.)?amazon.*\/[a-z]p\/.*/
// @run-at		document-end
// @license			MIT
// @icon			https://i.imgur.com/d5YE1Lv.png
// @copyright		2019, iamMG (https://openuserjs.org/users/iamMG)
// @downloadURL https://update.greasyfork.org/scripts/381225/Amazon%20Questions%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/381225/Amazon%20Questions%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var que = document.getElementById('askATFLink');
	que.addEventListener('click', function(e){
        this.removeAttribute('href');
		var matches = /((?:.*)amazon.(?:\w+))\/(?:.*)?([a-z]p)\/(?:product\/)?([^\/\?&]+)(?:.*|$)/.exec(document.URL);
		var link = "/ask/questions/asin/" + matches[3];
		window.open(window.location.protocol + "//" + window.location.host + link, "", "", false);
    }, false)
})();