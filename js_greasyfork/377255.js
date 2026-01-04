// ==UserScript==
// @name     _Override banner_url styles
// @include  https://*.die-staemme.de/*
// @grant    GM_addStyle
// @run-at   document-start
// @version  1.0
// @namespace die-staemme.bigger.chat
// @description blabla
// @downloadURL https://update.greasyfork.org/scripts/377255/_Override%20banner_url%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/377255/_Override%20banner_url%20styles.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle ( `
.chat-body {
height: 600px;
}
` );
})();
