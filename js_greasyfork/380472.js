// ==UserScript==
// @name         Facebook ads blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       HuuKhanh
// @match        https://www.facebook.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380472/Facebook%20ads%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/380472/Facebook%20ads%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
	var as = document.querySelectorAll('a[role="link"][href="#"]');
	as.forEach(function(a) {
		a.closest('div[data-testid="fbfeed_story"]').remove();
	})
}, 3000);
})();