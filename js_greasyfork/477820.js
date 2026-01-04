// ==UserScript==
// @name         YouTube Propaganda Remover
// @author       maejok-xx
// @namespace    https://greasyfork.org/en/users/889061-maejok-xx
// @version      0.2
// @description  Removes the "clarifications" and "context" from under YouTube videos and search page
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @match        https://*.youtube.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477820/YouTube%20Propaganda%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/477820/YouTube%20Propaganda%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Propaganda Remover Started...");
    var r = 100;
    const interval = setInterval(function (){
        if (r === 0){clearInterval(interval);}
        const clarifyBoxElement = document.getElementById('clarify-box'); // found on watch page
        if (clarifyBoxElement) {
            clarifyBoxElement.parentNode.removeChild(clarifyBoxElement)
            console.log("Propaganda Removed")
        }

        const clarificationRenderElement = document.querySelector('ytd-clarification-renderer'); // found on watch page
        if (clarificationRenderElement) {
            clarificationRenderElement.parentNode.removeChild(clarificationRenderElement);
            console.log("Propaganda Removed");
        }

        document.querySelectorAll('yt-formatted-string').forEach(function(element) { // found on search page
            if (element.innerText === 'Context') {
                const parentElement = element.closest('ytd-info-panel-container-renderer');
                parentElement.remove();
                console.log("Propaganda Removed");
            }
        })
        r--;
    }, 1);
})();