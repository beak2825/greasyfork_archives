// ==UserScript==
// @name     Make die-staemme chat great again
// @include  https://*.die-staemme.de/*
// @grant    GM_addStyle
// @run-at   document-start
// @version  1.0
// @namespace die-staemme.bigger.chat
// @description blabla
// @downloadURL https://update.greasyfork.org/scripts/377256/Make%20die-staemme%20chat%20great%20again.user.js
// @updateURL https://update.greasyfork.org/scripts/377256/Make%20die-staemme%20chat%20great%20again.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle ( `
.chat-body {
height: 600px;
}
` );
})();
