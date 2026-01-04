// ==UserScript==
// @name         twitter origin image
// @namespace    http://qqboxy.blogspot.com
// @version      0.3
// @description  jump to origin image link
// @author       QQBoxy
// @match        *pbs.twimg.com/media/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31724/twitter%20origin%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/31724/twitter%20origin%20image.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var is_orig = window.location.href.match(/\:orig$/);
    if(!is_orig) {
		var match = window.location.pathname.match(/^([^:]+)(\:?[^:]*)$/);
    	window.location.href = window.location.origin + match[1] +":orig";
    }
})();