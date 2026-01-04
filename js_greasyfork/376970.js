// ==UserScript==
// @name         Buffstreamz Football
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo/related?hl=en
// @include      http://app.actiontiles.com/panel/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376970/Buffstreamz%20Football.user.js
// @updateURL https://update.greasyfork.org/scripts/376970/Buffstreamz%20Football.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval(function(){
        window.location.reload();
    }, 480000);
})();