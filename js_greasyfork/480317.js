// ==UserScript==
// @name         Bing Video Search - Related Videos Links Href
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sets href on related videos so they work like normal links
// @author       csomerville
// @license      MIT
// @run-at      document-idle
// @match        *://*.bing.com/videos/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480317/Bing%20Video%20Search%20-%20Related%20Videos%20Links%20Href.user.js
// @updateURL https://update.greasyfork.org/scripts/480317/Bing%20Video%20Search%20-%20Related%20Videos%20Links%20Href.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const callback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.matches && node.matches('#mm_relvid')) {
                        Array.from(document.getElementsByClassName("vta isv")).forEach((el) => {
                            let u = new URL(window.location);
                            u.searchParams.set("mid", JSON.parse(el.getElementsByClassName("vrhdata")[0].getAttribute('vrhm')).mid);
                            el.setAttribute("href", u);
                        });
                    }
                });
            }
        }
    };

    const observer = new MutationObserver(callback);
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();