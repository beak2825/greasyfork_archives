// ==UserScript==
// @name        Add Dissent Comments To Reddit
// @description Dissent 
// @include       *
// @match https://*.reddit.com/*comments
// @match https://*.youtube.com/*
// @grant       GM_addStyle
// @require http://code.jquery.com/jquery-latest.js
// @version      6.1
// @namespace https://greasyfork.org/users/291068
// @downloadURL https://update.greasyfork.org/scripts/382717/Add%20Dissent%20Comments%20To%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/382717/Add%20Dissent%20Comments%20To%20Reddit.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('<div class="dissenterComments"><iframe style="z-index: 1000 !important; height: 100% !important; width: 100% !important; border: 0 !important;" src="https://dissenter.com/discussion/begin-extension?url=' + window.location.href + '"></iframe></div>' ).insertAfter( '*[data-test-id="post-content"]' );
});

GM_addStyle ( `
.dissenterComments {
    height: 600px !important;
	z-index: 2000 !important;
}
` );


