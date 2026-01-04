// ==UserScript==      
// @name         Youtube Music Video Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the annoying video player on youtube music
// @author       You
// @match        https://music.youtube.com/watch*
// @match        https://music.youtube.com*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435562/Youtube%20Music%20Video%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/435562/Youtube%20Music%20Video%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //MutationObserver
    const elementToObserve = document.querySelector("#main-panel");
    //Remove
    const observer = new MutationObserver(function() {
        elementToObserve.remove();
    });

    observer.observe(elementToObserve, {subtree: true, childList: true});

})();