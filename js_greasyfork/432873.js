// ==UserScript==
// @name Reddit outbound tracking blocker
// @description Probably removes Reddit spying on outbound clicks
// @match *://*.reddit.com/*
// @run-at document-end
// @version 0.0.1.20210924062318
// @namespace https://greasyfork.org/users/818500
// @downloadURL https://update.greasyfork.org/scripts/432873/Reddit%20outbound%20tracking%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/432873/Reddit%20outbound%20tracking%20blocker.meta.js
// ==/UserScript==

(function() {
    "use strict";

    $(".outbound").attr("data-outbound-url", null);
    $(".outbound").attr("data-href-url", null);
    $(".outbound").removeClass("outbound");
})();