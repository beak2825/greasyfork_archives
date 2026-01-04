// ==UserScript==
// @name            "View Reddit in the app" mobile pop-up remover
// @namespace       redditmobilepopupclose
// @include         http://*.reddit.com/*
// @include         https://*.reddit.com/*
// @description:en  Removes the "View Reddit in the app" when accessing reddit on mobile
// @version         1.0
// @run-at          document-start
// @grant           none
// @description Removes the "View Reddit in the app" when accessing reddit on mobile
// @downloadURL https://update.greasyfork.org/scripts/36031/%22View%20Reddit%20in%20the%20app%22%20mobile%20pop-up%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/36031/%22View%20Reddit%20in%20the%20app%22%20mobile%20pop-up%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    localStorage.setItem('bannerLastClosed', new Date());
})();