// ==UserScript==
// @name         geezerModeform4c
// @namespace    https://cytu.be/r/m4c
// @version      0.9
// @description  makes chatbox bigger
// @author       udnidgnik
// @match        https://cytu.be/r/m4c
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530872/geezerModeform4c.user.js
// @updateURL https://update.greasyfork.org/scripts/530872/geezerModeform4c.meta.js
// ==/UserScript==
     
(function() {
    'use strict';

    // Function to check for the element and apply style
    function changeFontSize() {
        const messageBuffer = document.getElementById('messagebuffer');
        if (messageBuffer) {
            messageBuffer.style.fontSize = '2em';
            console.log('Font size changed!');
            observer.disconnect(); // Stop watching after element is found
        }
    }

    // Use MutationObserver to detect when DOM updates
    const observer = new MutationObserver(changeFontSize);
    observer.observe(document.body, { childList: true, subtree: true });

    // Run once in case the element is already there
    changeFontSize();
})();