// ==UserScript==
// @name         Holodex Autoplay
// @description  Enables autoplay on Holodex
// @icon         https://holodex.net/favicon.ico
// @namespace    sui-chan-wa-kyou-mo-kawaii
// @author       Hoshiyomi
// @version      1.02
// @match        https://holodex.net/*
// @downloadURL https://update.greasyfork.org/scripts/509099/Holodex%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/509099/Holodex%20Autoplay.meta.js
// ==/UserScript==

(function() {
    // Function to modify the iframe src and set autoplay
    function modifyIframeSrc(iframe) {
        var src = iframe.src;
        if (src.includes("youtube.com/embed") && !src.includes("autoplay=1")) {
            iframe.src = src.includes("?") ? src.replace("autoplay=0", "autoplay=1") + "&mute=1" : src + "?autoplay=1&mute=1";
        }
    }

    // Function to modify iframes that are already on the page
    function modifyExistingIframes() {
        var iframes = document.getElementsByTagName('iframe');
        for (var i = 0; i < iframes.length; i++) {
            modifyIframeSrc(iframes[i]);
        }
    }

    // Function to handle tab visibility change
    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            modifyExistingIframes();
        }
    }

    // MutationObserver to detect new or changed iframes
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Check if any added nodes are iframes
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'IFRAME') {
                        modifyIframeSrc(node);
                    }
                });
            } else if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                // Check if the src of an existing iframe was changed
                if (mutation.target.tagName === 'IFRAME') {
                    modifyIframeSrc(mutation.target);
                }
            }
        });
    });

    // Observe changes in the DOM for added/modified iframes
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Modify existing iframes on page load
    window.addEventListener('load', function() {
        modifyExistingIframes();
    });

    // Listen for visibility changes (tab switching)
    document.addEventListener('visibilitychange', handleVisibilityChange);
})();