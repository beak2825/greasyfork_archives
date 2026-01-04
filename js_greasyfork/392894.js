// ==UserScript==
// @name         Backtrace Remove Dom
// @description delete Backtrace modal dom
// @version      0.1
// @author       Black-Hole
// @include      https://*.sp.backtrace.io/*
// @namespace https://greasyfork.org/users/104549
// @downloadURL https://update.greasyfork.org/scripts/392894/Backtrace%20Remove%20Dom.user.js
// @updateURL https://update.greasyfork.org/scripts/392894/Backtrace%20Remove%20Dom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var mutationCallback = function () {
        var dialog = document.querySelector("div[role='dialog']");
        dialog && document.body.removeChild(dialog);
    };

    var config = {
        childList: true,
        subtree: true
    };

    var observer = new MutationObserver(mutationCallback);

    observer.observe(document.body, config);

    window.onbeforeunload = function() {
        observer.disconnect();
    };
})();