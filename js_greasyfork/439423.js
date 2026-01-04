// ==UserScript==
// @name         Fix Reddit Links
// @namespace    https://github.com/ipha/userscripts
// @version      1.0
// @description  Fix improper escaping(\_) of userscores in reddit
// @author       ipha
// @license      MIT
// @include      https://*.reddit.com/*/comments/*
// @include      https://*.reddit.com/user/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/439423/Fix%20Reddit%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/439423/Fix%20Reddit%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function fixLinks() {
        //var start = Date.now();
        document.querySelectorAll('a[href*="%5C_"').forEach((element) => {
            console.log("Fixing: " + element.href);
            element.href = element.href.replace('%5C_', '_');
            element.textContent = element.textContent.replace('\\_', '_');
        });
        //var end = Date.now();
        //console.log("Fix took: " + (end - start) + "ms");
    }

    function mutationCallback(mutations) {
        fixLinks();
    }

    // Fix links on static page
    fixLinks();

    // Watch for page updates on comments
    if (window.location.href.includes("/comments/")) {
        var observer = new MutationObserver(mutationCallback);
        observer.observe(document.querySelector('.commentarea > .sitetable'), {
            attributes: false,
            childList: true,
            subtree: false
        });
    }
})();