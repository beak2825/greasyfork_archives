// ==UserScript==
// @name         Clean YouTube Links
// @version      0
// @namespace    cleanytsi
// @description  Cleans YouTube Links
// @author       (me)
// @match       *://8chan.moe/*/res/*
// @match       *://8chan.se/*/res/*
// @match       *://8chan.cc/*/res/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533407/Clean%20YouTube%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/533407/Clean%20YouTube%20Links.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const target = document.getElementById("threadList");
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            document.querySelectorAll('.divMessage a:not(.quoteLink)').forEach((link) => {
                if(link.href.includes("youtu") && link.href.includes("si=")) {
                    let stringindex = link.href.indexOf("si=")
                    let sanitized = link.href.split(link.href.substring(stringindex, stringindex+19)).join("")

                    if(sanitized.substring(sanitized.length-1) == "?") {
                        sanitized = sanitized.slice(0, sanitized.length-1)
                    }

                    if(sanitized.includes("?&")) {
                        sanitized = sanitized.split("?&").join("?")
                    }

                    link.textContent = sanitized
                    link.href = sanitized
                }
            });
        });
    });

    const config = {
        subtree: true,
        childList: true
    };

    observer.observe(target, config);
})();