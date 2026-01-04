// ==UserScript==
// @name        red
// @namespace   gametwist.com
// @run-at document-idle
// @description     reyuu
// @include     https://www.gametwist.com/en/specialpages/confirm-changed-email/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35353/red.user.js
// @updateURL https://update.greasyfork.org/scripts/35353/red.meta.js
// ==/UserScript==

setTimeout (function() {
    window.location.href    = "https://www.gametwist.com/en/registration/confirm-registration-email/?.nrgs-ce-token=cabcc0eb-290a-4da2-ab71-65bc2fa660f7";
    },
    7500 //-- 60 seconds
);

