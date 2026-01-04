// ==UserScript==
// @name     Wikipedia No Navigation
// @description:en Remove surrounding navigation bars and links
// @version  1
// @include     http*://*.wikipedia.org/**
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/177979
// @description Remove surrounding navigation bars and links
// @downloadURL https://update.greasyfork.org/scripts/40269/Wikipedia%20No%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/40269/Wikipedia%20No%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function GM_addStyle_from_string(str) {
        var node = document.createElement('style');
        node.innerHTML = str;
        document.body.appendChild(node);
    }

    //var cssSrc = GM_getResourceText ("readableWikipediaCss");

    var cssSrc = `
#mw-page-base, #mw-head, #mw-panel  {
	height: 0 !important;
	width: 0 !important;
	display: none !important;
}


#content {
	margin-left: 0;
}`;

    GM_addStyle_from_string(cssSrc);
})();