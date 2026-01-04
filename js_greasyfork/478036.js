// ==UserScript==
// @name     https://greasyfork.org/en/users/1084379-afterxander
// @version  1
// @description Removes a specific dialog from YouTube pages
// @grant    none
// @match    https://www.youtube.com/*
// @license  MIT
// @namespace https://greasyfork.org/users/1084379
// @downloadURL https://update.greasyfork.org/scripts/478036/https%3Agreasyforkorgenusers1084379-afterxander.user.js
// @updateURL https://update.greasyfork.org/scripts/478036/https%3Agreasyforkorgenusers1084379-afterxander.meta.js
// ==/UserScript==

const targetNode = document.body;

const config = { childList: true, subtree: true };

const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            let element = document.querySelector('tp-yt-paper-dialog.style-scope.ytd-popup-container');
            if (element) {
                element.remove();
                console.log('Element removed');
            }
        }
    }
};

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);
