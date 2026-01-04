// ==UserScript==
// @name         TaxACT.com keep-alive
// @namespace    http://tampermonkey.net/
// @version      2025-04-13
// @description  Keep TaxACT session alive.
// @author       You
// @match        https://www.taxact.com/*timeout_warning*
// @exclude      https://www.taxact.com/taxmanager/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taxact.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js#sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532748/TaxACTcom%20keep-alive.user.js
// @updateURL https://update.greasyfork.org/scripts/532748/TaxACTcom%20keep-alive.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var scriptName = "mainLoopKeepAlive";
    console.log(scriptName, "Starting for URL ", location.href);
    if (typeof(window[scriptName]) !== "undefined") {
        console.log(scriptName, "Running a 2nd time... abort.");
        return;
    }

    var keepAliveCheck = function() {
        return $("h1:contains('Do you want to continue using TaxAct Online?')").length > 0;
    };

    var keepAliveFn = function() {
        console.log(scriptName, "Clicking continue");
        $("button:contains('Continue')").click();
    };

    var callPageFn = function(page) {
        setTimeout(function() {
            page.fn();
        }, 300 + (500 * Math.random()));
    };

    var pages = {
        keepAlive: { check: keepAliveCheck, fn: keepAliveFn }
    };
    var currentPage = undefined;
    console.log(scriptName, "Starting main loop...");
    window[scriptName] = window.setInterval(function() {
        if (document.readyState !== "complete") {
            return;
        }
        // console.log(scriptName, "current page:", currentPage, "; title: ", title);
        for (var pageName in pages) {
            if (currentPage === pageName) {
                continue;
            }
            var page = pages[pageName];
            if (page.check()) {
                console.log(scriptName, "url ", location.href, " from page ", currentPage, " to ", pageName);
                currentPage = pageName;
                callPageFn(page);
            }
        }
    }, 200);
})();