// ==UserScript==
// @name         Stop Youtube Autoplay on Feedly
// @namespace    Fluffeh
// @version      0.2
// @description  Prevents embedded Youtube videos from autoplaying on Feedly
// @author       Fluffeh
// @match        http://feedly.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25174/Stop%20Youtube%20Autoplay%20on%20Feedly.user.js
// @updateURL https://update.greasyfork.org/scripts/25174/Stop%20Youtube%20Autoplay%20on%20Feedly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE)
                {
                    var videos = node.querySelectorAll("iframe[src]");
                    Array.prototype.forEach.call(videos, function(video, i) {
                        video.setAttribute("src",
                                           video
                                           .getAttribute("src")
                                           .replace("autoplay=1", "autoplay=0"));
                    });
                }
            });
        });
    });

    var config = {childList:true, subtree:true};

    observer.observe(document, config);
})();