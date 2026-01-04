// ==UserScript==
// @name         Better old.reddit.com redirect.
// @namespace    https://www.reddit.com/
// @version      1.0
// @description  Checks to see if you are looking at the new design, sends you to the old design if you are.
// @author       clambake 42
// @match        https://www.reddit.com/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/386397/Better%20oldredditcom%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/386397/Better%20oldredditcom%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var getLocation = function(href) {
        var l = document.createElement("a");
        l.href = href;
        return l;
    };
    var windowLocation = window.location.href;
    var parsedLocation = getLocation(windowLocation);
    var betterLocation = "https://old.reddit.com"+parsedLocation.pathname;
    window.location.replace(betterLocation);
})();
