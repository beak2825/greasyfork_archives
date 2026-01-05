// ==UserScript==
// @name         RLTracker - Hide "Data can be inaccurate" error message in modal
// @namespace    https://greasyfork.org/en/scripts/28156-rltracker-hide-data-can-be-inaccurate-error-message-in-modal
// @author       Mato
// @version      1.0.2
// @description  Hide the "Please be aware that this Data can be inaccurate." message when viewing current rating modal.
// @match        *://rltracker.pro/*
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28156/RLTracker%20-%20Hide%20%22Data%20can%20be%20inaccurate%22%20error%20message%20in%20modal.user.js
// @updateURL https://update.greasyfork.org/scripts/28156/RLTracker%20-%20Hide%20%22Data%20can%20be%20inaccurate%22%20error%20message%20in%20modal.meta.js
// ==/UserScript==

(function() {
    'use strict';

GM_addStyle(".modal-body .alert.alert-danger { display: none !important; }");
})();