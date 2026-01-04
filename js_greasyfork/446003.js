// ==UserScript==
// @name         Tiny URL - Skip Loading Screen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip annoying 3 second loading screen on TinyUrl links
// @author       JohnFarrell.dev
// @match        https://tinyurl.is/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tinyurl.is
// @downloadURL https://update.greasyfork.org/scripts/446003/Tiny%20URL%20-%20Skip%20Loading%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/446003/Tiny%20URL%20-%20Skip%20Loading%20Screen.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    let isNavigating = false;

    const callback = function() {
        const skipATag = document.querySelector("ul > li > a")
        if(skipATag && !isNavigating) {
            const link = skipATag.href;
            window.location.replace(link);
            isNavigating = true;
        }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
