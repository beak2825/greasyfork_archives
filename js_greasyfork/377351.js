// ==UserScript==
// @name         Steam Linkfilter Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes Steams linkfilter url from url on steamcommunity pages, and replaces them with the correct target url. Script writen by https://github.com/corylulu
// @author       Ryonez (script by corylulu)
// @match        https://steamcommunity.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/377351/Steam%20Linkfilter%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/377351/Steam%20Linkfilter%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function processLink(el) {
        var href = el.href;
        if(href) {
            var match = href.match(/https:\/\/steamcommunity.com\/linkfilter\/\?url\=(.*)/);
            if(match) {
                el.href = decodeURIComponent(match[1]);
            }
        }
    }
    // Wait for page to load a bit more, just in case
    setTimeout(function() {
        Array.prototype.forEach.call(document.querySelectorAll('a'), function(el, i) {
            processLink(el);
        });

        // Observer to watch for new links on the page.
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (!mutation.addedNodes) return;
                // For each added node that isn't just plain text, add the same link listener.
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.nodeName !== "#text") {
                        Array.prototype.forEach.call(node.querySelectorAll('a'), function(el, i) {
                            processLink(el);
                        });
                    }
                }
            })
        })

        // WARNING: You'll want to tailor this for the site because if it
        //          does a lot of dynamic loading, it can bog things down.
        //          My script monitors for "div.content" to work on reddit,
        //          because that's as specific as I need to be, but using it
        //          on "body" will bog things down when new things load in
        observer.observe(document.querySelector("body"), {
            childList: true
            , subtree: true
            , attributes: false
            , characterData: false
        });
    }, 2000);
})();